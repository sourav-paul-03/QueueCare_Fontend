import { useEffect, useState } from 'react'
import { queueApi } from '../../lib/api'

export default function QueueLiveView() {
  const [queueState, setQueueState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const doctorClinicId = 1
  const date = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadQueue()
    const interval = setInterval(loadQueue, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadQueue = async () => {
    try {
      const res = await queueApi.getSessionState(doctorClinicId, date)
      setQueueState(res.data)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  const tokenDisplay = (token: any) => `${token.tokenPrefix}-${token.tokenNumber}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
        <p className="text-gray-600">Real-time queue status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Session</p>
          <p className="text-2xl font-bold">{queueState?.session?.status || '—'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Now Serving</p>
          <p className="text-3xl font-bold text-blue-600">{queueState?.currentToken ? tokenDisplay(queueState.currentToken) : '—'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Waiting</p>
          <p className="text-2xl font-bold">{queueState?.waitingCount || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Waiting Tokens</h3>
        </div>
        <div className="p-6">
          {queueState?.waitingTokens?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No patients waiting.</p>
          ) : (
            <div className="space-y-2">
              {queueState.waitingTokens.map((token: any) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-xl font-mono font-bold text-blue-600">{tokenDisplay(token)}</span>
                  <span className="text-sm text-gray-600">Priority: {token.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}