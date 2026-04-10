import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'sumu_super_secret_2025_key'

export function setupSocket(io) {
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      socket.user = { role: 'guest' }
      return next()
    }
    try {
      socket.user = jwt.verify(token, JWT_SECRET)
      next()
    } catch {
      socket.user = { role: 'guest' }
      next()
    }
  })

  io.on('connection', (socket) => {
    const { role, id, storeId, driverId } = socket.user || {}

    // Join role-based rooms
    if (role === 'admin') socket.join('admin')
    if (role === 'vendor' && storeId) socket.join(`store:${storeId}`)
    if (role === 'driver') {
      socket.join('drivers')
      socket.join(`driver:${id}`)
    }

    // Driver goes online/offline
    socket.on('driver:toggle_online', ({ is_online }) => {
      socket.to('admin').emit('driver:status_changed', { driverId: id, is_online })
    })

    // Order status updates — broadcast to relevant parties
    socket.on('order:status_update', ({ orderId, status, storeId: sid, driverId: did }) => {
      // Notify admin
      socket.to('admin').emit('order:updated', { orderId, status })
      // Notify store vendor
      if (sid) socket.to(`store:${sid}`).emit('order:updated', { orderId, status })
      // Notify driver
      if (did) socket.to(`driver:${did}`).emit('order:updated', { orderId, status })
    })

    // New order notification
    socket.on('order:new', ({ orderId, storeId: sid }) => {
      socket.to('admin').emit('order:new', { orderId, storeId: sid })
      if (sid) socket.to(`store:${sid}`).emit('order:new', { orderId })
      // Broadcast to all drivers for available pickup
      socket.to('drivers').emit('order:available', { orderId })
    })

    socket.on('disconnect', () => {})
  })
}
