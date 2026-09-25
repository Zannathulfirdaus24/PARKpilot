// Lightweight API client for the PARKpilot Spring Boot backend.
// Base URL comes from VITE_API_URL, falling back to the local backend on :8080.

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080/api/v1";

const TOKEN_KEY = "parkpilot_token";

export function getToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Standard envelope returned by the backend: { success, message, data, errorCode }
type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok || (body && body.success === false)) {
    const msg = body?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return (body ? body.data : (null as unknown)) as T;
}

// ---- Types (mirror backend DTOs) ----
export type ParkingLot = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  totalSlots: number;
  availableSlots: number;
  hours: string;
  status: "OPEN" | "FILLING_FAST" | "FULL" | "CLOSED";
  amenities: { cctv: boolean; covered: boolean; ev: boolean; security: boolean };
  latitude?: number;
  longitude?: number;
};

export type SlotDto = { id: string; code: string; status: string };

export type BookingDto = {
  id: string;
  reference: string;
  lotName: string;
  slotCode: string;
  startTime: string;
  endTime: string;
  hours: number;
  amount: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

export type DashboardSummary = {
  bookingsThisMonth: number;
  totalSpending: number;
  avgRatingGiven: number;
  activeReservation: BookingDto | null;
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleNo?: string;
  avatarUrl?: string;
  role: string;
};

export type AuthResponse = { accessToken: string; user: UserSummary };

export type AdminDashboard = {
  totalUsers: number;
  totalBookings: number;
  activeReservations: number;
  revenue: number;
  parkingLots: number;
  occupancyRate: number;
  revenueSeries: { name: string; revenue: number; bookings: number }[];
  occupancyByLot: { name: string; value: number }[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bookings: number;
  status: "ACTIVE" | "SUSPENDED";
  joined: string;
};

export type AdminTransaction = {
  reference: string;
  user: string;
  method: string;
  amount: number;
  status: string;
  date: string;
};

export type PaymentSummary = {
  revenueToday: number;
  refunds: number;
  transactions: AdminTransaction[];
};

// ---- API methods ----
export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    vehicleNo?: string;
  }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<UserSummary>("/users/me"),

  setAvatar: (avatarUrl: string) =>
    request<UserSummary>("/users/me/avatar", {
      method: "PUT",
      body: JSON.stringify({ avatarUrl }),
    }),

  deleteAvatar: () =>
    request<UserSummary>("/users/me/avatar", { method: "DELETE" }),

  listLots: (q?: string) =>
    request<ParkingLot[]>(`/parking-lots${q ? `?q=${encodeURIComponent(q)}` : ""}`),

  getLot: (id: string) => request<ParkingLot>(`/parking-lots/${id}`),

  getSlots: (id: string) => request<SlotDto[]>(`/parking-lots/${id}/slots`),

  myBookings: () => request<BookingDto[]>("/bookings/me"),

  createBooking: (payload: { lotId: string; slotId: string; hours: number; startTime?: string }) =>
    request<BookingDto>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  dashboardSummary: () => request<DashboardSummary>("/bookings/me/summary"),

  // ---- Admin ----
  adminDashboard: () => request<AdminDashboard>("/admin/dashboard"),
  adminBookings: () => request<BookingDto[]>("/admin/bookings"),
  adminUsers: () => request<AdminUser[]>("/admin/users"),
  adminSetUserStatus: (id: string, status: "ACTIVE" | "SUSPENDED") =>
    request<AdminUser>(`/admin/users/${id}/status?status=${status}`, { method: "PATCH" }),
  adminPayments: () => request<PaymentSummary>("/admin/payments"),

  createLot: (payload: Record<string, unknown>) =>
    request<ParkingLot>("/parking-lots", { method: "POST", body: JSON.stringify(payload) }),
  deleteLot: (id: string) =>
    request<void>(`/parking-lots/${id}`, { method: "DELETE" }),
  setSlotStatus: (id: string, status: string) =>
    request<SlotDto>(`/slots/${id}/status?status=${status}`, { method: "PATCH" }),
};

export const CURRENCY = "₹";
