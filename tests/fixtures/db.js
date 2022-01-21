
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Task = require('../../src/models/tasks')
const User = require('../../src/models/users')

const userOneId = new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:"David1",
    email:"David1@sh.com",
    password:"David1test",
    tokens:[{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:"David2",
    email:"David2@sh.com",
    password:"David2test",
    tokens:[{
        token: jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne ={
    _id: new mongoose.Types.ObjectId(),
    description:"First Task",
    completed: false,
    owner: userOne._id
}
const taskTwo ={
    _id: new mongoose.Types.ObjectId(),
    description:"Second Task",
    completed: true,
    owner: userOne._id
}
const taskThree ={
    _id: new mongoose.Types.ObjectId(),
    description:"Third Task",
    completed: false,
    owner: userTwo._id
}

const setUpDB = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports ={
    setUpDB,
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}