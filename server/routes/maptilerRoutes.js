import express from 'express';
import { getMapTilerKey } from '../controllers/maptilerController.js';

const router = express.Router();

console.log("MapTiler routes loaded");

router.get('/', getMapTilerKey);

export default router;