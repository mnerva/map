import express from 'express';
import { fetchCities } from '../controllers/locationsController.js';

const router = express.Router();

router.get('/', fetchCities);

export default router;