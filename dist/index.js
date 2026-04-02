"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. 导入 express 框架（用来创建服务器、写接口）
const express_1 = __importDefault(require("express"));
// 2. 导入 cors 解决跨域（允许前端访问后端接口）
const cors_1 = __importDefault(require("cors"));
// 3. 导入数据库连接函数（连接 MongoDB）
const db_1 = __importDefault(require("./config/db"));
// 4. 导入路由（登录、注册接口）
const auth_1 = __importDefault(require("./routes/auth"));
// 4.1 导入用户路由（用户数据接口）
const user_1 = __importDefault(require("./routes/user"));
// 4.2 导入工人路由（工人数据接口）
const worker_1 = __importDefault(require("./routes/worker"));
// 4.3 导入项目路由（项目数据接口）
const project_1 = __importDefault(require("./routes/project"));
//4.4 导入做工记录路由 （做工数据接口）
const workrecord_1 = __importDefault(require("./routes/workrecord"));
// 5. 创建 express 应用实例（整个后端服务的核心）
const app = (0, express_1.default)();
// 6. 连接数据库（项目启动就自动连 MongoDB）
(0, db_1.default)();
// ———————————— 中间件配置 ————————————
// 7. 允许跨域访问（前端 localhost:3000 能访问后端）
app.use((0, cors_1.default)());
// 8. 允许后端接收 JSON 格式数据（前端传过来的用户名密码能正常解析）
app.use(express_1.default.json());
// ———————————— 路由配置 ————————————
// 9. 所有 /api/auth 开头的接口，都交给 authRoutes 处理
// 例：
// 注册接口 → /api/auth/register
// 登录接口 → /api/auth/login
app.use('/api/auth', auth_1.default);
// 用户数据接口 → /api/user/userlist
app.use('/api/user', user_1.default);
// 工人数据接口 → /api/worker/workerList
app.use('/api/worker', worker_1.default);
// 项目数据接口 → /api/project/projectList
app.use('/api/project', project_1.default);
//做工记录接口 → /api/workrecord/workrecordList
app.use('/api/workrecord', workrecord_1.default);
// ———————————— 启动服务 ————————————
// 10. 端口号：从 .env 取，取不到默认用 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
