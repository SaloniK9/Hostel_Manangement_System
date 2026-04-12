# Implementation Plan — Hostel Management System

This phased implementation plan is designed for the current Next.js App Router project structure and MySQL-backed backend.

## Phase 1: Database Setup

### 1. Choose ORM and initialize database support

- Recommended: Prisma ORM. It provides typed models, migrations, and a strong developer experience.
- Alternative: `mysql2` for raw SQL queries if you need minimal dependencies.

### 2. Create MySQL schema and migration flow

- Install Prisma dependencies:
  - `pnpm add -D prisma`
  - `pnpm add @prisma/client`
- Initialize Prisma:
  - `npx prisma init`
- Add `.env` values:
  - `DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"`

### 3. Define core schema in `prisma/schema.prisma`

Example model structure:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  STUDENT
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      UserRole
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  student   Student?
}

model Student {
  id             String          @id @default(uuid())
  user           User            @relation(fields: [userId], references: [id])
  userId         String          @unique
  studentNumber  String          @unique
  name           String
  phone          String
  department     String
  year           Int
  hostel         Hostel?         @relation(fields: [hostelId], references: [id])
  hostelId       String?
  room           Room?           @relation(fields: [roomId], references: [id])
  roomId         String?
  admissionDate  DateTime        @default(now())
  status         String          @default("ACTIVE")
  allocations    RoomAllocation[]
  payments       Payment[]
  attendances    Attendance[]
  leaveRequests  LeaveRequest[]
  complaints     Complaint[]
}

model Hostel {
  id         String          @id @default(uuid())
  name       String          @unique
  location   String
  capacity   Int
  wardenName String
  contact    String
  rooms      Room[]
  students   Student[]
}

model Room {
  id         String          @id @default(uuid())
  hostel     Hostel          @relation(fields: [hostelId], references: [id])
  hostelId   String
  number     String
  type       String
  capacity   Int
  occupants  Int             @default(0)
  status     String          @default("VACANT")
  allocations RoomAllocation[]
}

model RoomAllocation {
  id         String   @id @default(uuid())
  student    Student  @relation(fields: [studentId], references: [id])
  studentId  String
  room       Room     @relation(fields: [roomId], references: [id])
  roomId     String
  hostel     Hostel   @relation(fields: [hostelId], references: [id])
  hostelId   String
  startDate  DateTime @default(now())
  endDate    DateTime?
  status     String   @default("ACTIVE")
}

model Payment {
  id          String   @id @default(uuid())
  student     Student  @relation(fields: [studentId], references: [id])
  studentId   String
  amount      Decimal
  paymentDate DateTime @default(now())
  paymentType String
  status      String   @default("PENDING")
  reference   String
}

model Attendance {
  id         String   @id @default(uuid())
  student    Student  @relation(fields: [studentId], references: [id])
  studentId  String
  date       DateTime
  status     String
  remarks    String?
}

model LeaveRequest {
  id          String   @id @default(uuid())
  student     Student  @relation(fields: [studentId], references: [id])
  studentId   String
  startDate   DateTime
  endDate     DateTime
  reason      String
  status      String   @default("PENDING")
  approvedBy  String?
}

model Complaint {
  id          String   @id @default(uuid())
  student     Student  @relation(fields: [studentId], references: [id])
  studentId   String
  title       String
  description String
  category    String
  status      String   @default("OPEN")
  resolution  String?
  createdAt   DateTime @default(now())
}
```

### 4. Run migrations and seed data

- `npx prisma migrate dev --name init`
- Create seed data for Hostels, Rooms, and initial Admin user

## Phase 2: Authorization & Backend APIs

### 1. Authentication and authorization

- Create `app/api/auth/login/route.ts` and `app/api/auth/register/route.ts`
- Use `bcrypt` or `argon2` to hash passwords
- Implement role-based session guards in middleware or route handlers
- Create helper utilities in `lib/auth.ts`

### 2. API route structure

Use Next.js API Routes under `app/api` with route handlers for each module.

```text
app/api/
  auth/
    login/route.ts
    register/route.ts
  hostels/route.ts
  rooms/route.ts
  students/route.ts
  payments/route.ts
  attendance/route.ts
  leaves/route.ts
  complaints/route.ts
```

### 3. CRUD operations per module

- `Hostels`: list, create, update, delete
- `Rooms`: room inventory, status updates, occupancy counts
- `Students`: register, update, profile lookup
- `RoomAllocations`: assign rooms, release rooms, fetch student allocations
- `Payments`: create payments, update statuses, list history
- `Attendance`: record attendance, query by date range
- `LeaveRequests`: submit leave, approve/reject, query by student
- `Complaints`: submit complaint, update resolution status

### 4. Backend helpers

- Add `lib/prisma.ts` for a singleton Prisma client
- Add `lib/utils.ts` for shared validation and response handling
- Add `lib/auth.ts` for role checks and session logic

## Phase 3: Frontend UI

### 1. Layout and navigation

- Use `app/layout.tsx` and `app/(dashboard)/layout.tsx` for shared layout and nested dashboard routes
- Build a `components/sidebar.tsx` with navigation links for Admin and Student views
- Add global theme support with `components/theme-provider.tsx`

### 2. Dashboard pages

Create pages for the core modules:

```text
app/(dashboard)/page.tsx
app/(dashboard)/hostels/page.tsx
app/(dashboard)/rooms/page.tsx
app/(dashboard)/students/page.tsx
app/(dashboard)/staff/page.tsx
app/(dashboard)/in-out/page.tsx
```

### 3. Data-driven UI components

- `components/ui/table.tsx` for tabular lists of rooms, students, payments, complaints
- `components/ui/form.tsx` and `components/ui/input.tsx` for registration and allocation forms
- `components/ui/dialog.tsx` and `components/ui/toast.tsx` for confirmations and notifications

### 4. Page-level feature flows

- Students page: registration form, search, profile details
- Rooms page: room inventory, vacancy status, allocation actions
- Hostels page: hostel details, capacities, warden assignments
- Staff page: dashboard metrics and management shortcuts
- In/Out page: attendance and leave tracking, check-in/check-out flows

### 5. Responsive UI

- Use Tailwind CSS utility classes and `components/ui` primitives
- Ensure mobile-friendly navigation and data tables
- Use `lucide-react` icons for actions, status badges, and page headers

## Phase 4: Integration and Delivery

### 1. Connect UI to backend

- Fetch data from `app/api/*` endpoints using `fetch` inside server components or client components
- Use form submission handlers and `react-hook-form` for validation
- Display loading and error states consistently

### 2. Protect routes and guard access

- Use role-based logic to show/hide admin workflows
- Add auth checks for API routes and page components

### 3. Testing and validation

- Validate API endpoints using Postman or Insomnia
- Test flows for student registration, room assignment, payments, and complaints
- Validate MySQL foreign keys and relation integrity

### 4. Production readiness

- Configure environment variables securely
- Optimize build via `pnpm build`
- Deploy to Vercel or another hosting platform supporting Next.js
- Monitor database performance and audit logs for authentication actions

## Recommended File Layout for Implementation

```text
app/
  layout.tsx
  page.tsx
  api/
    auth/
      login/route.ts
      register/route.ts
    hostels/route.ts
    rooms/route.ts
    students/route.ts
    payments/route.ts
    attendance/route.ts
    leaves/route.ts
    complaints/route.ts
  (dashboard)/
    layout.tsx
    page.tsx
    hostels/page.tsx
    rooms/page.tsx
    students/page.tsx
    staff/page.tsx
    in-out/page.tsx
components/
  sidebar.tsx
  theme-provider.tsx
  ui/
    button.tsx
    card.tsx
    table.tsx
    form.tsx
    input.tsx
    dialog.tsx
    toast.tsx
lib/
  auth.ts
  prisma.ts
  utils.ts
hooks/
  use-mobile.ts
  use-toast.ts
prisma/
  schema.prisma
  migrations/
```

## Success Criteria

- A stable MySQL schema with student, room, hostel, payment, attendance, leave, and complaint models
- Role-aware API endpoints for staff and students
- Dashboard UI for managing hostel operations
- Connected frontend and backend with data validation and error handling
- Production-ready deployment process
