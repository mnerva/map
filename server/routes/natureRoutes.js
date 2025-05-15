import express from 'express';
import { fetchNature } from '../controllers/natureController.js';

const router = express.Router();

router.get('/', fetchNature);

export default router;