import WorkRecord from "../models/WorkRecord";
import type { Request,Response } from "express";

//添加工人做工数据
export const addworkrecord = async (req:Request,res:Response) => {
  try{
    const workrecord = await WorkRecord.create(req.body);
    res.json({
      msg:'新增做工数据成功',
      data:workrecord,
    })
  }catch(err){
    res.status(500).json({
      msg:'新增做工数据失败',
      err
    })
  }
} 
//获取工人做工数据列表
export const getworkrecordList = async (req:Request,res:Response) =>{
  try{
    const workrecord = await WorkRecord.find();
    res.json({
      msg:'获取做工数据列表成功',
      data:workrecord,
    });
  }catch(err){
    res.status(500).json({
      msg:'获取做工数据列表失败',
      err
    })
  }
}

//获取做工数据详情
export const getworkrecordDetail = async (req:Request,res:Response) => {
  try{
    const workrecord = await WorkRecord.findOne({_id:req.params.id})
    res.json({
      msg:'获取做工数据详情成功',
      data:workrecord
    })
  }catch(err){
    res.status(500).json({
      msg:'获取做工数据详情失败',
      err
    })
  }
}

//更新做工数据详情
export const updateWorkRecord = async (req:Request,res:Response) =>{
  try{
    const result = await WorkRecord.updateOne({_id:req.params.id},{$set:req.body});

    const workrecord = await WorkRecord.findOne({_id:req.params.id})

    if(result.modifiedCount === 0){
      return res.status(500).json({
        msg:'修改工人数据失败'
      })
    }

    res.json({
      msg:'更新做工数据成功',
      data:workrecord
    })
  }catch(err){
    res.status(500).json({
      msg:'更新做工数据失败',
      err
    })
  }
}

//删除做工数据
export const deleteWorkRecord = async (req:Request ,res:Response)=>{
  try{
    await WorkRecord.deleteOne({_id:req.params.id})
    res.json({
      msg:'删除做工数据成功'
    })
  }catch{
    res.status(500).json({
      msg:'删除做工数据失败'
    })
  }
}
