const express = require("express")
const router = express.Router()
const { getContacts, createContact, getContact, updateContact, deleteContact, queryWithMail } = require('../controllers/contactController')
// const validateToken = require("../accessTokenHandler")


// router.use('/',validateToken,(req, res, next) => {
//     res.status(202)
//     next()
// })
router.get('/',getContacts)
console.log("creating")
router.post('/', createContact)
router.post('/:id', getContact)
router.put('/:id', updateContact)
router.delete('/:id', deleteContact)
router.get('/query',queryWithMail)




// router.route('/').get((req,res)=>{
//     res.status(201)
//     res.json({message:"Test Successful"})
// })

module.exports = router