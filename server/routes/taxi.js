import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

const CAR_PRICES = { economy: 10, comfort: 18, premium: 30, xl: 35 }

// GET available drivers
router.get('/drivers', (req, res) => {
  const db = getDb()
  const drivers = db.prepare("SELECT * FROM drivers WHERE is_online=1 AND status='available'").all()
  res.json(drivers)
})

// POST new ride request
router.post('/ride', (req, res) => {
  const { customer_name, customer_phone, from_ar, from_en, to_ar, to_en, car_type, notes } = req.body
  if (!customer_name || !customer_phone || !from_ar || !to_ar) {
    return res.status(400).json({ error: 'missing_fields' })
  }
  const db = getDb()
  const fare = CAR_PRICES[car_type] || 10
  const id = 'RID-' + Date.now()

  // assign first available driver
  const driver = db.prepare("SELECT * FROM drivers WHERE is_online=1 AND status='available' LIMIT 1").get()

  db.prepare(`
    INSERT INTO taxi_rides (id, customer_name, customer_phone, from_ar, from_en, to_ar, to_en, car_type, fare, driver_id, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'accepted', ?)
  `).run(id, customer_name, customer_phone, from_ar, from_en || from_ar, to_ar, to_en || to_ar, car_type || 'economy', fare, driver?.id || null, notes || '')

  if (driver) {
    db.prepare("UPDATE drivers SET status='delivering' WHERE id=?").run(driver.id)
  }

  res.json({ id, fare, driver: driver || null, status: 'accepted' })
})

// GET ride status
router.get('/ride/:id', (req, res) => {
  const db = getDb()
  const ride = db.prepare('SELECT * FROM taxi_rides WHERE id=?').get(req.params.id)
  if (!ride) return res.status(404).json({ error: 'not_found' })
  const driver = ride.driver_id ? db.prepare('SELECT * FROM drivers WHERE id=?').get(ride.driver_id) : null
  res.json({ ...ride, driver })
})

// GET all rides - admin
router.get('/rides', verifyToken, (req, res) => {
  const db = getDb()
  const rides = db.prepare('SELECT * FROM taxi_rides ORDER BY created_at DESC LIMIT 50').all()
  res.json(rides)
})

// PATCH ride status - admin/driver
router.patch('/ride/:id', verifyToken, (req, res) => {
  const { status } = req.body
  const db = getDb()
  db.prepare('UPDATE taxi_rides SET status=? WHERE id=?').run(status, req.params.id)
  if (status === 'completed' || status === 'cancelled') {
    const ride = db.prepare('SELECT * FROM taxi_rides WHERE id=?').get(req.params.id)
    if (ride?.driver_id) db.prepare("UPDATE drivers SET status='available' WHERE id=?").run(ride.driver_id)
  }
  res.json({ success: true })
})

export default router
