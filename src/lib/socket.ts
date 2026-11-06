import { io, type Socket } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(WS_URL, {
      namespace: '/queue',
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export const connectSocket = (): Socket => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const joinQueueRoom = (socket: Socket, doctorClinicId: number, date?: string, mode: 'DISPLAY' | 'STAFF' | 'PATIENT' = 'PATIENT') => {
  const d = date || new Date().toISOString().slice(0, 10)
  socket.emit('joinQueue', { doctorClinicId, date: d, mode })
}

export const leaveQueueRoom = (socket: Socket, doctorClinicId: number, date?: string) => {
  const d = date || new Date().toISOString().slice(0, 10)
  socket.emit('leaveQueue', { doctorClinicId, date: d })
}

export default { getSocket, connectSocket, disconnectSocket, joinQueueRoom, leaveQueueRoom }