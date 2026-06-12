import { Hono } from 'hono'
import templates from './router/templates/ats'

const app = new Hono()

app.route('/templates/ats', templates);

export default app
