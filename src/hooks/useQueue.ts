import { useState, useEffect, useCallback } from 'react'
import { queueApi } from '../lib/api'
import { getSocket, connectSocket, joinQueueRoom, leaveQueueRoom } from '../lib/socket'
import type { QueueState } from '../types'

export const useQueue = (doctorClinicId: number, date?: string, mode: 'DISPLAY' | 'STAFF' | 'PATIENT' = 'PATIENT') => {
  const [queueState, setQueueState] = useState<QueueState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true)
      const res = await queueApi.getSessionState(doctorClinicId, date)
      setQueueState(res.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load queue state')
    } finally {
      setLoading(false)
    }
  }, [doctorClinicId, date])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  useEffect(() => {
    const socket = getSocket()
    connectSocket()
    
    joinQueueRoom(socket, doctorClinicId, date, mode)

    socket.on('queueSnapshot', (state: any) => {
      setQueueState(state)
      setLoading(false)
    })

    socket.on('queueUpdated', (state: any) => {
      setQueueState(state)
    })

    socket.on('tokenCalled', (data: any) => {
      setQueueState(prev => prev ? { ...prev, currentToken: data.token } : prev)
    })

    return () => {
      leaveQueueRoom(socket, doctorClinicId, date)
      // Don't disconnect on unmount as other components may use it
    }
  }, [doctorClinicId, date, mode])

  const refetch = useCallback(() => {
    fetchQueue()
  }, [fetchQueue])

  return { queueState, loading, error, refetch }
}

export default useQueue