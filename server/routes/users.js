import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/users — admin: all users; vendor/driver: self
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  const users = db.prepare("SELECT id,role,username,name_ar,name_en,email,phone,status,avatar,store_id,driver_id,applied_at,created_at FROM users WHERE role!='admin' ORDER BY created_at DESC").all()
  res.json(users)
})

// GET /api/users/pending — admin
router.get('/pending', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  const users = db.prepare("SELECT id,role,username,name_ar,name_en,email,phone,status,avatar,store_id,driver_id,applied_at FROM users WHERE status='pending' ORDER BY applied_at").all()
  res.json(users)
})

// GET /api/users/customers — admin: all customers
router.get('/customers', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all()
  res.json(customers)
})

// GET /api/users/:id
router.get('/:id', verifyToken, (req, res) => {
  const { role, id: myId } = req.user
  if (role !== 'admin' && myId !== req.params.id) return res.status(403).json({ error: 'forbidden' })
  const db = getDb()
  const user = db.prepare("SELECT id,role,username,name_ar,name_en,email,phone,status,avatar,store_id,driver_id FROM users WHERE id=?").get(req.params.id)
  if (!user) return res.status(404).json({ error: 'not_found' })
  res.json(user)
})

// PATCH /api/users/:id/status — admin only
router.patch('/:id/status', verifyToken, requireRole('admin'), (req, res) => {
  const { status } = req.body
  const validStatuses = ['approved','rejected','suspended','pending']
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'invalid_status' })

  const db = getDb()
  db.prepare('UPDATE users SET status=? WHERE id=?').run(status, req.params.id)

  // If approving a driver, update drivers table too
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id)
  if (user.role === 'driver' && status === 'approved') {
    db.prepare("UPDATE drivers SET status='available' WHERE user_id=?").run(req.params.id)
  }

  res.json({ success: true, status })
})

// DELETE /api/users/:id — admin only
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  db.prepare('DELETE FROM users WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// PUT /api/users/:id — self update
router.put('/:id', verifyToken, (req, res) => {
  const { role, id: myId } = req.user
  if (role !== 'admin' && myId !== req.params.id) return res.status(403).json({ error: 'forbidden' })

  const { name_ar, name_en, email, phone, password } = req.body
  const db = getDb()
  let hash = null
  if (password) hash = bcrypt.hashSync(password, 10)

  db.prepare(`
    UPDATE users SET
      name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en),
      email=COALESCE(?,email), phone=COALESCE(?,phone)
      ${hash ? ', password_hash=?' : ''}
    WHERE id=?
  `).run(name_ar, name_en, email, phone, ...(hash ? [hash] : []), req.params.id)

  const updated = db.prepare("SELECT id,role,username,name_ar,name_en,email,phone,status,avatar FROM users WHERE id=?").get(req.params.id)
  res.json(updated)
})

export default router
