"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. 导入 JWT 库：用来生成 / 验证 token
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 3. 导入 dotenv 读取环境变量（JWT_SECRET 密钥）
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 5. 【认证中间件】—— 所有需要登录才能访问的接口都会先走这里
const authMiddleware = (req, // 扩展后的请求对象（带 user 属性）
res, // 响应对象
next // 放行函数：调用就代表通过验证，进入接口
) => {
    // 6. 从请求头里获取 token
    // 前端传过来格式：Bearer xxxxxxx.token.xxxxxx 
    const token = req.headers.authorization?.split(' ')[1];
    // 7. 如果没有 token → 直接返回 401 无权限
    if (!token)
        return res.status(401).json({
            msg: '无token,拒绝访问'
        });
    try {
        // 8. 验证 token 是否正确、是否过期
        // process.env.JWT_SECRET! 是你的密钥（必须和登录生成token时一致）
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 9. 验证通过 → 把用户信息挂载到 req.user
        // 后面的接口可以直接用 req.user 获取当前登录用户
        req.user = decoded;
        // 10. 放行！继续访问后面的接口
        next();
    }
    catch (err) {
        // 11. token 无效 / 过期 / 被篡改 → 拦截
        return res.status(401).json({ msg: 'token无效或过期' });
    }
};
// 12. 导出中间件，给路由使用
exports.default = authMiddleware;
