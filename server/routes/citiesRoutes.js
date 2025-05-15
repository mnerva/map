import express from 'express';
import { fetchCities } from '../controllers/citiesController.js';

const router = express.Router();

router.get('/', fetchCities);

export default router;