# Hostel Management System

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-teal)
![Prisma](https://img.shields.io/badge/Prisma-4.20.0-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)

## Overview

Hostel Management System (HMS) is a multi-portal web application built with Next.js App Router, MySQL, and Prisma. It is purpose-built to support Admin, Warden, and Student portals with clearly separated access, workflows, and dashboards.

## Role-Based Portals

- **Admin Portal**: full system control, user management, hostel configuration, reporting, and global settings.
- **Warden Portal**: student admission, room allocation, attendance management, leave approvals, and complaint management.
- **Student Portal**: personal profile, room & hostel details, fee status, attendance view, and complaint submission.

## Feature Comparison

| Feature | Admin | Warden | Student |
|---|:---:|:---:|:---:|
| Manage users and roles | ✅ | ❌ | ❌ |
| Configure hostels | ✅ | ✅ | ❌ |
| Manage rooms and allocation | ✅ | ✅ | ❌ |
| View student profiles | ✅ | ✅ | ✅ |
| Track attendance | ✅ | ✅ | ✅ |
| Approve leaves | ✅ | ✅ | ❌ |
| Submit leave requests | ✅ | ✅ | ✅ |
| Record payments | ✅ | ✅ | ✅ |
| File complaints | ✅ | ✅ | ✅ |
| View dashboards | ✅ | ✅ | ✅ |

## Tech Stack

- Frontend: Next.js App Router, React, Tailwind CSS, Lucide React
- Backend: Next.js API Routes (Node.js)
- Database: MySQL
- ORM: Prisma
- Validation: Zod, React Hook Form
- UI: Radix UI primitives and custom Tailwind components

## Installation

1. Clone the repository

```bash
git clone <your-repo-url> hms
cd hms
```

2. Install dependencies

```bash
pnpm install
```

3. Create `.env`

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL=http://localhost:3000
```

4. Install Prisma and generate client

```bash
pnpm add -D prisma
pnpm add @prisma/client
npx prisma init
```

5. Run migrations

```bash
npx prisma migrate dev --name init
```

6. Start development

```bash
pnpm dev
```

## Project Directory Structure

```text
app/
  layout.tsx
  page.tsx
  login/page.tsx
  admin/
    layout.tsx
    page.tsx
    hostels/page.tsx
    rooms/page.tsx
    users/page.tsx
    reports/page.tsx
  warden/
    layout.tsx
    page.tsx
    students/page.tsx
    allocations/page.tsx
    attendance/page.tsx
    leaves/page.tsx
    complaints/page.tsx
  student/
    layout.tsx
    page.tsx
    profile/page.tsx
    fees/page.tsx
    attendance/page.tsx
    complaints/page.tsx
  api/
    auth/
      login/route.ts
      register/route.ts
    users/route.ts
    hostels/route.ts
    rooms/route.ts
    allocations/route.ts
    payments/route.ts
    attendance/route.ts
    leaves/route.ts
    complaints/route.ts
components/
  header.tsx
  sidebar.tsx
  theme-provider.tsx
  ui/
    button.tsx
    card.tsx
    form.tsx
    input.tsx
    table.tsx
    badge.tsx
    dialog.tsx
    toast.tsx
lib/
  prisma.ts
  auth.ts
  middleware.ts
  utils.ts
prisma/
  schema.prisma
  migrations/
hooks/
  use-toast.ts
  use-mobile.ts
```

## Database Schema

This schema is aligned with the ER diagram and supports relationships between Students, Rooms, Hostels, Payments, Attendance, Leave Requests, and Complaints.

### Prisma Schema

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
  WARDEN
  STUDENT
}

model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  role        UserRole
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  student     Student?  @relation(fields: [studentId], references: [id])
  studentId   String?   @unique
}

model Hostel {
  id          String    @id @default(uuid())
  hostelName  String
  location    String
  capacity    Int
  wardenName  String
  contact     String
  rooms       Room[]
  students    Student[]
  createdAt   DateTime  @default(now())
}

model Room {
  id               String           @id @default(uuid())
  roomId           String           @unique
  hostel           Hostel           @relation(fields: [hostelId], references: [id])
  hostelId         String
  roomType         String
  capacity         Int
  currentOccupants Int              @default(0)
  status           String           @default("VACANT")
  allocations      RoomAllocation[]
}

model Student {
  id            String          @id @default(uuid())
  studentId     String          @unique
  user          User            @relation(fields: [userId], references: [id])
  userId        String          @unique
  name          String
  email         String
  phone         String
  department    String
  academicYear  Int
  hostel        Hostel?         @relation(fields: [hostelId], references: [id])
  hostelId      String?
  room          Room?           @relation(fields: [roomId], references: [id])
  roomId        String?
  admissionDate DateTime        @default(now())
  status        String          @default("ACTIVE")
  allocations   RoomAllocation[]
  payments      Payment[]
  attendances   Attendance[]
  leaveRequests LeaveRequest[]
  complaints    Complaint[]
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
  id             String   @id @default(uuid())
  student        Student  @relation(fields: [studentId], references: [id])
  studentId      String
  attendanceDate DateTime
  status         String
  remarks        String?
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

## Authentication Strategy

- Use role-based login and session/token storage.
- Redirect users after login to their portal:
  - Admin → `/admin`
  - Warden → `/warden`
  - Student → `/student`
- Protect API routes using role checks.
- Use `bcrypt` or `argon2` to hash credentials.

## Usage

- `pnpm dev` — start development
- `pnpm build` — build for production
- `pnpm start` — start production server
- `pnpm lint` — run lint checks

## Notes

- Use separate layouts to ensure Warden and Student portals do not show Admin-only navigation.
- Keep `lib/prisma.ts` and `lib/auth.ts` as centralized backend helpers.
- Use role-specific route groups for a clean App Router architecture.

## Notes

- Keep UI and API routes separated under `app/`.
- Use `lib/prisma.ts` for Prisma client instantiation.
- Use a central `components/ui` folder for reusable UI elements.
- For production, use environment variables and secure your database credentials.
