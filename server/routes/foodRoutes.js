import express from 'express';
import { fetchFoodPlaces } from '../controllers/foodController.js';

const router = express.Router();

router.get('/', fetchFoodPlaces);

export default router;