import express from 'express';
import { downloadLogs } from '../controllers/logsController.js';

const router = express.Router();

router.get('/', downloadLogs);

export default router;