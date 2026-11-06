import { useState } from 'react'
import { reviewsApi } from '../../lib/api'

export default function ReviewsPage() {
  const [appointmentId, setAppointmentId] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [reviews] = useState<any[]>([])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await reviewsApi.submitReview({ appointmentId: parseInt(appointmentId), rating, comment })
      setSuccess('Review submitted successfully!')
      setAppointmentId('')
      setComment('')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit a Review</h1>
        <p className="text-gray-600">Rate your recent appointment</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={submitReview} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Appointment ID</label>
            <input type="number" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="flex flex-row-reverse gap-1">
              {[5,4,3,2,1].map(star => (
                <label key={star} className="cursor-pointer text-yellow-400 hover:text-yellow-500">
                  <input type="radio" name="rating" value={star} checked={rating === star} onChange={() => setRating(star)} className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-auto">{loading ? 'Submitting...' : 'Submit Review'}</button>
        </form>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Doctor Reviews</h3>
        <div className="space-y-4">
          {reviews.length === 0 ? <p className="text-gray-500 text-center py-8">No reviews yet.</p> : (
            reviews.map(r => (
              <div key={r.id} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Appointment #{r.appointmentId}</span>
                  <span className="text-sm font-bold text-yellow-600">{'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}