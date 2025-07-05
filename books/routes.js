import express from 'express';
import {
  createBook,
  getBook,
  deleteBook,
} from './Controller.js';
import { authenticate } from './authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createBook);      
router.get('/:id', authenticate, getBook);        
router.delete('/:id', authenticate, deleteBook);  

export default router;