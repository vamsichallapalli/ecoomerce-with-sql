import { connection } from "../connect.js"
import jwt from 'jsonwebtoken'
import moment from "moment/moment.js";
export const  getpost = (req,res) =>{
    const token =req.cookies.jwtToken;
    if(!token) return res.status(401).json("Not logged in!")
    jwt.verify(token,'qwertyuop',(err,payload)=>{
        if(err) return res.status(403).json("Token is not valid")
        const q = "SELECT posts.*,users.id,profile_pic,name FROM posts JOIN users ON (posts.user_id = users.id) LEFT JOIN relationship ON(posts.user_id = relationship.followed_id) WHERE relationship.follower_id = ? OR posts.user_id = ? ORDER BY posts.created_At DESC"
   connection.query(q,[payload.id,payload.id],(error,data)=>{
    if(error) return res.status(505).json({"message":error})
    return res.status(200).json(data)
   })
    })
   
  
}
export  const AddPost  = (req,res)  =>{
    const {desc,image} = req.body
    const token = req.cookies.jwtToken
    if(!token) return res.status(401).json("Not logged in!")
    jwt.verify(token,'qwertyuop',(err,payload)=>{
        if(err) return res.status(401).status("Invalid token")
        const q = "INSERT INTO posts(`desc`,`image`,`created_At`,`user_id`) VALUE (?)"
        const values = [desc,image,moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),payload.id]
        connection.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been created")
        })
    })
}