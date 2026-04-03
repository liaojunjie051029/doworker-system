import type { Request, Response } from "express";
import User from "../models/User"

// 扩展 Request 类型，让接口能识别 req.user
interface AuthRequest extends Request {
  user: {
    id: string; // 对应 JWT 里存的 _id
  };
}

//获取用户数据列表
export const getUserList = async (req: Request, res: Response) => { 
  try{
    const user = await User.find();
    res.json({
      code: 200,
      msg: '获取用户数据列表成功',
      data: user,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: '获取用户数据列表失败',
      data: null
    });
  }
}

// 获取单个用户数据详情
export const getUserDetail = async (req: AuthRequest, res: Response) => {
  try{
    const userInfo = await User.findOne({_id:req.user.id}); 
    res.json({
      code: 200,
      msg: '获取用户数据详情成功',
      data: userInfo,
    });
  }catch(err){
    res.json({
      code: 500,
      msg: '获取用户数据详情失败',
      data: null
    });
  }
}

// 修改用户数据
export const updateUser = async (req: AuthRequest, res: Response) => { 
  try{
    const result = await User.updateOne(
      {_id:req.user.id},
      { $set: req.body }
    )
    const userInfo = await User.findOne({_id:req.user.id}); 

    if(result.modifiedCount === 0){
      return res.json({
        code: 500,
        msg: '修改用户数据失败',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: '修改用户数据成功',
      data: userInfo,
    });
  } catch(err){
    res.json({
      code: 500,
      msg: '修改用户数据失败',
      data: null
    });
  }
}

//退出登录
export const logout = async (req: AuthRequest, res: Response) => { 
  try{
    await User.updateOne(
      {_id:req.user.id},
      {
        status:'offline',
      }  
    )
    res.json({
      code: 200,
      msg: '退出登录成功',
      data: null
    });
  } catch(err){
    res.json({
      code: 500,
      msg: '退出登录失败',
      data: null
    });
  }
}

//注销用户
export const deleteUser = async (req: AuthRequest, res: Response) => { 
  try{
    await User.deleteOne({_id:req.user.id}); 
    res.json({
      code: 200,
      msg: '注销用户成功',
      data: null
    });
  } catch(err){
    res.json({
      code: 500,
      msg: '注销用户失败',
      data: null
    });
  }
}