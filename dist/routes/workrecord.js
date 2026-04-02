"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
//导入控制层
const workrecordController_1 = require("../controllers/workrecordController");
const router = express_1.default.Router();
router.use(auth_1.default);
//导入控制层
router.post('/addWorkRecord', workrecordController_1.addworkrecord);
router.get('/workRecordList', workrecordController_1.getworkrecordList);
router.get('/workRecordDetail/:id', workrecordController_1.getworkrecordDetail);
router.patch('/updateWorkRecord/:id', workrecordController_1.updateWorkRecord);
router.post('/deleteWorkRecord/:id', workrecordController_1.deleteWorkRecord);
exports.default = router;
