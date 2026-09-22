export const parkingLots = [
  {
    id: "p1",
    name: "Downtown Central Parking",
    address: "123 Market St, San Francisco",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80",
    distance: "0.4 km",
    price: 60,
    rating: 4.8,
    reviews: 342,
    available: 24,
    total: 80,
    hours: "24/7",
    status: "Open",
    amenities: { cctv: true, covered: true, ev: true, security: true },
    lat: 37.7749, lng: -122.4194,
  },
  {
    id: "p2",
    name: "Skyline Tower Garage",
    address: "88 Mission St, San Francisco",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&q=80",
    distance: "1.1 km",
    price: 45,
    rating: 4.5,
    reviews: 210,
    available: 8,
    total: 60,
    hours: "06:00 – 23:00",
    status: "Filling Fast",
    amenities: { cctv: true, covered: true, ev: false, security: true },
    lat: 37.7899, lng: -122.3969,
  },
  {
    id: "p3",
    name: "Harbor View Parking",
    address: "45 Embarcadero, San Francisco",
    image: "https://images.unsplash.com/photo-1613618948931-3d76a10d4d1b?w=1200&q=80",
    distance: "2.3 km",
    price: 80,
    rating: 4.9,
    reviews: 512,
    available: 42,
    total: 120,
    hours: "24/7",
    status: "Open",
    amenities: { cctv: true, covered: false, ev: true, security: true },
    lat: 37.7955, lng: -122.3937,
  },
  {
    id: "p4",
    name: "Union Square Lot",
    address: "333 Post St, San Francisco",
    image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?w=1200&q=80",
    distance: "1.8 km",
    price: 70,
    rating: 4.6,
    reviews: 189,
    available: 0,
    total: 50,
    hours: "24/7",
    status: "Full",
    amenities: { cctv: true, covered: true, ev: false, security: false },
    lat: 37.7879, lng: -122.4075,
  },
];

export const bookings = [
  { id: "BK-10241", lot: "Downtown Central Parking", slot: "A-12", date: "2026-07-24", time: "10:00 – 12:00", amount: 120, status: "Completed" },
  { id: "BK-10230", lot: "Skyline Tower Garage", slot: "B-04", date: "2026-07-20", time: "14:30 – 16:00", amount: 68, status: "Completed" },
  { id: "BK-10218", lot: "Harbor View Parking", slot: "C-21", date: "2026-07-18", time: "09:00 – 11:00", amount: 160, status: "Cancelled" },
  { id: "BK-10203", lot: "Union Square Lot", slot: "D-07", date: "2026-07-12", time: "18:00 – 21:00", amount: 210, status: "Completed" },
];

export const activeReservation = {
  id: "BK-10250",
  lot: "Downtown Central Parking",
  slot: "A-14",
  date: "2026-07-26",
  time: "15:00 – 17:00",
  remaining: "01h 24m",
  amount: 120,
};

export const users = [
  { id: "U-001", name: "Ava Rodriguez", email: "ava@example.com", phone: "+1 415 555 0134", bookings: 42, status: "Active", joined: "2025-11-04" },
  { id: "U-002", name: "Ethan Park", email: "ethan@example.com", phone: "+1 415 555 0198", bookings: 18, status: "Active", joined: "2026-01-20" },
  { id: "U-003", name: "Priya Shah", email: "priya@example.com", phone: "+1 415 555 0117", bookings: 7, status: "Suspended", joined: "2026-03-11" },
  { id: "U-004", name: "Liam Chen", email: "liam@example.com", phone: "+1 415 555 0141", bookings: 63, status: "Active", joined: "2025-08-01" },
];

export const revenueSeries = [
  { name: "Mon", revenue: 2400, bookings: 42 },
  { name: "Tue", revenue: 1980, bookings: 38 },
  { name: "Wed", revenue: 3100, bookings: 55 },
  { name: "Thu", revenue: 2780, bookings: 48 },
  { name: "Fri", revenue: 4200, bookings: 71 },
  { name: "Sat", revenue: 5100, bookings: 84 },
  { name: "Sun", revenue: 4600, bookings: 76 },
];

export const occupancySeries = [
  { name: "Downtown", value: 78 },
  { name: "Skyline", value: 92 },
  { name: "Harbor", value: 54 },
  { name: "Union", value: 100 },
];

export const transactions = [
  { id: "TX-5501", user: "Ava Rodriguez", amount: 120, method: "UPI", status: "Success", date: "2026-07-24" },
  { id: "TX-5498", user: "Ethan Park", amount: 68, method: "Credit Card", status: "Success", date: "2026-07-24" },
  { id: "TX-5495", user: "Priya Shah", amount: 160, method: "Wallet", status: "Refunded", date: "2026-07-23" },
  { id: "TX-5490", user: "Liam Chen", amount: 210, method: "Debit Card", status: "Success", date: "2026-07-22" },
];

export function generateSlots(): { id: string; status: "available" | "occupied" | "reserved" }[] {
  const rows = ["A", "B", "C", "D", "E"];
  const out: { id: string; status: "available" | "occupied" | "reserved" }[] = [];
  rows.forEach((r) => {
    for (let i = 1; i <= 10; i++) {
      const rand = Math.random();
      const status = rand < 0.55 ? "available" : rand < 0.85 ? "occupied" : "reserved";
      out.push({ id: `${r}-${String(i).padStart(2, "0")}`, status });
    }
  });
  return out;
}
