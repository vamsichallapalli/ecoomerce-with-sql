import express from 'express'
import { addComment, getComment } from '../controllers/comment.js'
const router = express.Router()
router.get("/",getComment)
router.post("/add",addComment)
export default router
