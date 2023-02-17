import { connection } from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment";
export const getComment = (req,res)=>{
    const {post_id} = req.query
    
    const q = "SELECT comments.*,users.id,name,profile_pic FROM comments JOIN users ON(comments.user_id = users.id) WHERE comments.post_id = ? ORDER BY created_At desc"
    connection.query(q,[post_id],(err,row)=>{
        if(err) return res.status(500).json(err)
        console.log(row)
        return res.status(200).json(row)
    })
}

//add comment
export const addComment = (req,res) =>{
    const token = req.cookies.jwtToken;
    if(!token) return res.status(401).json("Not logged in!")
    jwt.verify(token,'qwertyuop',(err,payload)=>{
        if(err) return res.status(401).status("Invalid token")
        const q = "INSERT INTO comments (`desc`,`created_At`,`user_id`,`post_id`) VALUE (?)"
        const values = [req.body.desc,moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), payload.id, req.body.post_id]
        connection.query(q,[values],(err,row)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created.");
        })
    })
   

}