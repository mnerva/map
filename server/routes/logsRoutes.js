import express from 'express';
import { downloadLogs } from '../controllers/logsController.js';
import { basicAuthMiddleware } from '../middleware/basicAuthMiddleware.js';

const router = express.Router();

router.get('/', basicAuthMiddleware, downloadLogs);

export default router;