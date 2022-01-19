const express = require('express')
require('./database/mongoose.js')
const User = require('./models/users.js')
const Task = require('./models/tasks.js')
const userRouter = require('./routes/userRoutes.js')
const taskRouter = require('./routes/taskRoutes.js')

const port = process.env.PORT

const app = express()

//express middleware
// app.use((req,res,next)=>{
//     res.status(503).send("Under Maintenance")

// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log("Server is up and running on ",port)
})