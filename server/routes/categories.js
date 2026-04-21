import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM categories ORDER BY sort_order').all()
  res.json(rows.map(r => ({
    id: r.id,
    labelAr: r.name_ar,
    labelEn: r.name_en,
    emoji: r.emoji || r.icon,
    path: r.path,
    active: r.active === 1,
    sort_order: r.sort_order
  })))
})

router.patch('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const { active } = req.body
  const db = getDb()
  db.prepare('UPDATE categories SET active=? WHERE id=?').run(active ? 1 : 0, req.params.id)
  res.json({ success: true })
})

router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const { name_ar, name_en, emoji, path, active, sort_order } = req.body
  const db = getDb()
  db.prepare('UPDATE categories SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), emoji=COALESCE(?,emoji), icon=COALESCE(?,icon), path=COALESCE(?,path), active=COALESCE(?,active), sort_order=COALESCE(?,sort_order) WHERE id=?')
    .run(name_ar, name_en, emoji, emoji, path, active != null ? (active ? 1 : 0) : null, sort_order, req.params.id)
  res.json({ success: true })
})

export default router
