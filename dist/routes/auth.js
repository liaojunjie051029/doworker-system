"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. 导入 express
const express_1 = __importDefault(require("express"));
// 2. 导入控制器
const authController_1 = require("../controllers/authController");
// 3. ✅ 给 router 加类型注释：Express.Router
const router = express_1.default.Router();
// 4. 注册路由
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
// 5. 导出
exports.default = router;
