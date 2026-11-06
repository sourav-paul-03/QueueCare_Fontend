import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('queuecare_access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to unwrap success envelope and handle 401 refresh
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && response.data.success === true && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('queuecare_refresh_token')
      
      try {
        const response = await api.post<any>('/auth/refresh', {
          refreshToken,
        })
        const data = response.data
        const accessToken = data.tokens?.accessToken || data.accessToken
        const newRefreshToken = data.tokens?.refreshToken || data.refreshToken
        
        localStorage.setItem('queuecare_access_token', accessToken)
        localStorage.setItem('queuecare_refresh_token', newRefreshToken)
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('queuecare_access_token')
        localStorage.removeItem('queuecare_refresh_token')
        localStorage.removeItem('queuecare_user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  },
)

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('queuecare_access_token', accessToken)
  localStorage.setItem('queuecare_refresh_token', refreshToken)
}

export const clearAuthTokens = () => {
  localStorage.removeItem('queuecare_access_token')
  localStorage.removeItem('queuecare_refresh_token')
  localStorage.removeItem('queuecare_user')
}

export const getStoredUser = (): any => {
  const userStr = localStorage.getItem('queuecare_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const setStoredUser = (user: any) => {
  localStorage.setItem('queuecare_user', JSON.stringify(user))
}

// Auth API
export const authApi = {
  register: (data: { fullName: string; email?: string; phone?: string; password?: string; role?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { identifier: string; password: string }) =>
    api.post('/auth/login', data),
  
  requestOtp: (data: { identifier: string }) =>
    api.post('/auth/otp/request', data),
  
  verifyOtp: (data: { identifier: string; code: string }) =>
    api.post('/auth/otp/verify', data),
  
  refresh: (data: { refreshToken: string }) =>
    api.post('/auth/refresh', data),
  
  me: () => api.get('/auth/me'),
}

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getSpecialties: () => api.get('/users/specialties'),
  createSpecialty: (data: { name: string; description?: string }) =>
    api.post('/users/specialties', data),
  getAllDoctors: () => api.get('/users/doctors'),
  getDoctorById: (id: number) => api.get(`/users/doctors/${id}`),
  createDoctorProfile: (data: any) => api.post('/users/doctors', data),
  getPatientProfile: () => api.get('/users/patient/profile'),
  updatePatientProfile: (data: any) =>
    api.put('/users/patient/profile', data),
  getUserById: (id: number) => api.get(`/users/${id}`),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
}

// Clinics API
export const clinicsApi = {
  getAll: (city?: string) => api.get('/clinics', { params: { city } }),
  getById: (id: number) => api.get(`/clinics/${id}`),
  create: (data: any) => api.post('/clinics', data),
  update: (id: number, data: any) => api.put(`/clinics/${id}`, data),
  getMemberships: (clinicId: number) => api.get(`/clinics/${clinicId}/memberships`),
  addMembership: (data: any) => api.post('/clinics/memberships', data),
  linkDoctorClinic: (data: any) => api.post('/clinics/doctor-clinics', data),
  getDoctorClinics: (clinicId?: number, doctorId?: number) =>
    api.get('/clinics/doctor-clinics/list', { params: { clinicId, doctorId } }),
  getHolidays: (clinicId: number) => api.get(`/clinics/${clinicId}/holidays`),
  addHoliday: (data: any) => api.post('/clinics/holidays', data),
}

// Schedules API
export const schedulesApi = {
  getSlots: (doctorClinicId: number, date: string) =>
    api.get('/schedules/slots', { params: { doctorClinicId, date } }),
  getDoctorClinicSchedules: (doctorClinicId: number) =>
    api.get(`/schedules/${doctorClinicId}`),
  createSchedule: (data: any) => api.post('/schedules', data),
  getExceptions: (doctorClinicId: number) =>
    api.get(`/schedules/${doctorClinicId}/exceptions`),
  createException: (data: any) => api.post('/schedules/exceptions', data),
}

// Appointments API
export const appointmentsApi = {
  book: (data: { doctorClinicId: number; patientId?: number; startAt: string; endAt?: string; idempotencyKey?: string; notes?: string }) =>
    api.post('/appointments/book', data),
  cancel: (id: number, data?: { reason?: string }) =>
    api.post(`/appointments/${id}/cancel`, data),
  reschedule: (id: number, data: { newStartAt: string; newEndAt?: string; reason?: string }) =>
    api.post(`/appointments/${id}/reschedule`, data),
  getMyAppointments: () => api.get('/appointments/my'),
  getDoctorClinicAppointments: (doctorClinicId: number, date?: string) =>
    api.get(`/appointments/doctor-clinic/${doctorClinicId}`, { params: { date } }),
  getAppointmentHistory: (id: number) => api.get(`/appointments/${id}/history`),
}

// Queue API
export const queueApi = {
  getSessionState: (doctorClinicId: number, date?: string) =>
    api.get(`/queue/state/${doctorClinicId}`, { params: { date } }),
  checkIn: (data: { tokenId: number }) => api.post('/queue/check-in', data),
  walkIn: (data: { doctorClinicId: number; patientId?: number; patientName?: string; patientPhone?: string; priority?: number }) =>
    api.post('/queue/walk-in', data),
  callNext: (data: { doctorClinicId: number; date: string; expectedVersion: number }) =>
    api.post('/queue/call-next', data),
  startConsultation: (data: { tokenId: number; reason?: string }) =>
    api.post('/queue/start', data),
  completeConsultation: (data: { tokenId: number; reason?: string }) =>
    api.post('/queue/complete', data),
  skipToken: (data: { tokenId: number; reason?: string }) =>
    api.post('/queue/skip', data),
  reinstateToken: (data: { tokenId: number; reason?: string }) =>
    api.post('/queue/reinstate', data),
  noShowToken: (data: { tokenId: number; reason?: string }) =>
    api.post('/queue/no-show', data),
  recallToken: (data: { tokenId: number }) => api.post('/queue/recall', data),
  updateSessionStatus: (data: { doctorClinicId: number; date: string; status: string }) =>
    api.post('/queue/session-status', data),
  getTokenEvents: (tokenId: number) => api.get(`/queue/token/${tokenId}/events`),
}

// Search API
export const searchApi = {
  searchDoctors: (params?: { query?: string; specialtyId?: number; city?: string; minFee?: number; maxFee?: number; latitude?: number; longitude?: number; radiusKm?: number }) =>
    api.get('/search/doctors', { params }),
}

// Notifications API
export const notificationsApi = {
  getMyNotifications: () => api.get('/notifications/my'),
  registerDeviceToken: (data: { deviceToken: string; platform: string }) =>
    api.post('/notifications/device-token', data),
  markAsRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  sendNotification: (data: any) => api.post('/notifications/send', data),
}

// Reviews API
export const reviewsApi = {
  submitReview: (data: { appointmentId: number; rating: number; comment?: string }) =>
    api.post('/reviews', data),
  getDoctorReviews: (doctorId: number) => api.get(`/reviews/doctor/${doctorId}`),
}

// Analytics API
export const analyticsApi = {
  getDoctorClinicDailyStats: (doctorClinicId: number, days?: number) =>
    api.get(`/analytics/doctor-clinic/${doctorClinicId}`, { params: { days } }),
  runAggregation: (doctorClinicId: number, date?: string) =>
    api.post(`/analytics/aggregate/${doctorClinicId}`, {}, { params: { date } }),
  getClinicDashboard: (clinicId: number) => api.get(`/analytics/clinic/${clinicId}`),
}

// Wait Time API
export const waitTimeApi = {
  getEstimatedWaitTime: (tokenId: number) => api.get(`/wait-time/token/${tokenId}`),
}
