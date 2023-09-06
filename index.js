const http=require ('http')
const app=require('./main.js')
http.createServer(app).listen(8080)