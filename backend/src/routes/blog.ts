import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@alexsamin/blogging-common'

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

// Middleware to verify JWT token
blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header('authorization') || ''
  console.log('Auth header ' + authHeader)
  // Bearer token
  const token = authHeader.split(' ')[1]
  try {
    const response = await verify(token, c.env.JWT_SECRET)
    if (response) {
      c.set('userId', response.id || '')
      console.log('Token verified with id ' + response.id)
      await next()
      console.log('Next call completed')
    } else {
      c.status(403)
      return c.json({ error: 'Unauthorized' })
    }
  } catch (e) {
    c.status(403)
    return c.json({ error: 'Unauthorized' })
  }
})

blogRouter.post('/', async c => {
  const body = await c.req.json()
  console.log('Creating blog with title ' + body.title)
  const { success } = createBlogInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({ error: 'Invalid input' })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const authorId = c.get('userId')
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  })
  return c.json({ blog })
})

blogRouter.put('/', async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  console.log('Updating blog with title ' + body.title)
  const { success } = updateBlogInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({ error: 'Invalid input' })
  }
  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
    },
  })
  return c.json({ message: 'Blog updated with id ' + blog.id })
})

blogRouter.get('/:id', async c => {
  const id = c.req.param('id')
  console.log('getting blog id ' + id)
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.text()
  console.log('Request Body => ' + body)
  try {
    const blog = await prisma.blog.findFirst({
      where: { id: id },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    })
    return c.json({ blog })
  } catch (e) {
    c.status(404)
    console.log('Blog not found with ' + id)
    return c.json({ message: 'Blog not found with ' + id })
  }
})

// Todo: Implemtent Pagination
blogRouter.get('/', async c => {
  console.log('Getting all blogs')
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  //const blogs = await prisma.blog.findMany()
  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })
  return c.json({ blogs })
})
