const express = require('express');
const mongoose= require('mongoose')
const {port , mongoURL} = require('./config.js')
const app = express();
// test comment
mongoose
    .connect(mongoURL , {
        useUnifiedTopology:true
    })
    .then(() => {
    console.log(`connected to mongo database`)
    })
    .catch((err) => {
        console.log(err)
    })
app.get('/' , (req  , res) => {
    res.send("hello")
})

app.listen(port , () => {
    console.log(`port is running on ${port}`)
})