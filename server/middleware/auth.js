import jwt from 'jsonwebtoken'
import { getDb } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'sumu_super_secret_2025_key'

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}

export function signToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET || 'sumu_super_secret_2025_key'
  return jwt.sign(
    { id: user.id, role: user.role, username: user.username, storeId: user.store_id, driverId: user.driver_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
