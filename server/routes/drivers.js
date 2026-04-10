import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/drivers — admin or public summary
router.get('/', verifyToken, (req, res) => {
  const db = getDb()
  const drivers = db.prepare('SELECT * FROM drivers ORDER BY joined_at DESC').all()
  res.json(drivers)
})

// GET /api/drivers/:id
router.get('/:id', verifyToken, (req, res) => {
  const db = getDb()
  const driver = db.prepare('SELECT * FROM drivers WHERE id=?').get(req.params.id)
  if (!driver) return res.status(404).json({ error: 'not_found' })
  res.json(driver)
})

// PATCH /api/drivers/:id — update driver status/online
router.patch('/:id', verifyToken, (req, res) => {
  const { role, id: myId } = req.user
  const db = getDb()
  const driver = db.prepare('SELECT * FROM drivers WHERE id=?').get(req.params.id)
  if (!driver) return res.status(404).json({ error: 'not_found' })

  // Drivers can only update themselves; admins can update any
  if (role !== 'admin' && driver.user_id !== myId) return res.status(403).json({ error: 'forbidden' })

  const { is_online, status, location_ar, location_en } = req.body
  db.prepare(`
    UPDATE drivers SET
      is_online=COALESCE(?,is_online),
      status=COALESCE(?,status),
      location_ar=COALESCE(?,location_ar),
      location_en=COALESCE(?,location_en)
    WHERE id=?
  `).run(is_online, status, location_ar, location_en, req.params.id)

  const updated = db.prepare('SELECT * FROM drivers WHERE id=?').get(req.params.id)
  res.json(updated)
})

// GET /api/drivers/:id/stats
router.get('/:id/stats', verifyToken, (req, res) => {
  const db = getDb()
  const driver = db.prepare('SELECT * FROM drivers WHERE id=?').get(req.params.id)
  if (!driver) return res.status(404).json({ error: 'not_found' })

  const completedOrders = db.prepare("SELECT * FROM orders WHERE driver_id=? AND status='completed'").all(req.params.id)
  const today = completedOrders.filter(o => {
    const d = new Date(o.created_at)
    const n = new Date()
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
  })
  const transactions = db.prepare("SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC LIMIT 20").all(req.params.id)

  res.json({
    driver,
    stats: {
      totalDeliveries: completedOrders.length,
      todayDeliveries: today.length,
      totalEarnings: driver.earnings,
      todayEarnings: today.length * 15,
      rating: driver.rating,
    },
    transactions,
    recentOrders: completedOrders.slice(0, 10).map(o => {
      if (typeof o.items === 'string') try { o.items = JSON.parse(o.items) } catch {}
      return o
    }),
  })
})

export default router
