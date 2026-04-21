import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// GET /api/options?product_id=X
router.get('/', (req, res) => {
  const { product_id } = req.query
  if (!product_id) return res.status(400).json({ error: 'product_id required' })
  const db = getDb()
  const options = db.prepare('SELECT * FROM product_options WHERE product_id=? ORDER BY id').all(product_id)
  const values = db.prepare('SELECT * FROM product_option_values WHERE option_id IN (SELECT id FROM product_options WHERE product_id=?) ORDER BY id').all(product_id)
  res.json(options.map(opt => ({ ...opt, values: values.filter(v => v.option_id === opt.id) })))
})

// POST /api/options
router.post('/', verifyToken, (req, res) => {
  const { product_id, name_ar, name_en, type = 'single', required = 0, values = [] } = req.body
  if (!product_id || !name_ar || !name_en) return res.status(400).json({ error: 'missing fields' })
  const db = getDb()
  const opt = db.prepare('INSERT INTO product_options (product_id, name_ar, name_en, type, required) VALUES (?,?,?,?,?)').run(product_id, name_ar, name_en, type, required ? 1 : 0)
  const optId = opt.lastInsertRowid
  const insertVal = db.prepare('INSERT INTO product_option_values (option_id, label_ar, label_en, price_add) VALUES (?,?,?,?)')
  values.forEach(v => insertVal.run(optId, v.label_ar, v.label_en, v.price_add || 0))
  res.status(201).json({ ...db.prepare('SELECT * FROM product_options WHERE id=?').get(optId), values: db.prepare('SELECT * FROM product_option_values WHERE option_id=?').all(optId) })
})

// PUT /api/options/:id
router.put('/:id', verifyToken, (req, res) => {
  const { name_ar, name_en, type, required } = req.body
  const db = getDb()
  db.prepare('UPDATE product_options SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), type=COALESCE(?,type), required=COALESCE(?,required) WHERE id=?').run(name_ar, name_en, type, required !== undefined ? (required ? 1 : 0) : null, req.params.id)
  res.json(db.prepare('SELECT * FROM product_options WHERE id=?').get(req.params.id))
})

// DELETE /api/options/:id
router.delete('/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM product_options WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// POST /api/options/values
router.post('/values', verifyToken, (req, res) => {
  const { option_id, label_ar, label_en, price_add = 0 } = req.body
  if (!option_id || !label_ar || !label_en) return res.status(400).json({ error: 'missing fields' })
  const db = getDb()
  const r = db.prepare('INSERT INTO product_option_values (option_id, label_ar, label_en, price_add) VALUES (?,?,?,?)').run(option_id, label_ar, label_en, price_add)
  res.status(201).json(db.prepare('SELECT * FROM product_option_values WHERE id=?').get(r.lastInsertRowid))
})

// DELETE /api/options/values/:id
router.delete('/values/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM product_option_values WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

export default router
