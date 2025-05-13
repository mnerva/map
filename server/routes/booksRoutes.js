import express from 'express';
import { fetchBooks } from '../controllers/booksController.js';

const router = express.Router();

router.get('/', fetchBooks);

export default router;