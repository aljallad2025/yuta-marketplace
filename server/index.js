import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { getDb, seedDatabase } from './db.js'
import { setupSocket } from './socket/index.js'

import authRoutes    from './routes/auth.js'
import catalogRouter from './routes/catalog.js'
import categoriesRouter from './routes/categories.js'
import storeRoutes   from './routes/stores.js'
import productRoutes from './routes/products.js'
import orderRoutes   from './routes/orders.js'
import userRoutes    from './routes/users.js'
import driverRoutes  from './routes/drivers.js'
import notifRoutes   from './routes/notifications.js'
import uploadRoutes  from './routes/uploads.js'
import statsRoutes   from './routes/stats.js'
import taxiRoutes    from './routes/taxi.js'
import optionRoutes  from './routes/options.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT       = process.env.PORT || 4000
const IS_PROD    = process.env.NODE_ENV === 'production'
const DIST_DIR   = join(__dirname, '..', 'dist')

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:4000']

const corsOptions = {
  origin: IS_PROD ? allowedOrigins : '*',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}

const app        = express()
const httpServer = createServer(app)
const io         = new Server(httpServer, {
  cors: { origin: IS_PROD ? allowedOrigins : '*', methods: ['GET','POST'] },
})

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)

app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')))

if (IS_PROD && existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
}

app.use('/api/auth',          authRoutes)
app.use('/api/catalog', catalogRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/stores',        storeRoutes)
app.use('/api/products',      productRoutes)
app.use('/api/orders',        orderRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/drivers',       driverRoutes)
app.use('/api/notifications', notifRoutes)
app.use('/api/options',        optionRoutes)
app.use('/api/uploads',       uploadRoutes)
app.use('/api/stats',         statsRoutes)
app.use('/api/taxi',          taxiRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString(), version: '2.0.0' })
})

if (IS_PROD && existsSync(DIST_DIR)) {
  app.get('/{*path}', (req, res) => res.sendFile(join(DIST_DIR, 'index.html')))
}

setupSocket(io)
app.set('io', io)

getDb()
seedDatabase()

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀  SUMU Server → http://localhost:${PORT}`)
  console.log(`  📡  Socket.io   → ready`)
  console.log(`  🗄️   Database    → ${process.env.DB_PATH || 'sumu.db'}`)
  console.log(`  🌍  Mode        → ${IS_PROD ? 'PRODUCTION' : 'development'}\n`)
})
