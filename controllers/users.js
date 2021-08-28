const UsersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

UsersRouter.get('/', async (request, response) => {
  const Users = await User.find({}).populate('blogs',{title:1,author:1,url:1,likes:1})
  response.json(Users)
})

UsersRouter.get('/:id', async (request, response) => {
  const User = await User.findById(request.params.id)
  if (User) {
    response.json(User)
  } else {
    response.status(404).end()
  }
})

UsersRouter.post('/', async (request, response) => {
  const body = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

UsersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

UsersRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = {
    content: body.content,
    important: body.important,
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
  response.json(updatedUser)
})

module.exports = UsersRouter