import express from 'express';
import { deleteLogFile } from '../controllers/logsController.js';

const router = express.Router();

router.delete('/', deleteLogFile);

export default router;