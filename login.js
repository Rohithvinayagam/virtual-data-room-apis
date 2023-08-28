const express=require('express')
const mysql=require('mysql')
const fs=require('fs')
const {v4:uuid}=require('uuid')
const bodyParser=require('body-parser')
const router=express.Router()


router.use(bodyParser.json())
router.post('/',(req,res)=>{
    let mobileNumber=req.body.mobileNumber
    if(mobileNumber!==undefined){

function tokenGenerate(){
    let str='0123456789zaqwsxcderfvbgtyhnmjuiklop'
    token=''
    for(let i=0;i<32;i++){
        token+=str[Math.floor(Math.random()*str.length)]
    }
    return token
}
     let connection=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"dell123456",
            database:"vdr"
        })
          

function validate(userId){
    connection.query(`select id from token where userId="${userId}"`,(err,result)=>{
    if(err){
        console.log(err)
    }
    else{
        if(result.length){
            updateTokenTable(result[0].id)
        }
        else{
            tokenTable(userId)
        }
    }
}) }
                 connection.query(`select userId from userPersonalInfo where mobileNumber="${mobileNumber}"`,(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                 validate(result[0].userId)
                    }

                })
            
        function updateTokenTable(id){
            let token=tokenGenerate()
            connection.query(`update token set token="${token}" where id="${id}"`,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json({'success':true,
                    "message":"login successfully",
                "token":token})
                }
            })
        }
        function tokenTable(id){
            let token=tokenGenerate()
            connection.query(`insert into token(id,token,createAt,userId) values('${uuid()}','${token}',NOW(),'${id}')`,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    fs.mkdirSync("./vdr/"+id)
                    res.json({'success':true,
                "message":"login successfully",
            "token":token})
                }
            })
        }
    }
    else{
        res.json({"status":false,"message":"invalid request"})
    }
})

module.exports=router