require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userAuth=require('./routes/auth.js')
const taskAuth=require('./routes/task.routes.js')

connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running...')
})
app.use('/api/auth', userAuth)
app.use('/api/tasks', taskAuth)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))