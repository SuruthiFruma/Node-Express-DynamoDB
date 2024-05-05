const AWS = require('aws-sdk')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME

//*******Controllers*********
// Dynamo Methods - sacn,get,put,update, delete, query
//GET
const getContacts = async (req, res) => {
    const params = {
        TableName: TABLE_NAME
    }
    const contact = await dynamoClient.scan(params).promise()
    console.log(contact)
    res.json({ message: contact.Items })
}

//POST
const createContact = async (req, res) => {
    console.log("inside create contact")
    console.log("Request body", req.body)
    const { contactName, contactEmail } = req.body
    const { contactId, contactPassword } = req.body
    const hasedPassword = await bcrypt.hash(contactPassword, 10)
    if (!contactEmail || !contactName) {
        throw new Error("All fields are mandatory")
    }
    const params = {
        TableName: TABLE_NAME,
        Item: { ...req.body, contactPassword: hasedPassword }
    }
    await dynamoClient.put(params).promise()
    res.json({
        message: "Created contact"
    })
}

//POST
const getContact = async (req, res) => {
    console.log(req.body)
    const params = {
        TableName: TABLE_NAME,
        Key: {
            contactId: req.params.id,
            contactName: req.body.contactName
        }
    }
    const contact = await dynamoClient.get(params).promise()
    res.json({
        message: "Item retrived",
        contact: contact.Item
    })
}
const updateContact = async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            contactId: req.params.id,
            contactName: req.body.contactName,
        },
        UpdateExpression: 'SET #contactPassword=:contactPassword , #contactEmail=:contactEmail',
        ExpressionAttributeNames: {
            '#contactPassword': 'contactPassword',
            '#contactEmail': 'contactEmail'
        },
        ExpressionAttributeValues: {
            ':contactPassword': req.body.contactPassword,
            ':contactEmail': req.body.contactEmail
        }
    }
    const contact = await dynamoClient.update(params).promise()
    res.json({
        message: "Edit contact",
        contact
    })
}
const deleteContact = async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            contactId: req.params.id,
            contactName: req.body.contactName
        }
    }
    await dynamoClient.delete(params).promise()
    res.json({
        message: "Deleted contact",
    })
}
//GET
const queryWithMail = async (req, res) => {
    console.log("Request", req.body)
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: '#pk=:pk AND #sk=:sk',
        FilterExpression:'#contactEmail = :contactEmail',
        ExpressionAttributeNames: {
            '#pk': 'contactId',
            '#sk': 'contactName',
            '#contactEmail':'contactEmail'
        },
        ExpressionAttributeValues: {
            ':pk': req.body.contactId,
            ':sk': req.body.contactName,
            ':contactEmail':req.body.contactEmail
        }
    }
    const contact = await dynamoClient.query(params).promise()
    res.json({
        message: "Query retrieved",
        contact: contact.Items
    })
}





module.exports = { getContacts, createContact, getContact, updateContact, deleteContact, queryWithMail }