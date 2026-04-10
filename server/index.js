import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getDb, seedDatabase } from './db.js'
import { setupSocket } from './socket/index.js'

import authRoutes from './routes/auth.js'
import storeRoutes from './routes/stores.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import userRoutes from './routes/users.js'
import driverRoutes from './routes/drivers.js'
import notifRoutes from './routes/notifications.js'
import uploadRoutes from './routes/uploads.js'
import statsRoutes from './routes/stats.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] },
})

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static uploads
app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')))

// ── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/notifications', notifRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/stats', statsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// ── Socket.io ────────────────────────────────────────────────────────
setupSocket(io)

// Attach io to app for use in routes
app.set('io', io)

// ── Start ─────────────────────────────────────────────────────────────
getDb()
seedDatabase()

httpServer.listen(PORT, () => {
  console.log(`🚀 SUMU API Server running on http://localhost:${PORT}`)
  console.log(`📡 Socket.io ready`)
  console.log(`🗄️  SQLite database: sumu.db`)
})
