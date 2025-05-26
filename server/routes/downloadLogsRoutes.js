import express from 'express';
import { downloadLogFile } from '../controllers/downloadLogsController.js';

const router = express.Router();

router.get('/', downloadLogFile);

export default router;