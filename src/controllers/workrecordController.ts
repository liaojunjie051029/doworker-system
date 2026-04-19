import WorkRecord from "../models/WorkRecord";
import Project from "../models/Project";
import Worker from "../models/Worker";
import type { Request,Response } from "express";
import type { AuthRequest } from "../middleware/auth";

// 添加工人做工数据
export const addworkrecord = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, workerId } = req.body;

    // 1. 先校验必填参数
    if (!projectId || !workerId) {
      return res.json({
        code: 400,
        msg: 'projectId 和 workerId 不能为空',
        data: null
      });
    }

    // 2. 查找项目和工人（验证归属）
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    const worker = await Worker.findOne({ _id: workerId, userId: req.user.id });

    if (!project) {
      return res.json({ code: 404, msg: '项目不存在或无权访问', data: null });
    }
    if (!worker) {
      return res.json({ code: 404, msg: '工人不存在或无权访问', data: null });
    }

    // 3. 创建做工记录（关键：合并字段的正确写法）
    const workrecord = await WorkRecord.create({
      ...req.body,
      projectName: project.projectName,
      workerName: worker.name,
      userId: req.user.id
    });

    res.json({
      code: 200,
      msg: '新增做工数据成功',
      data: workrecord,
    });
  } catch (err) {
    // 🔥 必须打印错误，才能定位问题！
    console.error('新增做工数据失败:', err);
    res.json({
      code: 500,
      msg: '新增做工数据失败',
      data: null
    });
  }
};

//获取工人做工数据列表
export const getworkrecordList = async (req:AuthRequest,res:Response) =>{
  try{
    const workrecord = await WorkRecord.find({ userId: req.user.id });
    res.json({
      code: 200,
      msg:'获取做工数据列表成功',
      data:workrecord,
    });
  }catch(err){
    res.json({
      code: 500,
      msg:'获取做工数据列表失败',
      data: null
    })
  }
}

//获取做工数据详情
export const getworkrecordDetail = async (req:AuthRequest,res:Response) => {
  try{
    const workrecord = await WorkRecord.findOne({_id:req.params.id, userId: req.user.id})
    if (!workrecord) {
      return res.json({
        code: 404,
        msg: '做工数据不存在或无权访问',
        data: null
      });
    }
    res.json({
      code: 200,
      msg:'获取做工数据详情成功',
      data:workrecord
    })
  }catch(err){
    res.json({
      code: 500,
      msg:'获取做工数据详情失败',
      data: null
    })
  }
}

// 更新做工数据详情
export const updateWorkRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, workerId } = req.body;

    // 1. 校验必填参数
    if (!projectId || !workerId) {
      return res.json({
        code: 400,
        msg: 'projectId 和 workerId 不能为空',
        data: null
      });
    }

    // 2. 验证工作记录归属
    const existingRecord = await WorkRecord.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existingRecord) {
      return res.json({
        code: 404,
        msg: '做工记录不存在或无权访问',
        data: null
      });
    }

    // 3. 查找项目和工人（验证归属）
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    const worker = await Worker.findOne({ _id: workerId, userId: req.user.id });

    if (!project) {
      return res.json({ code: 404, msg: '项目不存在或无权访问', data: null });
    }
    if (!worker) {
      return res.json({ code: 404, msg: '工人不存在或无权访问', data: null });
    }

    // 4. 构造要更新的数据（自动同步名称）
    const updateData = {
      ...req.body,
      projectName: project.projectName,
      workerName: worker.name
    };

    // 5. 执行更新
    const result = await WorkRecord.updateOne(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateData }
    );

    // 6. 查询更新后的完整数据
    const workrecord = await WorkRecord.findOne({ _id: req.params.id, userId: req.user.id });

    if (result.modifiedCount === 0) {
      return res.json({
        code: 500,
        msg: '修改做工记录失败，数据未变化',
        data: null
      });
    }

    // 7. 返回成功
    res.json({
      code: 200,
      msg: '修改做工记录成功',
      data: workrecord
    });

  } catch (err) {
    console.error('更新做工数据失败:', err);
    res.json({
      code: 500,
      msg: '更新做工数据失败',
      data: null
    });
  }
};

//删除做工数据
export const deleteWorkRecord = async (req:AuthRequest ,res:Response)=>{
  try{
    // 验证数据归属
    const workrecord = await WorkRecord.findOne({_id:req.params.id, userId: req.user.id});
    if (!workrecord) {
      return res.json({
        code: 404,
        msg: '做工数据不存在或无权访问',
        data: null
      });
    }
    
    await WorkRecord.deleteOne({_id:req.params.id, userId: req.user.id})
   res.json({
      code: 200,
      msg:'删除做工数据成功',
      data: null
    })
  }catch{
    res.json({
      code: 500,
      msg:'删除做工数据失败',
      data: null
    })
  }
}

//通过工人id获取做工记录
export const getworkrecordDetailByWorkerId = async (req:AuthRequest,res:Response) =>{
  try{
    // 验证工人归属
    const worker = await Worker.findOne({ _id: req.params.id, userId: req.user.id });
    if (!worker) {
      return res.json({
        code: 404,
        msg: '工人不存在或无权访问',
        data: null
      });
    }
    
    const workrecord = await WorkRecord.find({workerId:req.params.id, userId: req.user.id})
    res.json({
      code: 200,
      msg:'获取做工数据列表成功',
      data:workrecord,
    });
  }catch(err){ 
    res.json({
      code: 500,
      msg:'获取做工数据列表失败',
      data: null
    })
  }
}

//通过项目id获取做工记录
export const getworkrecordDetailByProjectId = async (req:AuthRequest,res:Response) =>{
  try{
    // 验证项目归属
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) {
      return res.json({
        code: 404,
        msg: '项目不存在或无权访问',
        data: null
      });
    }
    
    const workrecord = await WorkRecord.find({projectId:req.params.id, userId: req.user.id})
    res.json({
      code: 200,
      msg:'获取做工数据列表成功',
      data:workrecord,
    });
  }catch(err){ 
    res.json({
      code: 500,
      msg:'获取做工数据列表失败',
      data: null
    })
  }
}

// 模糊匹配
export const searchworkerrecord = async (req:AuthRequest,res:Response) =>{
  try{
// 1. 获取前端传过来的搜索关键词（?q=关键词）
    const keyword = (req.query.q as string) || '';

    // 2. 执行 MongoDB 模糊查询（匹配多个字段），同时过滤当前用户的数据
    const workrecord = await WorkRecord.find({
      userId: req.user.id,
      $or:[
        //项目名称 模糊匹配，不区分大小写
        {projectName:{$regex:keyword,$options:'i'}},
        //工人姓名 模糊匹配
        {workerName:{$regex:keyword,$options:'i'}},
        //状态 模糊匹配
        {settleStatus:{$regex:keyword,$options:'i'}},
      ]
    } as any);

    res.json({
      code: 200,
      msg: '搜索成功',
      data: workrecord,
    });
  }catch(err){
    // 4. 查询失败，返回错误信息
    console.error('搜索错误：', err);
    res.json({
      code: 500,
      msg: '搜索工人数据失败',
      data: null,
    });
  }
}