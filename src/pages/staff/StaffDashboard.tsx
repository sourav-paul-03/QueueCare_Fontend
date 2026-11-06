import { useEffect, useState } from 'react'
import { queueApi } from '../../lib/api'

export default function StaffDashboard() {
  const [queueState, setQueueState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const doctorClinicId = 1
  const date = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadQueue()
  }, [])

  const loadQueue = async () => {
    try {
      setLoading(true)
      const res = await queueApi.getSessionState(doctorClinicId, date)
      setQueueState(res.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load queue')
    } finally { setLoading(false) }
  }

  const callNext = async () => {
    try {
      await queueApi.callNext({
        doctorClinicId,
        date,
        expectedVersion: queueState?.session?.version || 0,
      })
      loadQueue()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to call next patient')
    }
  }

  const checkIn = async (tokenId: number) => {
    try {
      await queueApi.checkIn({ tokenId })
      loadQueue()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-in failed')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Manage queue and patient check-ins</p>
        </div>
        <button onClick={callNext} className="btn-primary">
          Call Next Patient
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Session Status</p>
          <p className="text-2xl font-bold">{queueState?.session?.status || '—'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Waiting Patients</p>
          <p className="text-2xl font-bold">{queueState?.waitingCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Tokens</p>
          <p className="text-2xl font-bold">{queueState?.totalTokens || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Waiting Queue</h3>
        </div>
        <div className="p-6">
          {queueState?.waitingTokens?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No patients waiting.</p>
          ) : (
            <div className="space-y-3">
              {queueState.waitingTokens.map((token: any) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-mono font-bold text-blue-600">{token.tokenPrefix}-{token.tokenNumber}</span>
                    <span className="text-sm text-gray-600">#{token.tokenNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="badge bg-yellow-100 text-yellow-700">WAITING</span>
                    <button onClick={() => checkIn(token.id)} className="text-sm text-blue-600 hover:text-blue-700">Check-in</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {queueState?.currentToken && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900">Currently in Consultation</h3>
          <p className="text-lg font-bold">{queueState.currentToken.tokenPrefix}-{queueState.currentToken.tokenNumber}</p>
        </div>
      )}
    </div>
  )
}