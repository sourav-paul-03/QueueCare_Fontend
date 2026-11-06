import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OtpRequestPage from './pages/auth/OtpRequestPage'
import OtpVerifyPage from './pages/auth/OtpVerifyPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/appointments/BookAppointment'
import MyAppointments from './pages/appointments/MyAppointments'
import DoctorSearch from './pages/search/DoctorSearch'
import StaffDashboard from './pages/staff/StaffDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ClinicManagement from './pages/admin/ClinicManagement'
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ReviewsPage from './pages/reviews/ReviewsPage'
import ProfilePage from './pages/profile/ProfilePage'
import QueueLiveView from './pages/queue/QueueLiveView'
import { Toast } from './components/ui/Toast'

const PublicRoute = ({ element }: { element: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return element
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toast />
        <Routes>
          <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
          <Route path="/otp/request" element={<PublicRoute element={<OtpRequestPage />} />} />
          <Route path="/otp/verify" element={<PublicRoute element={<OtpVerifyPage />} />} />
          
          {!isAuthenticated ? (
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : (
            <>
              <Route path="/" element={<Layout />}>
                <Routes>
                  <Route path="dashboard" element={<PatientDashboard />} />
                  <Route path="appointments/book" element={<BookAppointment />} />
                  <Route path="appointments/my" element={<MyAppointments />} />
                  <Route path="search" element={<DoctorSearch />} />
                  <Route path="queue/live" element={<QueueLiveView />} />
                  <Route path="staff/dashboard" element={<StaffDashboard />} />
                  <Route path="doctor/dashboard" element={<DoctorDashboard />} />
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  <Route path="admin/clinics" element={<ClinicManagement />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="unauthorized" element={<div className="p-10 text-center"><h2 className="text-xl font-semibold">Unauthorized</h2><p>You do not have access to this page.</p></div>} />
                  <Route index element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App