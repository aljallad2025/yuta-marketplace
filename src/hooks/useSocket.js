import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

export function getSocket() {
  if (!socketInstance) {
    const token = localStorage.getItem('sumu_token')
    socketInstance = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
    socketInstance.on('connect', () => console.log('🔌 Socket connected'))
    socketInstance.on('disconnect', () => console.log('🔌 Socket disconnected'))
    socketInstance.on('connect_error', (err) => console.warn('Socket error:', err.message))
  }
  return socketInstance
}

export function resetSocket() {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}

export function useSocket(events = {}) {
  const socket = useRef(null)

  useEffect(() => {
    socket.current = getSocket()
    const entries = Object.entries(events)
    entries.forEach(([event, handler]) => socket.current.on(event, handler))
    return () => {
      entries.forEach(([event, handler]) => socket.current.off(event, handler))
    }
  }, [])

  const emit = useCallback((event, data) => {
    if (socket.current) socket.current.emit(event, data)
  }, [])

  return { emit }
}
