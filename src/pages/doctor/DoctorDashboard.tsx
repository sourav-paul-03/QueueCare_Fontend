import { useEffect, useState } from 'react'
import { queueApi } from '../../lib/api'

export default function DoctorDashboard() {
  const [queueState, setQueueState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const doctorClinicId = 1
  const date = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadQueue()
  }, [])

  const loadQueue = async () => {
    try {
      const res = await queueApi.getSessionState(doctorClinicId, date)
      setQueueState(res.data)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  const callNext = async () => {
    try {
      await queueApi.callNext({ doctorClinicId, date, expectedVersion: queueState?.session?.version || 0 })
      loadQueue()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to call next')
    }
  }

  const startConsult = async (tokenId: number) => {
    try {
      await queueApi.startConsultation({ tokenId })
      loadQueue()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start consultation')
    }
  }

  const completeConsult = async (tokenId: number) => {
    try {
      await queueApi.completeConsultation({ tokenId })
      loadQueue()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete consultation')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your consultation queue</p>
        </div>
        <button onClick={callNext} className="btn-primary">
          Call Next Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Current Patient</p>
          <p className="text-2xl font-bold">{queueState?.currentToken ? `${queueState.currentToken.tokenPrefix}-${queueState.currentToken.tokenNumber}` : '—'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Waiting</p>
          <p className="text-2xl font-bold">{queueState?.waitingCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Session Status</p>
          <p className="text-2xl font-bold">{queueState?.session?.status || '—'}</p>
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
                    <span className="text-sm text-gray-600">Position #{queueState.waitingTokens.findIndex((t: any) => t.id === token.id) + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startConsult(token.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">Start</button>
                    <button onClick={() => completeConsult(token.id)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Complete</button>
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
          <div className="mt-4 flex gap-3">
            <button onClick={() => completeConsult(queueState.currentToken.id)} className="btn-primary">Complete Consultation</button>
            <button onClick={() => queueApi.skipToken({ tokenId: queueState.currentToken.id }).then(loadQueue)} className="btn-secondary">Skip</button>
          </div>
        </div>
      )}
    </div>
  )
}