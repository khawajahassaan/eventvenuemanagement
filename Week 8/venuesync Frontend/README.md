# VenueSync Frontend — v2

React + TypeScript frontend for the Event & Venue Booking Management System.
Built from Figma Make export with full backend integration layer.

---

## What's included

### Pages (16 screens)
| Route | Page | Role |
|-------|------|------|
| `/` | Landing / Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/planner/dashboard` | Planner Dashboard | planner |
| `/planner/search` | Venue Search + Filters | planner |
| `/planner/venue/:id` | Venue Details + Calendar | planner |
| `/planner/booking/:id` | Booking Workflow | planner |
| `/planner/payment/:id` | Payment + Invoice PDF | planner |
| `/planner/guests/:id` | Guest List + QR | planner |
| `/planner/budget/:id` | Budget + Vendors + Resources | planner |
| `/planner/schedule/:id` | Event Schedule Timeline | planner |
| `/owner/dashboard` | Owner Dashboard + Charts | owner |
| `/owner/venues` | Manage Venues + Image Upload | owner |
| `/admin/dashboard` | Admin Analytics | admin |
| `/admin/disputes` | Dispute Resolution | admin |
| `/scanner` | QR Entry Scanner | any |

### New in v2 (all 5 gaps filled)

**1. Protected Routes** (`src/components/ProtectedRoute.tsx`)
- Unauthenticated users → redirected to `/login`
- Wrong role (e.g. owner visiting `/admin/`) → redirected to own dashboard
- Loading spinner while auth resolves from localStorage
- After login, redirected back to the originally requested URL

**2. PDF Invoice Download** (`src/utils/generateInvoicePDF.ts`)
- Fully styled A4 invoice rendered as HTML
- Uses browser print-to-PDF — no extra dependencies
- VenueSync branding, itemised table, payment status, balance due
- "Download" button in PaymentInvoice page is now wired

**3. Working Search Filters** (`src/pages/planner/VenueSearch.tsx`)
- Location (name or city, case-insensitive)
- Min/max price range
- Minimum guest capacity
- Amenity checkboxes (multi-select, must match ALL selected)
- "Apply Filters" button + "Clear all (N)" badge
- Empty state with clear button when no results
- Active amenity tags highlighted in results

**4. Stripe Payment Redirect** (`src/pages/planner/PaymentInvoice.tsx`)
- "Make Payment" button calls `POST /payments/checkout`
- Backend returns `{ checkoutUrl }` → browser redirects to Stripe hosted page
- On return, Stripe redirects to `/planner/payment/:id?status=success|cancel`
- Graceful error alert if gateway is unavailable

**5. Image Upload** (`src/components/ImageUpload.tsx`)
- Drag & drop or click to select
- Live previews with cover badge on first image
- Per-file validation: PNG/JPG/WebP only, max 10MB
- Remove individual images before submitting
- Wired into ManageVenues form: calls `POST /venues/:id/images` (multipart)
- Upload happens after venue is created (gets the venueId first)

---

## Connecting your backend

### Step 1 — Set the API URL
In `src/api/client.ts`:
```ts
export const BASE_URL = "http://localhost:3000/api";
```
Or in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### Step 2 — Auth endpoints
```
POST /auth/login     → { user: { id, name, email, role }, tokens: { accessToken, refreshToken } }
POST /auth/register  → { user, tokens }
POST /auth/logout    → 200 OK
GET  /auth/me        → { user }
```
The `role` field in the user object must be `"planner"`, `"owner"`, or `"admin"`.

### Step 3 — Stripe setup
```
POST /payments/checkout
  Body:   { bookingId: string, amount: number }
  Return: { checkoutUrl: string }   ← Stripe session URL
```
Configure your Stripe success/cancel URLs to return to:
- Success: `/planner/payment/:id?status=success`
- Cancel:  `/planner/payment/:id?status=cancel`

### Step 4 — Image upload endpoint
```
POST /venues/:id/images
  Content-Type: multipart/form-data
  Field name:   "images" (multiple files)
  Return: { images: string[] }   ← array of public URLs
```

### Step 5 — Replace mock data with hooks
Each page has a mock array at the top. Swap with the hook:
```tsx
// Before
const bookings = [{ id: "BK-2401", ... }];

// After
import { useBookings } from "../../hooks";
const { data: bookings, isLoading } = useBookings();
if (isLoading) return <Spinner />;
```

---

## Running locally
```bash
pnpm install
pnpm dev
```

**Stack:** React 18 · TypeScript · React Router v7 · Tailwind CSS v4 · shadcn/ui · Recharts · Vite
