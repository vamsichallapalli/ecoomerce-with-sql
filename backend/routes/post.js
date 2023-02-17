import express from 'express'
import { getpost,AddPost } from '../controllers/post.js'
const router = express.Router()
router.get("/",getpost)
router.post("/add",AddPost)
export default router
