import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/stats — admin dashboard stats
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  const db = getDb()
  const today = new Date().toISOString().split('T')[0]

  const totalOrders = db.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt
  const todayOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE date(created_at)=?").get(today).cnt
  const completedOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status='completed'").get().cnt
  const pendingOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('pending','accepted','preparing')").get().cnt
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='completed'").get().s
  const totalCustomers = db.prepare('SELECT COUNT(*) as cnt FROM customers').get().cnt
  const activeDrivers = db.prepare('SELECT COUNT(*) as cnt FROM drivers WHERE is_online=1').get().cnt
  const totalDrivers = db.prepare('SELECT COUNT(*) as cnt FROM drivers').get().cnt
  const totalStores = db.prepare('SELECT COUNT(*) as cnt FROM stores').get().cnt
  const pendingApprovals = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE status='pending'").get().cnt

  // Last 7 days orders chart
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('ar', { weekday: 'short' })
    const cnt = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE date(created_at)=?").get(dateStr).cnt
    const rev = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE date(created_at)=? AND status='completed'").get(dateStr).s
    last7.push({ date: dateStr, day: dayName, orders: cnt, revenue: rev })
  }

  res.json({
    totalOrders, todayOrders, completedOrders, pendingOrders,
    totalRevenue, totalCustomers, activeDrivers, totalDrivers,
    totalStores, pendingApprovals, last7,
  })
})

// GET /api/stats/store/:id — vendor stats
router.get('/store/:id', verifyToken, (req, res) => {
  const { role, storeId } = req.user
  const id = parseInt(req.params.id)
  if (role !== 'admin' && (role !== 'vendor' || storeId !== id)) {
    return res.status(403).json({ error: 'forbidden' })
  }
  const db = getDb()
  const today = new Date().toISOString().split('T')[0]

  const totalOrders = db.prepare('SELECT COUNT(*) as cnt FROM orders WHERE store_id=?').get(id).cnt
  const todayOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE store_id=? AND date(created_at)=?").get(id, today).cnt
  const completedOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE store_id=? AND status='completed'").get(id).cnt
  const pendingOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE store_id=? AND status IN ('pending','accepted','preparing')").get(id).cnt
  const revenue = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE store_id=? AND status='completed'").get(id).s
  const products = db.prepare('SELECT COUNT(*) as cnt FROM products WHERE store_id=?').get(id).cnt

  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('ar', { weekday: 'short' })
    const cnt = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE store_id=? AND date(created_at)=?").get(id, dateStr).cnt
    const rev = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE store_id=? AND date(created_at)=? AND status='completed'").get(id, dateStr).s
    last7.push({ date: dateStr, day: dayName, orders: cnt, revenue: rev })
  }

  res.json({ totalOrders, todayOrders, completedOrders, pendingOrders, revenue, products, last7 })
})

export default router
