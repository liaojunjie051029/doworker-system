import type { Request, Response } from "express";
import Worker from "../models/Worker";
import type { AuthRequest } from "../middleware/auth";

// 获取工人数据列表
export const getWorkerList = async (req: AuthRequest, res: Response) => { 
  try{
    const workers = await Worker.find({ userId: req.user.id });
    res.json({
          code: 200,
          msg: '获取工人数据列表成功',
          data: workers,
        });
      }catch(err){
        res.json({
          code: 500,
          msg: '获取工人数据列表失败',
          data: null
        });
  }
};

 //获取工人数据详情
 export const getWorkerDetail = async (req: AuthRequest, res: Response) =>{
  try{
    const worker = await Worker.findOne({_id:req.params.id, userId: req.user.id});
    if (!worker) {
      return res.json({
        code: 404,
        msg: '工人数据不存在或无权访问',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: '获取工人数据详情成功',
      data: worker,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: '获取工人数据详情失败',
      data: null
    });
  }
 }

//新增工人数据
export const addWorker = async (req: AuthRequest, res: Response)=>{
  try{
    const workerData = {
      ...req.body,
      userId: req.user.id
    };
    const worker = await Worker.create(workerData);
    res.json({
      code: 200,
      msg: '新增工人数据成功',
      data: worker,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: '新增工人数据失败',
      data: null
    });
  }
}

//更新工人数据
export const updateWorker = async (req: AuthRequest, res: Response)=>{
  try{
    // 验证数据归属
    const worker = await Worker.findOne({_id:req.params.id, userId: req.user.id});
    if (!worker) {
      return res.json({
        code: 404,
        msg: '工人数据不存在或无权访问',
        data: null
      });
    }
    
    const result = await Worker.updateOne({_id:req.params.id, userId: req.user.id}, {$set: req.body});

    const updatedWorker = await Worker.findOne({_id:req.params.id, userId: req.user.id});

     if(result.modifiedCount === 0){
      return res.json({
        code: 500,
        msg: '修改工人数据失败',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: '更新工人数据成功',
      data: updatedWorker,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: '更新工人数据失败',
      data: null
    })
  }
}

//删除工人数据
export const deleteWorker = async (req: AuthRequest, res: Response)=>{
  try{
    // 验证数据归属
    const worker = await Worker.findOne({_id:req.params.id, userId: req.user.id});
    if (!worker) {
      return res.json({
        code: 404,
        msg: '工人数据不存在或无权访问',
        data: null
      });
    }
    
    await Worker.deleteOne({_id:req.params.id, userId: req.user.id});
    res.json({
      code: 200,
      msg: '删除工人数据成功',
      data: null
    })
  }catch(err){
    res.json({
      code: 500,
      msg: '删除工人数据失败',
      data: null
    })
  }
}

// 搜索工人 —— 【无任何TS报错版本】
// 搜索工人接口：根据搜索框输入的关键词，模糊匹配工人的姓名/电话/身份证/工号
export const searchworker = async (req: AuthRequest, res: Response) => {
  try {
    // 1. 获取前端传过来的搜索关键词 q
    // req.query.q 是前端通过 URL 传的参数，例如 ?q=张三
    // as string 是告诉 TypeScript：这个值一定是字符串，避免类型报错
    const keyword = (req.query.q as string) || '';

    // 2. 查询数据库：模糊匹配多个字段，同时过滤当前用户的数据
    const workers = await Worker.find({
      userId: req.user.id,
      // $or 表示：只要满足下面任意一个条件，就查出这条数据
      $or: [
        // 模糊匹配 姓名，i 代表不区分大小写
        { name: { $regex: keyword, $options: 'i' } },
        // 模糊匹配 电话
        { phone: { $regex: keyword, $options: 'i' } },
        // 模糊匹配 状态
        { status: { $regex: keyword, $options: 'i' } },
        // 模糊匹配 性别
        { gender: { $regex: keyword, $options: 'i' } },
      ]
    } as any); // as any 是临时关闭 TypeScript 的类型检查，解决版本不兼容报错

    // 3. 查询成功，把数据返回给前端
    res.json({
      code: 200,
      msg: '搜索成功',
      data: workers,
    });
  } catch (err) {
    // 4. 查询失败，返回错误信息
    console.error('搜索错误：', err);
    res.json({
      code: 500,
      msg: '搜索工人数据失败',
      data: null,
    });
  }
};