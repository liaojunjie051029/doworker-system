"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkRecord = exports.updateWorkRecord = exports.getworkrecordDetail = exports.getworkrecordList = exports.addworkrecord = void 0;
const WorkRecord_1 = __importDefault(require("../models/WorkRecord"));
//添加工人做工数据
const addworkrecord = async (req, res) => {
    try {
        const workrecord = await WorkRecord_1.default.create(req.body);
        res.json({
            msg: '新增做工数据成功',
            data: workrecord,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '新增做工数据失败',
            err
        });
    }
};
exports.addworkrecord = addworkrecord;
//获取工人做工数据列表
const getworkrecordList = async (req, res) => {
    try {
        const workrecord = await WorkRecord_1.default.find();
        res.json({
            msg: '获取做工数据列表成功',
            data: workrecord,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取做工数据列表失败',
            err
        });
    }
};
exports.getworkrecordList = getworkrecordList;
//获取做工数据详情
const getworkrecordDetail = async (req, res) => {
    try {
        const workrecord = await WorkRecord_1.default.findOne({ _id: req.params.id });
        res.json({
            msg: '获取做工数据详情成功',
            data: workrecord
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取做工数据详情失败',
            err
        });
    }
};
exports.getworkrecordDetail = getworkrecordDetail;
//更新做工数据详情
const updateWorkRecord = async (req, res) => {
    try {
        const result = await WorkRecord_1.default.updateOne({ _id: req.params.id }, { $set: req.body });
        const workrecord = await WorkRecord_1.default.findOne({ _id: req.params.id });
        if (result.modifiedCount === 0) {
            return res.status(500).json({
                msg: '修改工人数据失败'
            });
        }
        res.json({
            msg: '更新做工数据成功',
            data: workrecord
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '更新做工数据失败',
            err
        });
    }
};
exports.updateWorkRecord = updateWorkRecord;
//删除做工数据
const deleteWorkRecord = async (req, res) => {
    try {
        await WorkRecord_1.default.deleteOne({ _id: req.params.id });
        res.json({
            msg: '删除做工数据成功'
        });
    }
    catch {
        res.status(500).json({
            msg: '删除做工数据失败'
        });
    }
};
exports.deleteWorkRecord = deleteWorkRecord;
