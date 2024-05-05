const jwt=require('jsonwebtoken')
const dotenv=require("dotenv").config()
const validateToken=(req,res,next)=>{
    let token=req.headers.authorization
    console.log("token",token)
    token=token.split(" ")[1]
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,data)=>{
        if(err){
            res.send(400)
            res.json({message:"You are not authenticated"})
        }
        else{
            console.log(data)
            next()
        }
    })
   
}
module.exports=validateToken