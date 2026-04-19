import { time } from "node:console";
import PersonCostList from "../models/CostList";
import ProjectProfit from "../models/ProjectProfit";
import TotalCount from "../models/TotalCount";
import WorkRecord from "../models/WorkRecord"
import Project from "../models/Project";

import { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";

//计算卡片数据：项目利润、项目成本、项目利润率、项目利润率排名
export const  getCardData = async (req: AuthRequest, res: Response) => {
   //计算人工成本
   try{
      // 申明变量
      let personcost = 0; // 总人工成本
      let materialcost = 0; // 总材料成本
      let projectprofit = 0; // 总项目利润
      let profitrate = 0; // 总利润率
      // 导入单前时间
      const now = new Date();
      const currentYear = now.getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);//年初时间戳
      const workrecord = await WorkRecord.find({
        userId: req.user.id,
        workDate: { $gte: startOfYear } // 大于等于今年1月1日
    });
    // 计算总人工成本
    workrecord.forEach((record) => {
      personcost += (record.dailyWage * record.workDay);
      materialcost += record.workExpense;
    });
    // 计算总材料成本
   const projects = await Project.find({ userId: req.user.id });
          // 遍历所有项目
    projects.forEach((project) => {
      // 遍历项目里的每一个耗材
      project.consumables.forEach((item) => {
        // 判断：材料购买时间 是否在今年内
        if (item.time && item.time >= startOfYear) {
          // 满足 → 累加材料成本
          materialcost += item.cost * item.num;
        }
      });
    });
    // 计算总项目利润(按开始时间)
    projects.forEach((project) => {
      // 判断：项目开始时间 是否在今年内
      if (project.startDate && project.startDate >= startOfYear) {
      //   项目流水
         projectprofit += (project.squareMeters * project.squareMeterPrice);
      }
    });
    projectprofit = projectprofit - personcost - materialcost;
   //  计算总利润率
    profitrate = projectprofit / (personcost + materialcost) * 100;

   //  写入数据库
      await TotalCount.deleteMany({ userId: req.user.id }); // 清空数据库
      await TotalCount.create({
         personCost: personcost,
         materialCost: materialcost,
         projectProfit: projectprofit,
         profitRate: profitrate,
         userId: req.user.id
      })
     return res.json({
       code:200,
       msg: '获取卡片数据成功',

       data:{
         personcost: personcost,
         materialcost: materialcost,
         projectprofit: projectprofit,
         profitrate: profitrate,
         time: now,
       } 
      })
   }catch(err){
      res.json({
         code:500,
         msg: '获取卡片数据失败',   
      })
   }   
};


// 统计每个月的人工成本、材料成本（含工人额外花费）
export const getMonthlyCost = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();

    // 1. 生成近6个月年月标识 YYYY-MM
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      last6Months.push(`${year}-${month}`);
    }

    // 初始化每月数据
    const monthlyData: Record<string, {
      personCost: number;   // 人工工资成本
      materialCost: number; // 材料成本（项目耗材 + 工人额外花费）
    }> = {};
    last6Months.forEach(month => {
      monthlyData[month] = { personCost: 0, materialCost: 0 };
    });

    // ==========================
    // 2. 处理所有做工记录
    // ==========================
    const workRecords = await WorkRecord.find({ userId: req.user.id });
    workRecords.forEach(record => {
      const d = new Date(record.workDate);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[ym]) return;

      // 人工工资
      monthlyData[ym].personCost += record.dailyWage * record.workDay;

      // 工人额外花费 → 计入【材料/其他成本】
      monthlyData[ym].materialCost += record.workExpense || 0;
    });

    // ==========================
    // 3. 处理项目耗材（材料）
    // ==========================
    const projects = await Project.find({ userId: req.user.id });
    projects.forEach(project => {
      project.consumables.forEach(item => {
        const d = new Date(item.time);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyData[ym]) return;

        // 项目材料费用
        monthlyData[ym].materialCost += (item.cost || 0) * (item.num || 0);
      });
    });

    // ==========================
    // 4. 组装前端友好格式
    // ==========================
    const result = last6Months.map(month => ({
      month: month,
      personCost: monthlyData[month].personCost,
      materialCost: monthlyData[month].materialCost,
      totalCost: monthlyData[month].personCost + monthlyData[month].materialCost
    }));

    res.json({
      code:200,
      msg: "获取月度成本成功",
      data: {
        timeRange: "近6个月",
        monthlyCost: result
      }
    });

  } catch (err) {
    console.error("月度成本统计错误:", err);
    res.status(500).json({ message: "统计月度成本失败" });
  }
};


// 统计项目利润排行（只返回 projectId, projectName, profit）
export const getProjectProfitRank = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    const rankList = [];

    for (const project of projects) {
      const projectId = project._id;
      const projectName = project.projectName;

      // 1. 查询当前项目所有做工记录（只查询当前用户的数据）
      const workrecords = await WorkRecord.find({ projectId: projectId, userId: req.user.id });

      // 2. 计算人工成本 + 额外花费
      let totalPersonCost = 0;
      let totalWorkExpense = 0;
      workrecords.forEach((item) => {
        totalPersonCost += item.dailyWage * item.workDay;
        totalWorkExpense += item.workExpense || 0;
      });

      // 3. 计算材料成本
      let totalMaterialCost = 0;
      project.consumables.forEach((item) => {
        totalMaterialCost += item.cost * item.num;
      });

      // 4. 总成本
      const totalCost = totalPersonCost + totalWorkExpense + totalMaterialCost;

      // 5. 总收入
      const totalIncome = project.squareMeters * project.squareMeterPrice;

      // 6. 利润（你要的最终值）
      const profit = totalIncome - totalCost;

      // ✅ 只返回你Schema需要的3个字段
      rankList.push({
        projectId: projectId,
        projectName: projectName,
        profit: profit
      });
    }

    // 按利润从高到低排序
    rankList.sort((a, b) => b.profit - a.profit);

    // 返回最终排行
    res.json({
      code:200,
      msg: "获取项目利润排行成功",
      data: rankList
    });

  } catch (err) {
    console.error("获取利润排行失败：", err);
    res.status(500).json({ message: "获取项目利润排行失败" });
  }
};