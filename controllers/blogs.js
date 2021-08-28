const BlogsRouter = require('express').Router()
const Blog = require('../models/blog')

BlogsRouter.get('/', async (request, response) => {
  const Blogs = await Blog.find({}).populate('user',{username:1,name:1})
  response.json(Blogs)
})

BlogsRouter.get('/:id', async (request, response) => {
  const Blog = await Blog.findById(request.params.id)
  if (Blog) {
    response.json(Blog)
  } else {
    response.status(404).end()
  }
})

BlogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)
  blog.user = user._id
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

BlogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const checkUser = await Blog.findById(request.params.id)
  if(checkUser === null){
    return response.status(401).json({ error: 'No Blogs Found to delete' })
  }
  if(user._id.toString() === checkUser.user.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    user.blogs = user.blogs.remove(request.params.id)
    await user.save()
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'You can only delete blog created by you' })
  }
  
})

BlogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    content: body.content,
    important: body.important,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = BlogsRouter