"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectDetail = exports.getProjectList = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
// 创建项目数据
const createProject = async (req, res) => {
    try {
        const project = await Project_1.default.create(req.body);
        res.json({
            msg: '创建项目数据成功',
            data: project,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '创建项目数据失败',
        });
    }
};
exports.createProject = createProject;
// 获取项目数据列表
const getProjectList = async (req, res) => {
    try {
        const projects = await Project_1.default.find();
        res.json({
            msg: '获取项目数据列表成功',
            data: projects,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取项目数据列表失败',
        });
    }
};
exports.getProjectList = getProjectList;
// 获取单个项目数据详情
const getProjectDetail = async (req, res) => {
    try {
        const project = await Project_1.default.findOne({ _id: req.params.id });
        res.json({
            msg: '获取项目数据详情成功',
            data: project,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '获取项目数据详情失败',
        });
    }
};
exports.getProjectDetail = getProjectDetail;
// 更新项目数据
const updateProject = async (req, res) => {
    try {
        const result = await Project_1.default.updateOne({ _id: req.params.id }, { $set: req.body });
        const project = await Project_1.default.findOne({ _id: req.params.id });
        if (result.modifiedCount === 0) {
            return res.status(500).json({
                msg: '更新项目数据失败',
            });
        }
        res.json({
            msg: '更新项目数据成功',
            data: project,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '更新项目数据失败',
        });
    }
};
exports.updateProject = updateProject;
// 删除项目数据
const deleteProject = async (req, res) => {
    try {
        await Project_1.default.deleteOne({ _id: req.params.id });
        res.json({
            msg: '删除项目数据成功',
        });
    }
    catch (err) {
        res.status(500).json({
            msg: '删除项目数据失败',
        });
    }
};
exports.deleteProject = deleteProject;
