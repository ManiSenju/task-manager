const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/users')
const {userOne,userOneId,setUpDB} = require('./fixtures/db.js')


beforeEach(setUpDB)

test('should create a new user',async ()=>{
    const response  = await request(app).post('/users').send({
        name:"David",
        email:"David@sh.com",
        password:"Davidtest"
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user:{
            name:"David",
            email:"david@sh.com"
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe("Davidtest")
})

test('should login existing user', async ()=>{
    const response  = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('shouldnot login for non existing user', async ()=>{
    await request(app).post('/users/login').send({
        email:'Ds@sh.com',
        password:'asgthy324'
    }).expect(400)
})

test('should get profile',async ()=>{
    await request(app).get('/users/me')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send()
        .expect(200)
})

test('shouldnot get profile for unauthenticated user',async ()=>{
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('should delete authenticated user', async ()=>{
    await request(app).delete('/users/me')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('shouldnot delete for non authenticated user', async ()=>{
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('should attach profile picture',async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .attach('avatar','tests/fixtures/car.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields',async ()=>{
    await request(app)
        .patch('/users/me')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send({
            name:"Mani Senju"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Mani Senju')
})

test('shouldnot update in valid user fields',async ()=>{
    await request(app)
        .patch('/users/me')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send({
            location:"New York"
        })
        .expect(400)
})