/*
 * /clinic-app
 *   /frontend                        ← Next.js App Router project
 *     /app
 *       /auth
 *         /login/page.tsx
 *         /register/page.tsx
 *         /verify-otp/page.tsx
 *         /forgot-password/page.tsx
 *         /reset-password/page.tsx
 *       /(patient)
 *         /dashboard/page.tsx
 *         /find-doctors/page.tsx
 *         /doctors/[id]/page.tsx
 *         /book/[doctorId]/page.tsx
 *         /appointments/page.tsx
 *         /medical-records/page.tsx
 *         /profile/page.tsx
 *       /(doctor)
 *         /dashboard/page.tsx
 *         /appointments/page.tsx
 *         /patients/page.tsx
 *         /schedule/page.tsx
 *         /prescriptions/page.tsx
 *         /profile/page.tsx
 *       /(admin)
 *         /dashboard/page.tsx
 *         /doctors/page.tsx
 *         /patients/page.tsx
 *         /appointments/page.tsx
 *         /reports/page.tsx
 *         /settings/page.tsx
 *     /components
 *       /ui                          ← Shadcn components
 *       /shared                      ← Navbar, Sidebar, Footer
 *       /patient                     ← Patient specific components
 *       /doctor                      ← Doctor specific components
 *       /admin                       ← Admin specific components
 *     /lib
 *       /auth.ts                     ← Auth.js config
 *       /axios.ts                    ← Axios instance with base URL + interceptors
 *       /imagekit.ts                 ← ImageKit config
 *       /validations.ts              ← All Zod schemas
 *     /hooks                         ← Custom hooks per feature
 *     /types                         ← TypeScript interfaces for all entities
 *
 *   /backend                         ← Node.js + Express (not generated, just folder noted)
 *     /src
 *       /routes
 *       /controllers
 *       /middleware
 *       /models
 *     /prisma
 *       /schema.prisma
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  // Flattened user fields for convenience in list views
  name: string;
  email: string;
  avatar?: string;
  dateOfBirth: string;
  bloodGroup: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string;
  allergies: string[];
  chronicConditions?: string[];
  createdAt: string;
  user?: User;
}

export interface Doctor {
  id: string;
  userId: string;
  // Flattened user fields for convenience in list views
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  specialization: string;
  experience: number;
  fee: number;
  consultationFee?: number;
  bio: string;
  education: Education[];
  availableDays: string[];
  workingHours: { start: string; end: string };
  workingHoursStart?: string;
  workingHoursEnd?: string;
  maxAppointmentsPerDay: number;
  rating: number;
  totalReviews: number;
  totalAppointments?: number;
  status: "active" | "suspended" | "pending" | "rejected";
  clinicName?: string;
  clinicAddress?: string;
  user?: User;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  timeSlot?: string;
  appointmentDate?: string;
  type: "in-person" | "online" | "video";
  status: "booked" | "confirmed" | "in-progress" | "completed" | "cancelled" | "pending" | "upcoming";
  notes: string;
  symptoms?: string;
  attachmentUrl?: string;
  createdAt: string;
  patient?: Patient;
  doctor?: Doctor;
  fee?: number;
  patientName?: string;
  patientEmail?: string;
  doctorName?: string;
  specialization?: string;
  reviewId?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
  attachmentUrl?: string;
  createdAt: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient?: Patient;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "appointment" | "prescription" | "promotion" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface Schedule {
  availableDays: string[];
  workingHours: { start: string; end: string };
  maxAppointments: number;
  blockedDates: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  revenue: number;
  pendingApprovals?: number;
  activeUsers?: number;
  trends: {
    users: number;
    doctors: number;
    appointments: number;
    revenue: number;
  };
}

export interface DoctorStats {
  todayAppointments: number;
  totalPatients: number;
  pendingRequests: number;
  monthlyRevenue: number;
  upcomingAppointments?: number;
  completedAppointments?: number;
  pendingAppointments?: number;
  cancelledAppointments?: number;
  averageRating?: number;
}

export interface PatientStats {
  upcomingCount: number;
  totalVisits: number;
  prescriptionsCount: number;
  unreadMessages: number;
}

export interface AnalyticsData {
  date: string;
  value: number;
  label?: string;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  downloadUrl: string;
}

export interface BillingData {
  plan: string;
  usage: {
    users: { current: number; max: number };
    storage: { current: number; max: number };
    appointments: { current: number; max: number };
  };
  invoices: Invoice[];
}
