import express from 'express';
import { addAnalytics, getAnalytics, updateAnalytics, deleteAnalytics } from '../controllers/analyticsController.js';
import authUser from '../middlewares/authUser.js';

const analyticsRouter = express.Router();
analyticsRouter.post('/add-analytics', authUser, addAnalytics);
analyticsRouter.get('/get-analytics', authUser, getAnalytics);
analyticsRouter.put('/update-analytics/:id', authUser, updateAnalytics)
analyticsRouter.delete('/delete-analytics/:id', authUser, deleteAnalytics)

export default analyticsRouter;