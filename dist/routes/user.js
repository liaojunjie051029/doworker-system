"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // 导入 express
const auth_1 = __importDefault(require("../middleware/auth")); // 导入自定义的中间件
const userController_1 = require("../controllers/userController");
// 3. ✅ 给 router 加类型注释：Express.Router
const router = express_1.default.Router();
//导入中间件
router.use(auth_1.default);
//获取用户数据列表
router.get('/userlist', userController_1.getUserList);
//获取用户数据详情
router.get('/detail', userController_1.getUserDetail);
// 修改用户数据
router.patch('/update', userController_1.updateUser);
//退出登录
router.post('/logout', userController_1.logout);
//注销用户
router.delete('/delete', userController_1.deleteUser);
// 导出 router
exports.default = router;
