import { connection } from "../connect.js"
import jwt from 'jsonwebtoken'
//get likes
export const getLikes = (req,res)=>{
    const q = "SELECT user_id from likes WHERE post_id = ?"
    connection.query(q,[req.query.post_id],(err,row)=>{
        if(err) return res.status(500).json(err)
       
        return res.status(200).json(row.map(like=>like.user_id))
    })
}

//add likes 
export const addLike = (req,res) =>{
    const token = req.cookies.jwtToken;
    if(!token) return res.status(401).json("Not logged in!")
    jwt.verify(token,'qwertyuop',(err,payload)=>{
        if(err) return res.status(401).status("Invalid token")
        const q = "INSERT INTO likes (`user_id`,`post_id`) VALUE (?)"
        const values = [payload.id, req.body.post_id]
        connection.query(q,[values],(err,row)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("like has been Added.");
        })
    })
   

}

//delete likes
export const deleteLike = (req, res) => {

    const token = req.cookies.jwtToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "qwertyuop", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM likes WHERE `user_id` = ? AND `post_id` = ?";
  
      connection.query(q, [userInfo.id, req.query.post_id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been disliked.");
      });
    });
  };