
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json('Hello Hono!')
})

app.get('/:id', (c) => {
  return c.json('Templates')
})

export default app;
