// 导入 Express 的请求、响应类型（TypeScript 专用）
import type { Request, Response  } from "express";
// 导入用户模型（操作数据库的用户表）
import User from "../models/User";
// 导入密码加密库
import bcrypt from "bcryptjs";
// 导入 token 生成库
import jwt from "jsonwebtoken";
// 导入环境变量库
import dotenv from "dotenv";
dotenv.config();

// ======================
// 1. 用户注册接口
// ======================
export const register = async (req: Request, res: Response) =>{
  try{
     // 从前端请求体里获取 用户名、密码
    const {username,password} = req.body;

    // 密码加密：把明文密码加密成乱码，10 是加密强度
    const hashedPwd = await bcrypt.hash(password,10);

    // 把用户信息存入数据库
    const user = await User.create({
      username,         // 用户名
      password:hashedPwd, // 加密后的密码（绝不存明文！）
    });

    // 返回给前端：注册成功 + 用户信息（不返回密码）
    res.json({
      code: 200,
      msg: '注册成功',
      data: {
        id: user._id,
        username: user.username
      }
    });
  }catch(err){
    // 出错：比如用户名重复
    res.status(200).json({
      code: 500,
      msg: '注册失败，用户名可能已存在',
      data: null
    });
  }
};

// ======================
// 2. 用户登录接口
// ======================
export const login = async (req: Request, res: Response) =>{
  try{
    // 从前端获取用户名、密码
    const {username,password} = req.body;

    // 1. 查数据库：有没有这个用户
    const user = await User.findOne({username});
    if(!user) {
      // 用户不存在
      return res.status(200).json({
        code: 400,
        msg: '用户不存在',
        data: null
      });
    }

     // 2. 验证密码：前端输入的密码 vs 数据库加密密码
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
      return res.status(200).json({
        code: 400,
        msg: '密码错误',
        data: null
      });
    }

    // 3. 登录成功 → 生成 token（给前端用来证明登录了）
    const token = jwt.sign(
      { id: user._id ,username: user.username },// 存在 token 里的用户信息
      process.env.JWT_SECRET!,     // 密钥（保密）
      { expiresIn: '1d' }          // 1天后过期
    );

    //修改用户状态为登录中
    await User.updateOne({username},{$set:{status:'online'}});

    const userInfo = {...user , password:''}
    // 4. 返回 token 给前端
    res.json({
      code: 200,
      msg: '登录成功',
      data: { token,userInfo }  // 把 token 放进 data 里
    });
  }catch(err){ 
    // 系统异常
    res.status(200).json({
      code: 500,
      msg: '登录失败，服务器异常',
      data: null
    });
  }
}