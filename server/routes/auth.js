import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from '../db.js'
import { signToken } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username_password_required' })

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE LOWER(username)=LOWER(?)').get(username)

  if (!user) return res.status(401).json({ error: 'username_password_wrong' })

  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'username_password_wrong' })

  if (role && user.role !== role) return res.status(403).json({ error: 'wrong_role' })
  if (user.status === 'pending') return res.status(403).json({ error: 'pending_approval' })
  if (user.status === 'rejected') return res.status(403).json({ error: 'rejected' })
  if (user.status === 'suspended') return res.status(403).json({ error: 'suspended' })

  const token = signToken(user)
  const { password_hash, ...safeUser } = user
  res.json({ token, user: safeUser })
})

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { role, username, password, nameAr, nameEn, email, phone, vehicleAr, vehicleEn, plate } = req.body
  if (!['vendor', 'driver'].includes(role)) return res.status(400).json({ error: 'invalid_role' })
  if (!username || !password || !nameAr || !phone) return res.status(400).json({ error: 'missing_fields' })

  const db = getDb()
  const exists = db.prepare('SELECT id FROM users WHERE LOWER(username)=LOWER(?)').get(username)
  if (exists) return res.status(409).json({ error: 'username_taken' })

  if (email) {
    const emailExists = db.prepare('SELECT id FROM users WHERE LOWER(email)=LOWER(?)').get(email)
    if (emailExists) return res.status(409).json({ error: 'email_taken' })
  }

  const id = `${role === 'vendor' ? 'VND' : 'DRV'}-${Date.now()}`
  const hash = bcrypt.hashSync(password, 10)

  db.prepare(`
    INSERT INTO users (id, role, username, password_hash, name_ar, name_en, email, phone, status, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(id, role, username, hash, nameAr, nameEn || nameAr, email || null, phone, role === 'vendor' ? '🏪' : '🚗')

  if (role === 'driver') {
    db.prepare(`
      INSERT INTO drivers (id, user_id, name_ar, name_en, phone, vehicle_ar, vehicle_en, plate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(id, id, nameAr, nameEn || nameAr, phone, vehicleAr || '', vehicleEn || '', plate || '')

    db.prepare(`UPDATE users SET driver_id=? WHERE id=?`).run(id, id)
  }

  // Notify admin
  db.prepare(`INSERT INTO notifications (type,title_ar,title_en,msg_ar,msg_en,is_read) VALUES (?,?,?,?,?,0)`)
    .run(role === 'vendor' ? 'store' : 'driver',
        role === 'vendor' ? 'طلب متجر جديد' : 'سائق جديد',
        role === 'vendor' ? 'New Store Request' : 'New Driver',
        `${nameAr} طلب الانضمام كـ${role === 'vendor' ? 'مورد' : 'سائق'}`,
        `${nameAr} applied as ${role}`)

  res.status(201).json({ success: true, message: 'Registration submitted, awaiting admin approval' })
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'no_token' })
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sumu_super_secret_2025_key')
    const db = getDb()
    const user = db.prepare('SELECT id,role,username,name_ar,name_en,email,phone,status,avatar,store_id,driver_id FROM users WHERE id=?').get(decoded.id)
    if (!user) return res.status(404).json({ error: 'not_found' })
    res.json({ user })
  } catch {
    res.status(401).json({ error: 'invalid_token' })
  }
})

export default router
