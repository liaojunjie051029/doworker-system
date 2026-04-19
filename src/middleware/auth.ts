// 1. 导入 JWT 库：用来生成 / 验证 token
import jwt from 'jsonwebtoken';
// 2. 导入 Express 的类型（给 TypeScript 用的）
import type{ Request, Response, NextFunction } from 'express';
// 3. 导入 dotenv 读取环境变量（JWT_SECRET 密钥）
import dotenv from 'dotenv';
dotenv.config();

// 4. TypeScript 扩展 Express 请求类型
// 给 req 加一个 user 属性，用来存放验证后的用户信息
export interface AuthRequest extends Request {
  user?: any; // ? 表示可选，any 暂时允许任意类型
}

// 5. 【认证中间件】—— 所有需要登录才能访问的接口都会先走这里
const authMiddleware = (
  req: AuthRequest, // 扩展后的请求对象（带 user 属性）
  res: Response,    // 响应对象
  next:NextFunction // 放行函数：调用就代表通过验证，进入接口
) =>{
   // 6. 从请求头里获取 token
  // 前端传过来格式：Bearer xxxxxxx.token.xxxxxx 
  const token = req.headers.authorization?.split(' ')[1];

  // 7. 如果没有 token → 直接返回 401 无权限
  if(!token) return res.status(401).json({
    msg:'无token,拒绝访问'
  });

  try{
    // 8. 验证 token 是否正确、是否过期
    // process.env.JWT_SECRET! 是你的密钥（必须和登录生成token时一致）
    const decoded = jwt.verify(token,process.env.JWT_SECRET!);

    // 9. 验证通过 → 把用户信息挂载到 req.user
    // 后面的接口可以直接用 req.user 获取当前登录用户
    req.user = decoded;
    // 10. 放行！继续访问后面的接口
    next();
  }catch(err){
    // 11. token 无效 / 过期 / 被篡改 → 拦截
    return res.status(401).json({msg:'token无效或过期'});
  }
};

// 12. 导出中间件，给路由使用
export default authMiddleware;