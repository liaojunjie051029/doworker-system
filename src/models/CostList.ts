import mongoose from "mongoose";

//这里存放最近六个月的人工成本 和材料成本
const CostSchema = new mongoose.Schema({
  personCost:{
    type:Number,
    required:true,
  },
  materialCost:{
    type:Number,
    required:true,
  },
  month:{
    type:String,
    required:true,
  }
}
,{timestamps:true}
)

export default mongoose.model("personCost",CostSchema)