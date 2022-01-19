const express = require('express')
const Task = require('../models/tasks.js')
const auth = require('../middleware/auth.js')

const router = new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })
})


// Get /tasks?completed=true
// Get /tasks?limit=10&skip=0
// Get /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res)=>{
    try {
        const match = {}
        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
        }
        
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        //const tasks = await Task.find({'owner':req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id,'owner':req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})



router.patch('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    const validUpdateOps = ['description','completed']
    const updates = Object.keys(req.body)
    const isValidupdate = updates.every(update=>validUpdateOps.includes(update))
    if(!isValidupdate){
        return res.status(400).send({error:"Invalid updates!"})
    }
    try {
        const task = await Task.findOne({_id,owner:req.user._id})
        updates.forEach(update=>task[update]=req.body[update])
        await task.save()
       //const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
       if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})



router.delete('/tasks/:id',auth,async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router