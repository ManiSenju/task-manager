const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/tasks.js')
const {userTwo,userOne,userOneId,setUpDB, taskOne,taskTwo,taskThree} = require('./fixtures/db.js')


beforeEach(setUpDB)

test('should create task for user',async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send({
            description: "Watching Prime",
            owner: userOneId
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get all the tasks for a particular user',async ()=>{
    const response = await request(app)
        .get('/tasks')
        .set({Authorization:`Bearer ${userOne.tokens[0].token}`})
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('should not delete task in another users account',async ()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set({Authorization:`Bearer ${userTwo.tokens[0].token}`})
        .send()
        .expect(404)
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})