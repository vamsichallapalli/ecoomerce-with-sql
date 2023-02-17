import  express  from "express";
import authRoutes from './routes/auth.js';
import likeRoutes from './routes/like.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js'
import userRoutes from './routes/user.js';
import cors from "cors"
import cookieParser from "cookie-parser";
import multer from "multer";
const app = express()
//middlewares

app.use((req,res,next)=>{   
res.header("Access-Control-Allow-Credentials", true);
    next()
})
app.use(express.json())
app.use(cors({ origin: "http://localhost:3000",}))
app.use(cookieParser())
const storage = multer.diskStorage({
destination:function(req,file,cb){
    cb(null,'../client/public/uploads')
}
},
{filename:function(req,file,cb){
cb(null,Date.now() + file.originalname)
}}

)
const upload = multer({storage:storage})
app.post("/api/uploads", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded" });
    }
    
    const file = req.file;
    res.status(200).json({ filename: file.filename });
  });
// routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/likes',likeRoutes)
app.use('/api/comment',commentRoutes)
app.use("/api/posts",postRoutes)

//server
app.listen(5000,()=>{
    console.log('backend database connected successfully')
})