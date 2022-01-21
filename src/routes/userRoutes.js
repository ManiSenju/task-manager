const express = require('express')
const sharp = require('sharp')
const User = require('../models/users.js')
const auth = require('../middleware/auth.js')


const router = new express.Router()

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })
})

router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token  = await user.generateAuthToken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token=> token.token !== req.token)
        await req.user.save()
        res.send("logged out")
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("logged out in all devices")
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/me',auth,async (req,res)=>{
    const validUpdateOps = ['name','age','password','email']
    const updates = Object.keys(req.body)
    const isValidupdate = updates.every(update=>validUpdateOps.includes(update))
    if(!isValidupdate){
        return res.status(400).send({error:"Invalid updates!"})
    }
    try {
        const user = req.user
        updates.forEach(update=>user[update]=req.body[update])
        await user.save()    
       //const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const multer = require('multer')
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload a file in jp/jpeg/png format'))
        }
        callback(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try {
      const user = await User.findById(req.params.id)
      if(!user || !user.avatar){
          throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)  
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router