import express from 'express';
import authMiddleware from '../middleware/auth';
// 导入控制器
import { getCardData ,getMonthlyCost ,getProjectProfitRank} from '../controllers/computedController'

const router: express.Router = express.Router();

router.use(authMiddleware);

//导入控制层
router.get('/getCardData', getCardData);
router.get('/getMonthlyCost', getMonthlyCost);
router.get('/getProjectProfitRank', getProjectProfitRank);

export default router;