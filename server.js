const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { port, mongoURL } = require('./config')
const transactionsRoutes = require('./routes/transactions')
const path = require('path')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

mongoose
    .connect(mongoURL, {
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDb database is connected'))
    .catch((err) => console.log(err))

app.use('/api/transactions', transactionsRoutes)

app.listen(port , () => {
    console.log(`port is running on ${port}`)
})