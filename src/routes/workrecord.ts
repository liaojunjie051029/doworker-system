import express from "express";
import authMiddleware from "../middleware/auth";
//导入控制层
import {addworkrecord, getworkrecordList, getworkrecordDetail, deleteWorkRecord, updateWorkRecord, getworkrecordDetailByWorkerId, getworkrecordDetailByProjectId,searchworkerrecord} from "../controllers/workrecordController"

const router : express.Router = express.Router();
router.use(authMiddleware);

//导入控制层
router.post('/addWorkRecord',addworkrecord);
router.get('/workRecordList',getworkrecordList);
router.get('/workRecordDetail/:id',getworkrecordDetail);
router.patch('/updateWorkRecord/:id',updateWorkRecord);
router.post('/deleteWorkRecord/:id',deleteWorkRecord);
//通过工人id获取做工记录
router.get('/getWorkRecordByWorkerId/:id',getworkrecordDetailByWorkerId);
//通过项目id获取做工记录
router.get('/getWorkRecordByProjectId/:id',getworkrecordDetailByProjectId);
// 模糊搜索
router.get('/searchworkerrecord',searchworkerrecord);

export default router;
