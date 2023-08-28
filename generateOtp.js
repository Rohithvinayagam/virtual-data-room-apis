const express = require('express')
const moment = require("moment")
const mysql = require("mysql")
const bodyParser = require('body-parser')

const app = express.Router()
app.use(bodyParser.json())




app.post('/', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "dell123456",
        database: "vdr"
    })

        function generateOtp() {

            let str = '0123456789'
        
            let otp = ''
            for (let i = 0; i < 4; i++) {
                otp += str[Math.floor(Math.random() * 10)]
            }
            return otp
        }

        function add(userId) {
            let otp= generateOtp()             
            connection.query(`update userAthendication set otp=${otp},expiryTime=NOW() where userId ='${userId}'`,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json({"status":true,"otp":otp})
                }
            })
        
        }

            let mobileNumber=req.body.mobileNumber
            if(mobileNumber!==undefined){

            
                    connection.query(`select userID from userPersonalInfo where mobileNumber=${mobileNumber}`,(err,result)=>{
                        if(err){
                           res.send(err)
                          
                        }
                        else{
                            if(result.length){
                       add(result[0].userID)
                            }
                            else{
                                res.json({"success":false,
                            "message":"not exist"})
                            }
                        }
                    })

                }
                else{
                    res.json({"status":false,"message":"invalid request"})
                }
})

module.exports=app