const express=require('express')
const cors=require('cors')
const morgan=require('morgan')

const files=require('./Files.js')
const folder=require('./folder.js')
const list=require('./list1.js')
const search=require('./search.js')
const database=require('./database.js')
const bodyParser = require('body-parser')
const register=require('./registeration.js')
const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended':false}))

app.use('/',register)
app.use(morgan('combined'))
const corsOpts={
    orgin:"*",
    method:["GET","POST"],
    allowedHeaders:["content-type",]
}
app.use(cors(corsOpts))
app.use((req,res,next)=>{
    res.setHeader('ACCESS-CONTROL-ALLOW-ORGIN',"*")
    res.setHeader('ACCESS-CONTROL-ALLOW-METHODS',"GET,POST")
    res.setHeader('ACCESS-CONTROL-ALLOW-HEADERS',"CONTENT-TYPE")
    res.setHeader('ACCESS-CONTROL-ALLOW-CREDENTIALS',true)
    next()
})
app.post('/',(req,res)=>{
    res.send("ok")
})
app.use('/database',database)
app.use('/search',search)
app.use('/list',list)
app.use('/file',files)
app.use('/folder',folder)

module.exports=app