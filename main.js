require('dotenv').config();
const express = require('express')
const cors = require('cors')
const router = require('./routes')
const app = express()
const config = require('./config/config.json')
const db = require('./databases/db')
const port = process.env.PORT

db.init(config)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/', router)

app.listen( port ,() => {
  console.log(`User services vokraf running on port : ${port}`)
})

module.exports = app