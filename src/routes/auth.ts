// 1. 导入 express
import express from 'express';
// 2. 导入控制器
import { register, login } from '../controllers/authController';
// 3. ✅ 给 router 加类型注释：Express.Router
const router : express.Router = express.Router();
// 4. 注册路由
router.post('/register', register);
router.post('/login', login);
// 5. 导出
export default router;