import mongoose from "mongoose";

// 做工记录表结构
const WorkRecordSchema = new mongoose.Schema(
  {
    userId: {  // 新增字段
    type: String,
    required: true
  },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker", // 关联工人模型
      required: true, // 工人必填
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // 关联项目模型
      required: true, // 项目必填
    },
    workerName: { // 工人名称
      type: String,
      required: true, // 工人名称必填
    },
    projectName: { // 项目名称
      type: String,
      required: true, // 项目名称必填
    },
    workDate: {
      type: Date,
      required: true, // 工作日期（必填）
    },
    workDay: {
      type: Number,
      required: true, // 工作天数/小时数 1=全天 0.5=半天
    },
    dailyWage: {
      type: Number,
      required: true, // 日工资
    },
    workExpense: {
      type: Number,
      default: 0, // 其他费用，默认0
    },
    expenseDesc: String, // 费用描述（可选）
    settleStatus: {
      type: String,
      enum: ["未结算", "已结算"],
      default: "未结算", // 结算状态
    },
  },
  { timestamps: true } // 自动加创建/更新时间（和你其他模型保持一致）
);

export default mongoose.model("WorkRecord", WorkRecordSchema);