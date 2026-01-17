import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import payment from './routes/payment.js'

const app = new Hono()

app.get('/', (c) => c.text('Payment API running 🚀'))

app.route('/payments', payment)

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Server running on http://localhost:3000')