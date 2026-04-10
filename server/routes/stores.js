import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/stores — public
router.get('/', (req, res) => {
  const db = getDb()
  const stores = db.prepare('SELECT * FROM stores ORDER BY id').all()
  res.json(stores)
})

// GET /api/stores/:id — public
router.get('/:id', (req, res) => {
  const db = getDb()
  const store = db.prepare('SELECT * FROM stores WHERE id=?').get(req.params.id)
  if (!store) return res.status(404).json({ error: 'not_found' })
  res.json(store)
})

// PUT /api/stores/:id — vendor or admin
router.put('/:id', verifyToken, (req, res) => {
  const { role, storeId } = req.user
  const id = parseInt(req.params.id)
  if (role !== 'admin' && (role !== 'vendor' || storeId !== id)) {
    return res.status(403).json({ error: 'forbidden' })
  }
  const { name_ar, name_en, phone, min_order, delivery_fee, delivery_time, is_open, address_ar, address_en } = req.body
  const db = getDb()
  db.prepare(`
    UPDATE stores SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en),
    phone=COALESCE(?,phone), min_order=COALESCE(?,min_order),
    delivery_fee=COALESCE(?,delivery_fee), delivery_time=COALESCE(?,delivery_time),
    is_open=COALESCE(?,is_open), address_ar=COALESCE(?,address_ar), address_en=COALESCE(?,address_en)
    WHERE id=?
  `).run(name_ar,name_en,phone,min_order,delivery_fee,delivery_time,is_open,address_ar,address_en,id)
  const updated = db.prepare('SELECT * FROM stores WHERE id=?').get(id)
  res.json(updated)
})

// POST /api/stores — admin only
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const { name_ar, name_en, category, logo, phone, min_order, delivery_fee, delivery_time } = req.body
  if (!name_ar || !name_en) return res.status(400).json({ error: 'name_required' })
  const db = getDb()
  const result = db.prepare(`
    INSERT INTO stores (name_ar, name_en, category, logo, phone, min_order, delivery_fee, delivery_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name_ar, name_en, category||'restaurant', logo||'🏪', phone||'', min_order||0, delivery_fee||0, delivery_time||'30-45')
  const store = db.prepare('SELECT * FROM stores WHERE id=?').get(result.lastInsertRowid)
  res.status(201).json(store)
})

// DELETE /api/stores/:id — admin only
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  db.prepare('DELETE FROM stores WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

export default router
