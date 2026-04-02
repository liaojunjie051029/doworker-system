"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// 项目表结构（和 User、Worker 风格完全一致）
const projectSchema = new mongoose_1.default.Schema({
    projectName: {
        type: String,
        required: true, // 项目名称（必填）
    },
    projectAddress: String, // 项目地址（可选）
    projectManager: String, // 项目经理（可选）
    managerPhone: String, // 项目经理电话（可选）
    startDate: {
        type: Date,
        required: true, // 项目开始时间（必填）
    },
    endDate: Date, // 项目结束时间（可选）
    status: {
        type: String,
        default: "进行中", // 默认状态
        enum: ["未开始", "进行中", "已完成", "已取消"], // 限定状态值
    },
    // 耗材列表（子文档数组）
    consumables: [
        new mongoose_1.default.Schema({
            name: String, // 耗材名称
            num: Number, // 耗材数量
            unit: String, // 耗材单位
            cost: Number, // 耗材花费单价
        })
    ],
    squareMeters: {
        type: Number,
        required: true, // 项目总平方数（必填）
    },
    squareMeterPrice: {
        type: Number,
        required: true, // 每平方报价（必填）
    },
}, { timestamps: true } // 自动生成 createdAt、updatedAt
);
exports.default = mongoose_1.default.model("Project", projectSchema);
