import express from 'express';
import {
  createUser,
  getUser,
  deleteUser,
} from './Controller.js';
import { authenticate } from './authMiddleware.js';

const router = express.Router();

// Add auth for all routes
router.post('/', authenticate, createUser);      
router.get('/:id', authenticate, getUser);       
router.delete('/:id', authenticate, deleteUser); 

export default router;