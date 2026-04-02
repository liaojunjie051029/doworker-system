import express from 'express'
import authMiddleware from '../middleware/auth'; // 导入自定义的中间件
//导入控制层
import { getWorkerList, addWorker, getWorkerDetail, deleteWorker, updateWorker } from '../controllers/workerController';
// 3. ✅ 给 router 加类型注释：Express.Router
const router : express.Router = express.Router();
//导入中间件
router.use(authMiddleware);

//导入控制层
//获取工人数据列表
router.get('/workerList', getWorkerList);
//新增工人数据
router.post('/addWorker', addWorker);
//获取工人数据详情
router.get('/workerDetail/:id', getWorkerDetail);
//更新工人数据
router.patch('/updateWorker/:id', updateWorker);
//删除工人数据
router.post('/deleteWorker/:id', deleteWorker);


//导出 router
export default router;