import Project from "../models/Project";
import type { Request, Response } from "express"
import WorkRecord from "../models/WorkRecord";
import type { AuthRequest } from "../middleware/auth";

// 创建项目数据
const createProject = async (req: AuthRequest, res: Response) =>{
  try{
    const projectData = {
      ...req.body,
      userId: req.user.id
    };
    const project = await Project.create(projectData);
    res.json({
      code: 200,
      msg: "创建项目数据成功",
      data: project,
    });
  }catch(err){ 
    res.json({
      code: 500,
      msg: "创建项目数据失败",
      data: null,
    });
  }
}

// 获取项目数据列表
const getProjectList = async (req: AuthRequest, res: Response) =>{ 
  try{
    const projects = await Project.find({ userId: req.user.id });
    res.json({
      code: 200,
      msg: "获取项目数据列表成功",
      data: projects,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: "获取项目数据列表失败",
      data: null,
    });
  }
}

// 获取单个项目数据详情
const getProjectDetail = async (req:AuthRequest , res:Response) =>{
  try{
    const project = await Project.findOne({_id:req.params.id, userId: req.user.id});
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目数据不存在或无权访问',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: "获取项目数据详情成功",
      data: project,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: "获取项目数据详情失败",
      data: null,
    });
  }
}

// 更新项目数据
const updateProject = async (req:AuthRequest , res:Response) =>{
  try{
    // 验证数据归属
    const project = await Project.findOne({_id:req.params.id, userId: req.user.id});
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目数据不存在或无权访问',
        data: null
      });
    }
    
    const result = await Project.updateOne({_id:req.params.id, userId: req.user.id},{$set:req.body});

    const updatedProject = await Project.findOne({_id:req.params.id, userId: req.user.id});

    if(result.modifiedCount === 0){
      return res.json({
        code: 500,
        msg: "更新项目数据失败",
        data: null,
      });
    }

    res.json({
      code: 200,
      msg: "更新项目数据成功",
      data: updatedProject,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: "更新项目数据失败",
      data: null,
    });
  }
}

// 删除项目数据
const deleteProject = async (req:AuthRequest , res:Response) =>{
  try{
    // 验证数据归属
    const project = await Project.findOne({_id:req.params.id, userId: req.user.id});
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目数据不存在或无权访问',
        data: null
      });
    }
    
    await Project.deleteOne({_id:req.params.id, userId: req.user.id});
    res.json({
      code: 200,
      msg: "删除项目数据成功",
      data: null,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: "删除项目数据失败",
      data: null,
    });
  }
}

// 项目模糊搜索接口：根据关键词 匹配 项目名称/负责人/项目地址 等字段
const searchProject = async (req: AuthRequest, res: Response) => { 
  try { 
    // 1. 获取前端传过来的搜索关键词（?q=关键词）
    const keyword = (req.query.q as string) || '';

    // 2. 执行 MongoDB 模糊查询（匹配多个字段），同时过滤当前用户的数据
    const projects = await Project.find({
      userId: req.user.id,
      $or: [
        // 项目名称 模糊匹配，不区分大小写
        { projectName: { $regex: keyword, $options: 'i' } },
        // 负责人 模糊匹配
        { projectManager: { $regex: keyword, $options: 'i' } },
        // 项目地址 模糊匹配
        { projectAddress: { $regex: keyword, $options: 'i' } },
        { status: { $regex: keyword, $options: 'i' } },
        // 你可以继续加需要搜索的字段
        // { phone: { $regex: keyword, $options: 'i' } },
      ]
    } as any); // 关闭TS类型检查，防止报错

    // 3. 返回成功结果给前端
    res.json({
      code: 200,
      msg: "项目搜索成功",
      data: projects
    });

  } catch (err) {
    // 4. 错误处理
    console.error("搜索项目出错：", err);
    res.json({
      code: 500,
      msg: "项目搜索失败",
      data: null
    });
  }
};

// 计算某个项目的利润
const getProjectProfit = async (req: AuthRequest, res: Response) => { 
  try { 
    // 1. 获取项目 ID
    const projectId = req.params.id;

    // 2. 查询项目信息（验证归属）
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目数据不存在或无权访问',
        data: null
      });
    }

    // 3. 查询项目下的所有做工记录（只查询当前用户的数据）
    const workRecords = await WorkRecord.find({ projectId: projectId, userId: req.user.id });

    // 4. 计算人工成本
    let totalPersonCost = 0;

    workRecords.forEach((record) => { 
      totalPersonCost += record.dailyWage * record.workDay;
      totalPersonCost += record.workExpense || 0;
    });

    // 5.计算材料成本
    let totalMaterialCost = 0;
    project.consumables.forEach((material) => { 
      totalMaterialCost += material.num * material.cost;
    });

    // 6. 计算利润
    const profit = project.squareMeterPrice * project.squareMeters - totalPersonCost - totalMaterialCost;

    // 总成本
    const totalCost = totalPersonCost + totalMaterialCost;
    res.json({
      code: 200,
      msg: "获取项目利润成功",
      data: {
        profit,
        totalCost,
      }
    });
  }catch (err) { 
    res.json({
      code: 500,
      msg: "获取项目利润失败",
      data: null
    });
  }
};

// 获取项目详细的人工成本
// 获取项目详细的人工成本
const getProjectPersonCost = async (req: AuthRequest, res: Response) => { 
  try { 
    // 1. 获取项目 ID
    const projectId = req.params.id;

    // 2. 验证项目归属
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目数据不存在或无权访问',
        data: null
      });
    }

    // 3. 获取项目下的所有做工记录（只查询当前用户的数据）
    const workRecords = await WorkRecord.find({ projectId: projectId, userId: req.user.id });

    // 4. 按【工人姓名 + 工种 + 日薪】分组统计
    const personMap = new Map();

    workRecords.forEach((record) => {
      const { workerName, dailyWage, workDay, workExpense = 0 } = record;
      const key = `${workerName}_${dailyWage}`; // 分组唯一标识

      if (personMap.has(key)) {
        // 已存在 → 累加
        const item = personMap.get(key);
        item.totalWorkDay += workDay;
        item.totalWage += dailyWage * workDay;
        item.totalExpense += workExpense;
        item.totalSalary = item.totalWage + item.totalExpense;
      } else {
        // 不存在 → 新建
        personMap.set(key, {
          workerName,
          dailyWage,
          totalWorkDay: workDay,
          totalWage: dailyWage * workDay,
          totalExpense: workExpense,
          totalSalary: dailyWage * workDay + workExpense,
        });
      }
    });

    // 转成数组
    const personList = Array.from(personMap.values());

    // 5. 计算项目总人工成本
    const totalPersonCost = personList.reduce((sum, item) => sum + item.totalSalary, 0);

    // 6. 返回结果
    res.json({
      code: 200,
      msg: "获取项目人工成本成功",
      data: {
        personList,        // 分组后的详细工人列表
        totalPersonCost,   // 项目总人工成本
      },
    });
    
  } catch (err) { 
    res.json({
      code: 500,
      msg: "获取项目人工成本失败",
      data: null,
    });
  }
};

export { getProjectPersonCost ,getProjectProfit,createProject, getProjectList, getProjectDetail, updateProject, deleteProject,searchProject };