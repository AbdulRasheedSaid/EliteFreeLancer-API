import express from 'express';
import { getCategories, createCategory, getCategoryById, deleteCategory, updateCategory } from '../controllers/category.js';
import { verifyAuthorOwnership } from 'middleware/authorAuth.js';

const router = express.Router();

router.get('/', getCategories);

router.post('/', createCategory);

router.get('/:id', getCategoryById);

router.delete('/:id', verifyAuthorOwnership , deleteCategory);

router.put('/:id', verifyAuthorOwnership , updateCategory);

export default router;