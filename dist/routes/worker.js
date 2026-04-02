"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth")); // 导入自定义的中间件
//导入控制层
const workerController_1 = require("../controllers/workerController");
// 3. ✅ 给 router 加类型注释：Express.Router
const router = express_1.default.Router();
//导入中间件
router.use(auth_1.default);
//导入控制层
//获取工人数据列表
router.get('/workerList', workerController_1.getWorkerList);
//新增工人数据
router.post('/addWorker', workerController_1.addWorker);
//获取工人数据详情
router.get('/workerDetail/:id', workerController_1.getWorkerDetail);
//更新工人数据
router.patch('/updateWorker/:id', workerController_1.updateWorker);
//删除工人数据
router.post('/deleteWorker/:id', workerController_1.deleteWorker);
//导出 router
exports.default = router;
