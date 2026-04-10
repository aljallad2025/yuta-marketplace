import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

function parseOrder(o) {
  if (o && typeof o.items === 'string') {
    try { o.items = JSON.parse(o.items) } catch { o.items = [] }
  }
  return o
}

// GET /api/orders — filtered by role
router.get('/', verifyToken, (req, res) => {
  const { role, storeId, driverId, id: userId } = req.user
  const db = getDb()
  let orders

  if (role === 'admin') {
    orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  } else if (role === 'vendor') {
    orders = db.prepare('SELECT * FROM orders WHERE store_id=? ORDER BY created_at DESC').all(storeId)
  } else if (role === 'driver') {
    orders = db.prepare("SELECT * FROM orders WHERE driver_id=? OR (status='accepted' AND driver_id IS NULL) ORDER BY created_at DESC").all(userId)
  } else {
    orders = db.prepare('SELECT * FROM orders WHERE customer_id=? ORDER BY created_at DESC').all(userId)
  }

  res.json(orders.map(parseOrder))
})

// GET /api/orders/available — for drivers
router.get('/available', verifyToken, requireRole('driver'), (req, res) => {
  const db = getDb()
  const orders = db.prepare("SELECT * FROM orders WHERE status='accepted' AND driver_id IS NULL ORDER BY created_at ASC").all()
  res.json(orders.map(parseOrder))
})

// GET /api/orders/:id
router.get('/:id', verifyToken, (req, res) => {
  const db = getDb()
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id)
  if (!order) return res.status(404).json({ error: 'not_found' })
  res.json(parseOrder(order))
})

// POST /api/orders — create new order (public or customer)
router.post('/', (req, res) => {
  const { store_id, customer_id, customer_name_ar, customer_name_en, customer_phone, address_ar, address_en, items, subtotal, delivery_fee, total, notes } = req.body
  if (!store_id || !customer_phone || !address_ar || !items) {
    return res.status(400).json({ error: 'missing_fields' })
  }
  const db = getDb()
  const id = `ORD-${Date.now()}`
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO orders (id, store_id, customer_id, customer_name_ar, customer_name_en, customer_phone, address_ar, address_en, items, subtotal, delivery_fee, total, status, notes, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'pending',?,?,?)
  `).run(id, store_id, customer_id||null, customer_name_ar||'عميل', customer_name_en||'Customer', customer_phone, address_ar, address_en||'', JSON.stringify(items), subtotal||0, delivery_fee||0, total||0, notes||'', now, now)

  // Notification for vendor
  db.prepare(`INSERT INTO notifications (type,title_ar,title_en,msg_ar,msg_en,store_id,is_read) VALUES (?,?,?,?,?,?,0)`)
    .run('order','طلب جديد','New Order',`طلب جديد ${id}`,`New order ${id}`, store_id)

  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(id)
  res.status(201).json(parseOrder(order))
})

// PATCH /api/orders/:id/status — update status
router.patch('/:id/status', verifyToken, (req, res) => {
  const { status, driver_id } = req.body
  const { role, id: userId, storeId, driverId } = req.user

  const db = getDb()
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id)
  if (!order) return res.status(404).json({ error: 'not_found' })

  // Authorization
  if (role === 'vendor' && order.store_id !== storeId) return res.status(403).json({ error: 'forbidden' })
  if (role === 'driver' && order.driver_id && order.driver_id !== userId) return res.status(403).json({ error: 'forbidden' })

  const validStatuses = ['pending','accepted','preparing','ready','on_the_way','completed','cancelled']
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'invalid_status' })

  const now = new Date().toISOString()
  if (driver_id || (role === 'driver' && status === 'on_the_way')) {
    const assignedDriver = driver_id || userId
    db.prepare('UPDATE orders SET status=?, driver_id=?, updated_at=? WHERE id=?').run(status, assignedDriver, now, req.params.id)
    // Update driver status
    db.prepare("UPDATE drivers SET status='delivering' WHERE id=?").run(assignedDriver)
  } else {
    db.prepare('UPDATE orders SET status=?, updated_at=? WHERE id=?').run(status, now, req.params.id)
  }

  if (status === 'completed') {
    db.prepare("UPDATE drivers SET status='available', trips=trips+1, earnings=earnings+? WHERE id=?")
      .run(15, order.driver_id || driver_id || userId)
    // Commission transaction
    if (order.driver_id || driver_id) {
      db.prepare(`INSERT INTO transactions (user_id,amount,type,description,order_id) VALUES (?,?,?,?,?)`)
        .run(order.driver_id || driver_id, 15, 'credit', `Delivery earnings for ${req.params.id}`, req.params.id)
    }
    // Vendor revenue
    db.prepare(`INSERT INTO transactions (user_id,amount,type,description,order_id) VALUES (?,?,?,?,?)`)
      .run('VND-' + order.store_id, order.total * 0.85, 'credit', `Sale revenue for ${req.params.id}`, req.params.id)
  }

  const updated = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id)
  res.json(parseOrder(updated))
})

export default router
