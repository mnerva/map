import express from 'express';
import { slicedLogs } from '../controllers/logsController.js';
import { downloadLogFile } from '../controllers/logsController.js';
import basicAuthMiddleware from '../middleware/basicAuthMiddleware.js';

const router = express.Router();

router.get('/', basicAuthMiddleware, slicedLogs);
router.get('/:filename', basicAuthMiddleware, downloadLogFile);

export default router;