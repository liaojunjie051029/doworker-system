import mongoose from "mongoose";
//这里统计的是年度的
const TotalCountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  personCost: {
    type:Number,
    required:true,// 人工成本
  },
  materialCost:{
    type:Number,
    required:true,// 材料成本
  },
  projectProfit:{
    type:Number,
    required:true,// 项目利润
  },
  profitRate:{
    type:Number,
    required:true,// 利润率
  },
},
{ timestamps: true }
);
export default mongoose.model("TotalCount", TotalCountSchema);