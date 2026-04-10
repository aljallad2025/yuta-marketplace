import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// GET /api/notifications
router.get('/', verifyToken, (req, res) => {
  const { role, storeId, id: userId } = req.user
  const db = getDb()
  let notifs
  if (role === 'admin') {
    notifs = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all()
  } else if (role === 'vendor') {
    notifs = db.prepare('SELECT * FROM notifications WHERE store_id=? OR store_id IS NULL ORDER BY created_at DESC LIMIT 30').all(storeId)
  } else {
    notifs = db.prepare('SELECT * FROM notifications WHERE user_id=? OR user_id IS NULL ORDER BY created_at DESC LIMIT 30').all(userId)
  }
  res.json(notifs)
})

// PATCH /api/notifications/:id/read
router.patch('/:id/read', verifyToken, (req, res) => {
  const db = getDb()
  db.prepare('UPDATE notifications SET is_read=1 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// PATCH /api/notifications/read-all
router.patch('/read-all', verifyToken, (req, res) => {
  const db = getDb()
  db.prepare('UPDATE notifications SET is_read=1').run()
  res.json({ success: true })
})

export default router
