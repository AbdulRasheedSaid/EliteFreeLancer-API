import express from 'express';
import { getGig, createGig, getGigById, deleteGig, updateGig } from '../controllers/gig.js';
import { verifyAuthorOwnership } from 'middleware/authorAuth.js';

const router = express.Router();

router.get('/', getGig);

router.post('/', createGig);

router.get('/:id', getGigById);

router.delete('/:id', verifyAuthorOwnership , deleteGig);

router.put('/:id', verifyAuthorOwnership , updateGig);

export default router;