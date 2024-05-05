


// const express=require('express')
// const app=express()
  

// app.use("/",(req,res,next)=>{
//     res.status(201)
//     next()
// })

// app.get("/",(req,res)=>{
//     res.send("Hello World")
// })

// app.route('/').post((req,res)=>{
//     res.send("Posted")
// })
// .put((req,res)=>{
//    res.send("Put")
// })




// app.listen(3000,()=>{
//     console.log("Server running at port 3000")
// })



const express=require('express')
const validateToken = require('./accessTokenHandler')
const app=express()
const dotenv=require("dotenv").config()
// const authenticateUser=require('./auth/authenticateUser')

// app.get('/api/contacts',(req,res)=>{
//         res.status(200)
//         res.json({message:"Test success"})
// })
app.use(express.json())
// app.get('/authenticate',authenticateUser)
app.use('/api/contacts', require("./routes/contactRoutes"))

const PORT=process.env.PORT ||7000
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})