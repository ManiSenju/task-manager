const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

const id = new ObjectId()
console.log(id)
console.log(id.id.length)
console.log(id.toHexString().length)

MongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Error occured while connectiong to db")
    }
    console.log("Connection Established")
    const db = client.db(dbName);

    // db.collection('users').deleteMany({age:25}).then((result)=>{
    //     console.log(result)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    db.collection('tasks').deleteOne({description : "Dinner"}).then((result)=>{
        console.log(result.deletedCount)
    }).catch((err)=>{
        console.log(err)
    })

    // db.collection('users').updateOne({_id:new ObjectId("61dc80a6ce2a2e5ef51ae969")},
    // {
    //     $set:{
    //         name: "Dolly"
    //     },
    //     $inc:{
    //         age: 1
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    // db.collection('tasks').updateMany({completed:false},
    // {
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    // db.collection('users').findOne({_id:new ObjectId("61dc80a6ce2a2e5ef51ae969")},(err,user)=>{
    //     if(err){
    //         return console.log("Unable to fetch document")
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age:25}).toArray((err,users)=>{
    //     if(err){
    //         return console.log("Unable to fetch document")
    //     }
    //     console.log(users)
    // })

    // db.collection('users').find({age:25}).count((err,count)=>{
    //     if(err){
    //         return console.log("Unable to fetch document")
    //     }
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({_id: new ObjectId("61dc8194fa62b371b6cb1dda")},(err,task)=>{
    //     if(err){
    //         return console.log("Unable to fetch document")
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed:false}).toArray((err,tasks)=>{
    //     if(err){
    //         return console.log("Unable to fetch document")
    //     }
    //     console.log(tasks)
    // })

    // db.collection('users').insertOne({
    //     name:"Mani",
    //     age:25
    // },(err,result)=>{
    //     if(err){
    //         return console.log("Unable to insert document")
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name:'jen',
    //         age:25
    //     },
    //     {
    //         name:'tylor',
    //         age:26
    //     }
    // ],(err,result)=>{
    //     if(err){
    //         return console.log("Unable to insert documents")
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description:'Dinner',
    //         completed:true
    //     },
    //     {
    //         description:'Finish Node js',
    //         completed:false
    //     },
    //     {
    //         description:'Finish js interview course',
    //         completed:false
    //     }
    // ],(err,result)=>{
    //     if(err){
    //         return console.log("Unable to insert documents")
    //     }
    //     console.log(result.ops)
    // })
})