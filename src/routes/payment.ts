import { Hono } from 'hono'
import db from '../db/index.js'

const payment = new Hono()

// CREATE
payment.post('/', async (c) => {
  const { PaymentDate, Method, Amount, Status } = await c.req.json()

  const stmt = db.prepare(`
    INSERT INTO Payment (PaymentDate, Method, Amount, Status)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(PaymentDate, Method, Amount, Status)

  return c.json({
    message: 'Payment created',
    id: result.lastInsertRowid
  })
})

// READ ALL
payment.get('/', (c) => {
  const rows = db.prepare('SELECT * FROM Payment').all()
  return c.json(rows)
})

// READ ONE
payment.get('/:id', (c) => {
  const id = Number(c.req.param('id'))

  const row = db
    .prepare('SELECT * FROM Payment WHERE PaymentID = ?')
    .get(id)

  if (!row) {
    return c.json({ message: 'Payment not found' }, 404)
  }

  return c.json(row)
})

// UPDATE
payment.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { PaymentDate, Method, Amount, Status } = await c.req.json()

  const result = db.prepare(`
    UPDATE Payment
    SET PaymentDate = ?, Method = ?, Amount = ?, Status = ?
    WHERE PaymentID = ?
  `).run(PaymentDate, Method, Amount, Status, id)

  if (result.changes === 0) {
    return c.json({ message: 'Payment not found' }, 404)
  }

  return c.json({ message: 'Payment updated' })
})

// DELETE
payment.delete('/:id', (c) => {
  const id = Number(c.req.param('id'))

  const result = db
    .prepare('DELETE FROM Payment WHERE PaymentID = ?')
    .run(id)

  if (result.changes === 0) {
    return c.json({ message: 'Payment not found' }, 404)
  }

  return c.json({ message: 'Payment deleted' })
})

export default payment