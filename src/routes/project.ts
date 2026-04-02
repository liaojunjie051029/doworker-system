import express from 'express';
import authMiddleware from '../middleware/auth'; // 导入自定义的中间件
//导入控制层
import {createProject, deleteProject, getProjectList, getProjectDetail, updateProject} from '../controllers/projectController';
// 3. ✅ 给 router 加类型注释：Express.Router
const router : express.Router = express.Router();//实例化一个路由对象

//导入中间件
router.use(authMiddleware);

//导入控制层
router.post('/addProject', createProject);
router.get('/getProjectList', getProjectList);
router.get('/getProjectDetail/:id', getProjectDetail);
router.patch('/updateProject/:id', updateProject);
router.post('/deleteProject/:id', deleteProject);

export default router;