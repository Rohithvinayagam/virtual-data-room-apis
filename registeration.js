const express = require('express')
const { v4: uuid } = require('uuid')
const validationOtp = require('./validateOtp')
const mysql = require("mysql")
const bodyParser = require('body-parser')

const login=require('./login.js')
const generateOtp = require('./generateOtp.js')

const app = express()


app.use('/login', login)
app.use('/validateOtp', validationOtp)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended':false}))
app.post('/a/:id',(req,res)=>{
    console.log(req.body)
    res.send('ök')
})

app.use('/generateOtp', generateOtp)

app.post("/register", (req, res) => {
   
    let email = req.body.email
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let gender = req.body.gender
    let aadharNumber = req.body.aadharNumber
    let address = req.body.address
    let pincode = req.body.pincode
    let dateOfBirth = req.body.dateOfBirth
    let bloodGroup = req.body.bloodGroup
    let isActive = req.body.isActive
    let isAdmin = req.body.isAdmin
    let mobileNumber = req.body.mobileNumber

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "dell123456",
        database: "vdr"
    })
  
   
     connection.query(`select email from user where email='${email}'`, (err, result) => {
if(err){
    console.log(err)
}
              else  if (result.length) {
                  res.json({"status":false,
                "message":"exist"})

                }
                else {
                  
                
                    function mobileNumberAthendication(){
                        connection.query(`select mobileNumber from userPersonalInfo where mobileNumber=${mobileNumber}`,(err,result)=>{
        
                            if(err){
                                console.log(err)
                            }
                            else{
                        
                                if (result.length) {
                                    res.json({"status":false,
                                    "message":"exist"})
                                    }
                                    else{
                                        res.json({ "status":true,"message": "register" })
                                        let id=uuid()
                                        add(id)
                                        userAuth(id)
                                        userPersonalInfo(id)
                                    }
                                }
                            })
                    }
                    if(!result.length){
                    mobileNumberAthendication()
                }else{
                    res.json({"status":false,
                    "message":"exist"})
                }
            }
            
                
            })
           
            function add(id) {

                let query = `insert into user (userId,firstName,lastName,email,dateJoin) values ('${id}','${firstName}','${lastName}','${email}',NOW())`
                connection.query(query, (err, result) => {
                    if (err) {
                        console.log(err,1111111)
                    }
                  
                })
            }

                function userAuth(id) {
                    let query = `insert into userAthendication (id,isActive,isAdmin,userId) values ('${uuid()}',${isActive},${isAdmin},'${id}')`
                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("userAth add")
                        }
                    })

                }
                function userPersonalInfo(id) {
                   
                    let query = `insert into userPersonalInfo (id,gender,aadharNumber,address,pincode,dateOfBirth,mobileNumber,bloodGroup,userId) values ('${uuid()}','${gender}','${aadharNumber}','${address}','${pincode}','${dateOfBirth}','${mobileNumber}','${bloodGroup}','${id}')`
                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("user personalinfo add")
                        }
                    })

                }

    })



module.exports = app
