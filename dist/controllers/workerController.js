"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.addWorker = exports.getWorkerDetail = exports.getWorkerList = void 0;
const Worker_1 = __importDefault(require("../models/Worker"));
// 获取工人数据列表
const getWorkerList = async (req, res) => {
    try {
        const workers = await Worker_1.default.find();
        res.json({
            msg: '获取工人数据列表成功',
            data: workers,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取工人数据列表失败',
        });
    }
};
exports.getWorkerList = getWorkerList;
//获取工人数据详情
const getWorkerDetail = async (req, res) => {
    try {
        const worker = await Worker_1.default.findOne({ _id: req.params.id });
        res.json({
            msg: '获取工人数据详情成功',
            data: worker,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取工人数据详情失败',
        });
    }
};
exports.getWorkerDetail = getWorkerDetail;
//新增工人数据
const addWorker = async (req, res) => {
    try {
        const worker = await Worker_1.default.create(req.body);
        res.json({
            msg: '新增工人数据成功',
            data: worker,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '新增工人数据失败',
        });
    }
};
exports.addWorker = addWorker;
//更新工人数据
const updateWorker = async (req, res) => {
    try {
        const result = await Worker_1.default.updateOne({ _id: req.params.id }, { $set: req.body });
        const worker = await Worker_1.default.findOne({ _id: req.params.id });
        if (result.modifiedCount === 0) {
            return res.status(500).json({
                msg: '修改工人数据失败',
            });
        }
        res.json({
            msg: '更新工人数据成功',
            data: worker,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '更新工人数据失败',
        });
    }
};
exports.updateWorker = updateWorker;
//删除工人数据
const deleteWorker = async (req, res) => {
    try {
        await Worker_1.default.deleteOne({ _id: req.params.id });
        res.json({
            msg: '删除工人数据成功',
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '删除工人数据失败',
        });
    }
};
exports.deleteWorker = deleteWorker;
