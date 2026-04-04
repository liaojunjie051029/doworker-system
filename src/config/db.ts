// 全局设置时区：北京时间
process.env.TZ = 'Asia/Shanghai';

import mongoose from 'mongoose'; // 1. 导入 mongoose 库（用来操作 MongoDB 数据库的工具）
import dotenv from 'dotenv'; // 2. 导入 dotenv 库（用来读取 .env 文件里的环境变量）
dotenv.config(); // 3. 加载 .env 文件里的配置（让 process.env 能读到里面的内容）

// 4. 定义一个异步函数，用来连接数据库
// 异步函数 = 可以等待数据库连接完成再往下执行
const connectDB = async () => {
  try{
    // 5. 尝试连接 MongoDB 数据库
    // process.env.MONGO_URI = 从 .env 文件里取数据库连接地址
    // ! 号 = 告诉 TS：这个值一定存在，不用担心为 undefined
    await mongoose.connect(process.env.MONGO_URI!)
    // 6. 连接成功后打印提示
    console.log('MongoDB 连接成功');
  }catch(err){
    // 7. 如果连接失败，进入 catch 代码块
    console.error('数据库连接失败', err);
    // 8. 退出程序（1 表示异常退出）
    process.exit(1);
  }
};

export default connectDB; // 9. 把这个函数导出，在其他地方可以导入并调用