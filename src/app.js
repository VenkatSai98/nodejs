const express = require('express')

const app = express()

app.listen(1234, function(){
    console.log('server is running on port 1234')
})
app.get("/",(req, res)=>{
    res.send('welcome to this server 1234 new')
})
app.get("/test",(req, res)=>{
    res.send('welcome to this test page')
})