"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth")); // 导入自定义的中间件
//导入控制层
const projectController_1 = require("../controllers/projectController");
// 3. ✅ 给 router 加类型注释：Express.Router
const router = express_1.default.Router(); //实例化一个路由对象
//导入中间件
router.use(auth_1.default);
//导入控制层
router.post('/addProject', projectController_1.createProject);
router.get('/getProjectList', projectController_1.getProjectList);
router.get('/getProjectDetail/:id', projectController_1.getProjectDetail);
router.patch('/updateProject/:id', projectController_1.updateProject);
router.post('/deleteProject/:id', projectController_1.deleteProject);
exports.default = router;
