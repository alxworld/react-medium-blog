import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@alexsamin/blogging-common'

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

// // Middleware to verify JWT token
// userRouter.use('/*', async (c, next) => {
//   const header = c.req.header('authorization') || ''
//   // Bearer token
//   const token = header.split(' ')[1]
//   const response = await verify(token, c.env.JWT_SECRET)

//   if (response.id) {
//     await next()
//   } else {
//     c.status(403)
//     return c.json({ error: 'Unauthorized' })
//   }
// })

// User Signup
userRouter.post('/signup', async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  const { success } = signupInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({ error: 'Invalid input' })
  }
  console.log('Creating user with email ' + body.email)
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  })
  try {
    const payload = {
      id: user.id,
      expiry: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    }
    const jwt_token = await sign(payload, c.env.JWT_SECRET)
    console.log('User created with token ' + jwt_token)
    console.log(jwt_token)
    return c.json({ jwt_token })
  } catch (e) {
    c.status(403)
    return c.json({ error: 'error while signing up' })
  }
})

// User Signin
userRouter.post('/signin', async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  const { success } = signinInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({ error: 'Invalid input' })
  }
  console.log('Finding user with email ' + body.email)
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
      password: body.password,
    },
  })
  if (!user) {
    c.status(403)
    return c.json({ error: 'User not found' })
  }
  const jwt_token = await sign({ id: user.id }, c.env.JWT_SECRET)
  console.log('User found with token ' + jwt_token)
  return c.json({ jwt_token })
})

// Home Get Page
userRouter.get('/', c => {
  return c.text('Hello Hono!')
})
