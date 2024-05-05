const AWS = require('aws-sdk')
const dotenv=require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

})
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'contact-test'
const authenticateUser = async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            contactId: req.body.contactId,
            contactName: req.body.contactName
        }
    }
    const contact = await dynamoClient.get(params).promise()
    const {Item}=contact
    const {contactPassword:hasedPassword}=Item
    const isVerified= await bcrypt.compare(req.body.contactPassword,hasedPassword)
    if(!isVerified){
//AccessToken Generation
const accessToken=jwt.sign({
    contact:{
        contactId: req.body.contactId,
        contactName: req.body.contactName
    }
},process.env.ACCESS_TOKEN,{expiresIn:"30m"})
res.json({message:"Authenticated User",accessToken})

    }
    else{
        res.status(400)
        res.json({
            message:"You are not authenticated"
        })
    }

}

module.exports=authenticateUser