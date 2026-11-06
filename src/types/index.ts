export type UserRole = 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT'

export interface User {
  id: number
  email: string
  phone?: string
  fullName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Patient {
  id: number
  userId: number
  dob?: string
  gender?: string
  bloodGroup?: string
  emergencyContact?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  id: number
  userId: number
  licenseNumber: string
  bio?: string
  experienceYears?: number
  consultationFee: number
  createdAt: string
  updatedAt: string
}

export interface Specialty {
  id: number
  name: string
  description?: string
  createdAt: string
}

export interface Clinic {
  id: number
  name: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  timezone: string
  phone?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DoctorClinic {
  id: number
  doctorId: number
  clinicId: number
  consultationFee: number
  tokenPrefix: string
  roomNumber?: string
  isActive: boolean
  createdAt: string
  doctor?: Doctor
  clinic?: Clinic
}

export interface Schedule {
  id: number
  doctorClinicId: number
  dayOfWeek: number
  startTime: string
  endTime: string
  slotDuration: number
  maxPatients: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Slot {
  startAt: string
  endAt: string
  available: boolean
}

export interface Appointment {
  id: number
  doctorClinicId: number
  patientId: number
  bookedByUserId?: number
  startAt: string
  endAt?: string
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  idempotencyKey?: string
  notes?: string
  createdAt: string
  updatedAt: string
  patient?: Patient
  doctorClinic?: DoctorClinic
}

export interface QueueSession {
  id: number
  doctorClinicId: number
  queueDate: string
  status: 'OPEN' | 'PAUSED' | 'CLOSED'
  lastTokenNumber: number
  version: number
  createdAt: string
  updatedAt: string
}

export interface QueueToken {
  id: number
  queueSessionId: number
  appointmentId?: number
  tokenNumber: number
  tokenPrefix: string
  status: 'BOOKED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'SKIPPED' | 'REINSTATED'
  priority: number
  effectiveTime: string
  checkedInAt?: string
  calledAt?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  appointment?: Appointment
}

export interface QueueState {
  session: QueueSession
  currentToken: QueueToken | null
  waitingTokens: QueueToken[]
  calledToken: QueueToken | null
  waitingCount: number
  totalTokens: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface Notification {
  id: number
  userId: number
  title: string
  body: string
  type: string
  channel: string
  isRead: boolean
  dedupeKey?: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface Review {
  id: number
  appointmentId: number
  rating: number
  comment?: string
  createdAt: string
}

export interface DailyDoctorStat {
  id: number
  doctorClinicId: number
  statDate: string
  totalTokens: number
  completedCount: number
  cancelledCount: number
  noShowCount: number
  avgWaitMinutes: number
  avgConsultMinutes: number
  createdAt: string
}

export interface WaitTimeEstimate {
  tokenId: number
  estimatedWaitMinutes: number
  positionInQueue: number
  method: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}