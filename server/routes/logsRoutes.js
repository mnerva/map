import express from 'express';
import { splitLogsHandler } from '../controllers/logsController.js';
import basicAuthMiddleware from '../middleware/basicAuthMiddleware.js';

const router = express.Router();

router.get('/', basicAuthMiddleware, splitLogsHandler);

export default router;