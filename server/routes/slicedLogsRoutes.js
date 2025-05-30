import express from 'express';
import { listLogFiles, downloadLogFile } from '../controllers/logsController.js';
import basicAuthMiddleware from '../middleware/basicAuthMiddleware.js';

const router = express.Router();

router.get('/', basicAuthMiddleware, listLogFiles);
router.get('/:filename', basicAuthMiddleware, downloadLogFile);

export default router;