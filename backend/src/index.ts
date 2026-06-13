import { Hono } from 'hono'
import atsRoute from './router/templates/ats'

const app = new Hono()

app.route('/templates/ats', atsRoute)

export default app


