import express from 'express';
import {
  createBook,
  getBook,
  deleteBook,
} from './Controller.js';

const router = express.Router();

router.post('/', createBook);      
router.get('/:id', getBook);        
router.delete('/:id', deleteBook);  

export default router;