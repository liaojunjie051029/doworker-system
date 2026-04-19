import mongoose from 'mongoose'
//项目利润排行
const projectProfitSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  profit: {
    type: Number,
    required: true
  }

})

export default mongoose.model('ProjectProfit', projectProfitSchema)