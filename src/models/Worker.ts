import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name:{// 工人姓名
    type:String,
    required:true
  },
  job:{// 工种
    type:String,
    required:true
  },
  phone:{// 手机号
    type:String,
    required:true
  },
  status:{
    type:String,
    default:"在职"
  },
  gender:{// 性别
    type:String,
    required:true
  },
},{timestamps:true})

export default mongoose.model('Worker',workerSchema)