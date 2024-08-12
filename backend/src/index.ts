import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

// Middleware to verify JWT token
app.use('/api/v1/blog/*', async (c, next) => {
  const header = c.req.header('authorization') || ''

  // Bearer token
  const token = header.split(' ')[1]

  const response = await verify(token, c.env.JWT_SECRET)

  if (response.id) {
    await next()
  } else {
    c.status(403)
    return c.json({ error: 'Unauthorized' })
  }
})

app.get('/', c => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup', async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  console.log('Creating user with email ' + body)

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })

  try {
    const payload = {
      id: user.id,
      expiry: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    }
    //const secret = 'mySecretKey'
    const jwt_token = await sign(payload, c.env.JWT_SECRET)
    console.log('User created with token ' + jwt_token)
    return c.json({ jwt_token })
  } catch (e) {
    c.status(403)
    return c.json({ error: 'error while signing up' })
  }
})

app.post('/api/v1/user/signin', async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  console.log('Finding user with email ' + body.email)

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    c.status(403)
    return c.json({ error: 'User not found' })
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
  console.log('User found with token ' + jwt)
  return c.json({ jwt })
})

app.post('/api/v1/blog/blog', c => {
  return c.json({ message: 'Blog created' })
})

app.get('/api/v1/blog/blog/:id', c => {
  const id = c.req.param('id')
  console.log('getting id ' + id)
  return c.json({ message: `Blog ${id} fetched` })
})

app.put('/api/v1/blog/blog', c => {
  return c.json({ message: 'Blog updated' })
})

export default app
