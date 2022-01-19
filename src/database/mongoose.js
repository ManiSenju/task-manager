const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
});



// const me  = new User({
//     name:" Mani ",
//     age:25,
//     email:"senju@shuterfly.com",
//     password:"wearerock"
// })

// me.save().then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })



// const task = new Task({
//     description:"Dinner1"
// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((e)=>{
//     console.log(e)
// })