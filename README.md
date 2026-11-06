# QueueCare Frontend

QueueCare Frontend - A modern React + TypeScript web application for healthcare queue management and appointment booking.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for client-side routing
- **Axios** for HTTP API client
- **Socket.IO Client** for real-time WebSocket updates
- **Lucide React** for icons
- **React Hook Form** + **Zod** for form validation

## Backend API

The frontend connects to the QueueCare Backend API running on `http://localhost:4000/api/v1`.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@queuecare.com | QueueCare123! |
| Clinic Admin | clinicadmin@queuecare.com | QueueCare123! |
| Doctor | doctor@queuecare.com | QueueCare123! |
| Patient | patient@queuecare.com | QueueCare123! |

## Features

### Authentication
- Email/password login
- OTP-based login (request and verify)
- User registration
- JWT token refresh
- Protected routes with role-based access

### Patient Features
- Search doctors by specialty, city, and fees
- Book appointments with real-time slot availability
- View my appointments history
- Live queue tracking with WebSocket updates
- Submit reviews for completed appointments

### Staff/Receptionist Features
- View live queue state
- Call next patient (optimistic locking)
- Check-in patients
- Walk-in patient registration

### Doctor Features
- View current consultation queue
- Start/Complete consultation
- Skip patients
- Call next patient

### Admin Features
- Clinic management
- Analytics dashboard with charts
- Daily statistics and wait time trends

### Real-Time Updates
- Socket.IO WebSocket connection to `/queue` namespace
- Join queue rooms for real-time state updates
- Live token display and waiting queue

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_WS_URL=http://localhost:4000
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Layout.tsx  # Main layout with sidebar navigation
│   └── ui/         # Base UI components (Toast)
├── contexts/       # React context providers
│   └── AuthContext.tsx
├── hooks/          # Custom React hooks
│   └── useQueue.ts # WebSocket-enabled queue hook
├── lib/            # API client and utilities
│   ├── api.ts      # Axios instance with all API endpoints
│   └── socket.ts   # Socket.IO connection management
├── pages/          # Page components
│   ├── auth/       # Authentication pages
│   ├── patient/    # Patient-facing pages
│   ├── staff/      # Staff dashboard
│   ├── doctor/     # Doctor dashboard
│   ├── admin/      # Admin pages
│   ├── analytics/  # Analytics dashboard
│   ├── notifications/  # Notifications page
│   ├── reviews/    # Reviews page
│   ├── profile/    # User profile
│   └── queue/      # Live queue view
├── types/          # TypeScript type definitions
└── App.tsx         # App root with routing
```

## API Endpoints

The frontend integrates with the following backend API modules:

- **Auth**: `/api/v1/auth/*` - Login, register, OTP, refresh
- **Users**: `/api/v1/users/*` - Profiles, specialties, doctors
- **Clinics**: `/api/v1/clinics/*` - Clinic management
- **Schedules**: `/api/v1/schedules/*` - Slots and schedules
- **Appointments**: `/api/v1/appointments/*` - Booking, cancel, reschedule
- **Queue**: `/api/v1/queue/*` - Queue state, check-in, call-next, actions
- **Search**: `/api/v1/search/doctors` - Doctor search
- **Notifications**: `/api/v1/notifications/*` - Notifications, device tokens
- **Reviews**: `/api/v1/reviews/*` - Submit and view reviews
- **Analytics**: `/api/v1/analytics/*` - Clinic statistics
- **Wait Time**: `/api/v1/wait-time/token/:id` - Estimated wait time

## License

UNLICENSED