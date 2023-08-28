const express=require("express")
const mysql=require('mysql')
const router=express.Router()



router.post('/',(req,res)=>{
    let connection=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"mac123456",
        database:"vdr"
    })


    connection.connect(err=>{
        if(err){
            console.log(err)
        }
        else{
            connection.query(`create table file(id varchar(200) primary key ,fileName varchar(100),filePath varchar(500),folderId varchar(200),foreign key(folderId) references folder(id))`,(err,result)=>{
          if(err){
            console.log(err)
          }
          else{
            res.send(result)
          }
            })
        }
    })
})

module.exports=router