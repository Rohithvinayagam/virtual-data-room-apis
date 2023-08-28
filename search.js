const express=require('express')
const mysql=require('mysql')
const fs=require('fs')
const bodyParser=require('body-parser')
const path=require('path')
const {userIdFunction,fileDataFunction,folderDataFunction}=require('./Functions.js')
const router=express.Router()

router.use(bodyParser.json())
router.post('/',(req,res)=>{
    let searchName=req.body.search
   let token=req.headers.token
       
   async function find(data){
         return new Promise((resolve,reject)=>  {
           data.forEach(it=>{
                    if(it.filName!==undefined){
                        it.type="file"
                    }
                    else{
                        it.type="folder"
                    }
                })
                let details=data.filter(it=>((it.fileName!==undefined)&&(it.fileName.startsWith(searchName))||((it.folderName!==undefined)&&(it.folderName.startsWith(searchName)))))
                resolve(details)
            })
        }
              async function main(){
                let userId=await userIdFunction(token)
                let file= await fileDataFunction(userId)
                let folder=await folderDataFunction(userId)
                let data=[...file,...folder]
                let details=await find(data)

             if(details.length)  {
                res.json({"success":true,
                "message":"find successfully",
                "details":details})
            }
            else{
                res.json({"success":true,
                "message":"find successfully",
                "details":null})
            }
              }

              if((token!==undefined)&&(searchName!==undefined)){
                main()
              }
              else{
                res.json({"success":false,"message":"request invalid"})
              }
              
            })

module.exports=router

