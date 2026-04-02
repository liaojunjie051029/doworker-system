"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // 1. 导入 mongoose 库（用于操作 MongoDB 数据库）
// 2. 定义【用户集合的结构】Schema
// Schema = 告诉数据库：用户表里有哪些字段、什么类型、是否必填
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String, //数据类型为字符串
        required: true, //必填项，不能空
    },
    password: {
        type: String, // 数据类型：字符串
        required: true,
    },
    nickname: String, // 类型：字符串，不写 required 就是【可选】
    avatar: String, // 头像链接
    status: {
        type: String, // 数据类型：字符串
        enum: ['online', 'offline'], // 枚举值：只能是这两个值中的一个
        default: 'offline', // 默认值：offline
    }
}, 
// 3. 配置项
{ timestamps: true }
// 自动添加两个字段：
// createdAt：创建时间
// updatedAt：更新时间
// 数据库会自动维护，不用我们手动写
);
// 4. 创建模型并导出
// mongoose.model(模型名, Schema)
// 第一个参数 'User' → 对应数据库里的集合名（自动变成复数 users）
exports.default = mongoose_1.default.model('User', userSchema);
