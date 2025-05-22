import express from 'express';
import { getMapTilerKey } from '../controllers/maptilerController.js';

const router = express.Router();

router.get('/', getMapTilerKey);

export default router;