const express = require('express')
const mysql = require("mysql")
const bodyParser = require('body-parser')
const app = express.Router()
app.use(bodyParser.json())

app.post('/', (req, res) => {

    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "dell123456",
        database: 'vdr'
    })
        
        let mobileNumber = req.body.mobileNumber
        let otp = req.body.otp

        function data(id) {
            connection.query(`select otp,expiryTime from userAthendication where userId='${id}' `, (err, result) => {
                if (err) {
                    console.log(err)
                }
                else {

                    validate(result[0].otp, result[0].expiryTime)
                }
            })
        }

        function validate(ExistOtp, time) {
            let sec = new Date() - new Date(time)
          
            if (sec <= (120 * 1000)) {
                if (otp == ExistOtp) {
                    res.json({
                        "status": true,
                        "message": "validated successfully"
                    })
                }
                else{
                    res.json({"status":false,
                "message":"wrong otp"})
                }
            }
            else {
                res.json({
                    "status": false,
                    "message": "times up"
                })
            }
        }
        if((mobileNumber!==undefined)&&(otp!==undefined)){
            connection.query(`select userID from userPersonalInfo where mobileNumber=${mobileNumber}`, (err, result) => {
                if (err) {
                    res.send(err)
                }
                else {
                 
                    data(result[0].userID)
                }
            })
        }
        else{
            res.json({"status":false,"message":"invalid request"})
        }

        
 
})

module.exports = app