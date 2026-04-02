import express from "express";
import authMiddleware from "../middleware/auth";
//导入控制层
import {addworkrecord, getworkrecordList, getworkrecordDetail, deleteWorkRecord, updateWorkRecord} from "../controllers/workrecordController"

const router : express.Router = express.Router();
router.use(authMiddleware);

//导入控制层
router.post('/addWorkRecord',addworkrecord);
router.get('/workRecordList',getworkrecordList);
router.get('/workRecordDetail/:id',getworkrecordDetail);
router.patch('/updateWorkRecord/:id',updateWorkRecord);
router.post('/deleteWorkRecord/:id',deleteWorkRecord);

export default router;
