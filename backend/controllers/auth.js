import {connection} from '../connect.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const register = (req,res) =>{
//CHECK USER IF EXISTS
const {username,email,password,name} = req.body
const q = "SELECT * FROM users WHERE username = ?"
connection.query(q,[username],(err,row)=>{
    if(err){
        return res.status(500).json({"message":err})
    }
    else{
        if(row.length > 0){
            return res.status(404).json({"message":"User already exists"})
        }
        else{
            //CREATE NEW USER
            //HASH THE PASSWORD
            const salt = bcrypt.genSaltSync(10)
          
            const hashedPassword = bcrypt.hashSync(password,salt);
            const q = "INSERT INTO users (`username`,`password`,`name`,`email`) VALUE (?)";
            const values = [username,hashedPassword,name,email]
            connection.query(q,[values],(err,row)=>{
                if(err) return res.status(500).json({error:err})
                return res.status(200).json({"message":"User has been successfully registered"})

            })


        }
    }
})

}

//LOGIN
export const login = (req,res)=>{

    //CHECK THE USER DETAILS IN DATABASE
    const q = "SELECT * FROM users WHERE username = ?"
    const {username,password} = req.body
    connection.query(q,[username],(err,row)=>{
        if(err){
            return res.status(500).json({"message":err})
        }
        else{
            if(row.length === 0){
                return res.status(404).json({"message":"USER NOT FOUND"})
            }
            else{
            //IF USER EXISTS CHECK  THE PASSWORD IS ENTERED CORRECT OR NOT
            const checkingPassword = bcrypt.compareSync(password,row[0].password)
            if(!checkingPassword) {
                return res.status(404).json({"message":"Password is wrong"})
            }
            
            else{
                // creating json web token
                const jwtToken = jwt.sign({id:row[0].id},"qwertyuop")
               const {password,...others} = row[0]
             
                res.cookie("jwtToken",jwtToken,{
                        httpOnly:true
                         // SEND TOKEN TO CLIENT
                    }
                ).status(200).json({"userDetails":others})
            }
            }
        }
    })
    
}

//LOGOUT 
export const logout = (req,res)=>{
    res.clearCookie("jwtToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json({"message":"User has been logout successfully"})
}
