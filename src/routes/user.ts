import express from 'express'; // 导入 express
import authMiddleware from '../middleware/auth'; // 导入自定义的中间件
import { getUserList ,getUserDetail, updateUser, logout, deleteUser } from '../controllers/userController';
// 3. ✅ 给 router 加类型注释：Express.Router
const router : express.Router = express.Router();
//导入中间件
router.use(authMiddleware);
//获取用户数据列表
router.get('/userlist',getUserList)
//获取用户数据详情
router.get('/detail',getUserDetail) 
// 修改用户数据
router.patch('/update', updateUser)
//退出登录
router.post('/logout',logout)
//注销用户
router.delete('/delete',deleteUser)
// 导出 router
export default router;