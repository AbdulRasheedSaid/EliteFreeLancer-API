import searchCategory from 'controllers/search.js'
import express from 'express'

const router = express.Router()

router.get('/', searchCategory)

export default router