import Project from "../models/Project";
import type { Request, Response } from "express"

// 创建项目数据
const createProject = async (req: Request, res: Response) =>{
  try{
    const project = await Project.create(req.body);
    res.json({
      msg: '创建项目数据成功',
      data: project,
    });
  }catch(err){ 
    res.status(500).json({
      msg: '创建项目数据失败',
    });
  }
}

// 获取项目数据列表
const getProjectList = async (req: Request, res: Response) =>{ 
  try{
    const projects = await Project.find();
    res.json({
      msg: '获取项目数据列表成功',
      data: projects,
    });
  }catch(err){
    res.status(500).json({
      msg: '获取项目数据列表失败',
    });
  }
}

// 获取单个项目数据详情
const getProjectDetail = async (req:Request , res:Response) =>{
  try{
    const project = await Project.findOne({_id:req.params.id});
    res.json({
      msg: '获取项目数据详情成功',
      data: project,
    });
  }catch(err){
    res.status(500).json({
      msg: '获取项目数据详情失败',
    });
  }
}

// 更新项目数据
const updateProject = async (req:Request , res:Response) =>{
  try{
    const result = await Project.updateOne({_id:req.params.id},{$set:req.body});

    const project = await Project.findOne({_id:req.params.id});

    if(result.modifiedCount === 0){
      return res.status(500).json({
        msg: '更新项目数据失败',
      });
    }

    res.json({
      msg: '更新项目数据成功',
      data: project,
    });
  }catch(err){
    res.status(500).json({
      msg: '更新项目数据失败',
    });
  }
}

// 删除项目数据
const deleteProject = async (req:Request , res:Response) =>{
  try{
    await Project.deleteOne({_id:req.params.id});
    res.json({
      msg: '删除项目数据成功',
    });
  }catch(err){
    res.status(500).json({
      msg: '删除项目数据失败',
    });
  }
}

export { createProject, getProjectList, getProjectDetail, updateProject, deleteProject };