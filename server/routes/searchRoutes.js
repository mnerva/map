import express from 'express';
import { fetchSearch } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', fetchSearch);

export default router;