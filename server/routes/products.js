import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/products?store_id=X
router.get('/', (req, res) => {
  const db = getDb()
  const { store_id } = req.query
  let products
  if (store_id) {
    products = db.prepare('SELECT * FROM products WHERE store_id=? ORDER BY id').all(store_id)
  } else {
    products = db.prepare('SELECT * FROM products ORDER BY store_id, id').all()
  }
  res.json(products)
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const db = getDb()
  const p = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)
  if (!p) return res.status(404).json({ error: 'not_found' })
  res.json(p)
})

// POST /api/products — vendor or admin
router.post('/', verifyToken, (req, res) => {
  const { role, storeId } = req.user
  const { store_id, name_ar, name_en, emoji, price, stock, category, description } = req.body
  if (!name_ar || !price) return res.status(400).json({ error: 'missing_fields' })

  const targetStoreId = store_id || storeId
  if (role !== 'admin' && (role !== 'vendor' || storeId !== targetStoreId)) {
    return res.status(403).json({ error: 'forbidden' })
  }

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO products (store_id, name_ar, name_en, emoji, price, stock, category, description, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(targetStoreId, name_ar, name_en||name_ar, emoji||'🍽️', price, stock||0, category||'', description||'')

  const product = db.prepare('SELECT * FROM products WHERE id=?').get(result.lastInsertRowid)
  res.status(201).json(product)
})

// PUT /api/products/:id
router.put('/:id', verifyToken, (req, res) => {
  const { role, storeId } = req.user
  const db = getDb()
  const existing = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'not_found' })
  if (role !== 'admin' && (role !== 'vendor' || storeId !== existing.store_id)) {
    return res.status(403).json({ error: 'forbidden' })
  }

  const { name_ar, name_en, emoji, price, stock, category, description, is_active } = req.body
  db.prepare(`
    UPDATE products SET
      name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en),
      emoji=COALESCE(?,emoji), price=COALESCE(?,price),
      stock=COALESCE(?,stock), category=COALESCE(?,category),
      description=COALESCE(?,description), is_active=COALESCE(?,is_active)
    WHERE id=?
  `).run(name_ar,name_en,emoji,price,stock,category,description,is_active,req.params.id)

  const updated = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)
  res.json(updated)
})

// DELETE /api/products/:id
router.delete('/:id', verifyToken, (req, res) => {
  const { role, storeId } = req.user
  const db = getDb()
  const existing = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'not_found' })
  if (role !== 'admin' && (role !== 'vendor' || storeId !== existing.store_id)) {
    return res.status(403).json({ error: 'forbidden' })
  }
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

export default router
