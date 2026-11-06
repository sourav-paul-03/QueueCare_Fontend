import { useState } from 'react'
import { Mail, AlertTriangle } from 'lucide-react'
import { authApi } from '../../lib/api'

export default function OtpRequestPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.requestOtp({ identifier })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 1 1.54 2.71H19a2 2 0 0 1 2 1.72 19.79 19.79 0 0 1-8.63 3.07 19.5 19.5 0 0 1-6 6 19.79 19.79 0 0 1-3.07 8.67A2 2 0 0 1 4.11 22h3a2 2 0 0 1 2-1.72 12.84 12.84 0 0 1 1.54-2.71H19a2 2 0 0 1 2-1.72"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{sent ? 'Code sent!' : 'OTP Login'}</h2>
          <p className="text-gray-600">
            {sent
              ? 'A verification code has been sent to your email or phone.'
              : 'Enter your email or phone to receive a verification code.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="you@email.com or +8801xxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP Code'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Didn't receive the code?</p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend code
            </button>
            <p className="text-sm text-gray-500 mt-4">Or sign in with password</p>
          </div>
        )}
      </div>
    </div>
  )
}