import type { Request, Response } from "express";
import Worker from "../models/Worker";

// 获取工人数据列表
export const getWorkerList = async (req: Request, res: Response) => { 
  try{
    const workers = await Worker.find();
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
 export const getWorkerDetail = async (req: Request, res: Response) =>{
  try{
    const worker = await Worker.findOne({_id:req.params.id});
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
export const addWorker = async (req: Request, res: Response)=>{
  try{
    const worker = await Worker.create(req.body);
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
export const updateWorker = async (req: Request, res: Response)=>{
  try{
    const result = await Worker.updateOne({_id:req.params.id}, {$set: req.body});

    const worker = await Worker.findOne({_id:req.params.id});

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
      data: worker,
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
export const deleteWorker = async (req: Request, res: Response)=>{
  try{
    await Worker.deleteOne({_id:req.params.id});
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