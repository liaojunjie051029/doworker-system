"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.logout = exports.updateUser = exports.getUserDetail = exports.getUserList = void 0;
const User_1 = __importDefault(require("../models/User"));
//获取用户数据列表
const getUserList = async (req, res) => {
    try {
        const user = await User_1.default.find();
        res.json({
            msg: '获取用户数据列表成功',
            data: user,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取用户数据列表失败',
        });
    }
};
exports.getUserList = getUserList;
// 获取单个用户数据详情
const getUserDetail = async (req, res) => {
    try {
        const userInfo = await User_1.default.findOne({ _id: req.user.id });
        res.json({
            msg: '获取用户数据详情成功',
            data: userInfo,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取用户数据详情失败',
        });
    }
};
exports.getUserDetail = getUserDetail;
// 修改用户数据
const updateUser = async (req, res) => {
    try {
        const result = await User_1.default.updateOne({ _id: req.user.id }, { $set: req.body });
        const userInfo = await User_1.default.findOne({ _id: req.user.id });
        if (result.modifiedCount === 0) {
            return res.status(500).json({
                msg: '修改用户数据失败',
            });
        }
        res.json({
            msg: '修改用户数据成功',
            data: userInfo,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '修改用户数据失败',
        });
    }
};
exports.updateUser = updateUser;
//退出登录
const logout = async (req, res) => {
    try {
        await User_1.default.updateOne({ _id: req.user.id }, {
            status: 'offline',
        });
        res.json({
            msg: '退出登录成功',
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '退出登录失败',
        });
    }
};
exports.logout = logout;
//注销用户
const deleteUser = async (req, res) => {
    try {
        await User_1.default.deleteOne({ _id: req.user.id });
        res.json({
            msg: '注销用户成功',
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '注销用户失败',
        });
    }
};
exports.deleteUser = deleteUser;
