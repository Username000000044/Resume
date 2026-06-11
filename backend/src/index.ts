import { Hono } from 'hono'
import ats from './routes/templates/ats'

const app = new Hono()

app.route('/templates/ats', ats)

export default app
