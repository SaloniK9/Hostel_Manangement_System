# Hostel Management System

![Project Status](https://img.shields.io/badge/status-in%20progress-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-green)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![Database](https://img.shields.io/badge/Database-MySQL-lightgrey)

## Overview

The Hostel Management System is a modern web application built with Next.js App Router and Tailwind CSS. It is designed to support hostel administrators and students with room assignment, student registration, fee tracking, attendance and leave management, and complaint resolution.

The system provides an intuitive dashboard experience for staff and a student portal that streamlines every aspect of hostel operations.

## Key Features

- Role-based access for Admin/Staff and Students
- Hostel and room management
- Student profile and registration management
- Room allocation and vacancy tracking
- Fee payment tracking and invoice history
- Attendance tracking and leave requests
- Complaint submission and redressal workflow
- Responsive UI with Tailwind CSS and Lucide icons
- RESTful backend APIs using Next.js API Routes

## Tech Stack

- Frontend: Next.js (App Router), React, Tailwind CSS, Lucide React
- Backend: Next.js API Routes (Node.js)
- Database: MySQL
- ORM / Data Layer: Prisma ORM (recommended)
- Form Validation: Zod and React Hook Form
- UI components: Radix UI primitives and custom Tailwind components

## Recommended Database Layer

For this project, Prisma ORM is strongly recommended over plain `mysql2` because it offers:

- a declarative schema file for modeling entities and relations
- type-safe database access across frontend and backend
- built-in migrations and schema management
- clear support for MySQL and future migration to PostgreSQL or other providers

If you prefer a lightweight alternative, `mysql2` is acceptable for raw query access, but it will require more manual SQL and validation.

## Installation

1. Clone the repository

```bash
git clone <your-repo-url> hostel-management-system
cd hostel-management-system
```

2. Install dependencies

```bash
pnpm install
```

3. Add environment variables

Create a `.env` file at the project root with:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Install Prisma (if using Prisma)

```bash
pnpm add -D prisma
pnpm add @prisma/client
npx prisma init
```

5. Run database migrations

```bash
npx prisma migrate dev --name init
```

6. Start the development server

```bash
pnpm dev
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  api/
    auth/
    students/
    rooms/
    hostels/
    payments/
    attendance/
    leaves/
    complaints/
  (dashboard)/
    page.tsx
    staff/page.tsx
    students/page.tsx
    rooms/page.tsx
    hostels/page.tsx
    in-out/page.tsx
components/
  sidebar.tsx
  theme-provider.tsx
  ui/
    button.tsx
    card.tsx
    table.tsx
    form.tsx
    toast.tsx
lib/
  utils.ts
  prisma.ts
  auth.ts
hooks/
  use-mobile.ts
  use-toast.ts
```

## Database Schema

The schema is designed to support hostel administration, student management, room allocations, payments, attendance, leave requests, and complaints.

### Entity Definitions

#### `User`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `email` | `String` | Unique login email |
| `password` | `String` | Hashed password |
| `role` | `UserRole` | `ADMIN` or `STUDENT` |
| `createdAt` | `DateTime` | Record creation timestamp |
| `updatedAt` | `DateTime` | Record update timestamp |

#### `Student`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `userId` | `UUID` | FK to `User` |
| `studentNumber` | `String` | Unique student ID |
| `name` | `String` | Full name |
| `email` | `String` | Contact email |
| `phone` | `String` | Contact number |
| `department` | `String` | Academic department |
| `year` | `Int` | Academic year |
| `roomId` | `UUID?` | Current room assignment |
| `hostelId` | `UUID?` | Assigned hostel |
| `admissionDate` | `DateTime` | Registration date |
| `status` | `String` | Active / Inactive |

#### `Hostel`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `name` | `String` | Hostel name |
| `location` | `String` | Campus location |
| `capacity` | `Int` | Maximum room capacity |
| `wardenName` | `String` | Assigned warden |
| `contact` | `String` | Hostel contact number |
| `createdAt` | `DateTime` | Record creation timestamp |

#### `Room`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `hostelId` | `UUID` | FK to `Hostel` |
| `number` | `String` | Room number |
| `type` | `String` | Single / Double / Triple / Suite |
| `capacity` | `Int` | Maximum occupants |
| `occupants` | `Int` | Current occupants count |
| `status` | `String` | Vacant / Occupied / Maintenance |

#### `RoomAllocation`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `studentId` | `UUID` | FK to `Student` |
| `roomId` | `UUID` | FK to `Room` |
| `hostelId` | `UUID` | FK to `Hostel` |
| `startDate` | `DateTime` | Allocation start |
| `endDate` | `DateTime?` | Allocation end |
| `status` | `String` | Active / Released |

#### `Payment`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `studentId` | `UUID` | FK to `Student` |
| `amount` | `Decimal` | Payment amount |
| `paymentDate` | `DateTime` | Date of payment |
| `paymentType` | `String` | Fee / Fine / Deposit |
| `status` | `String` | Paid / Pending / Failed |
| `reference` | `String` | Transaction reference |

#### `Attendance`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `studentId` | `UUID` | FK to `Student` |
| `date` | `DateTime` | Attendance date |
| `status` | `String` | Present / Absent |
| `remarks` | `String?` | Additional notes |

#### `LeaveRequest`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `studentId` | `UUID` | FK to `Student` |
| `startDate` | `DateTime` | Leave start |
| `endDate` | `DateTime` | Leave end |
| `reason` | `String` | Leave reason |
| `status` | `String` | Pending / Approved / Rejected |
| `approvedBy` | `UUID?` | Admin user who approved |

#### `Complaint`

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `studentId` | `UUID` | FK to `Student` |
| `title` | `String` | Short complaint title |
| `description` | `String` | Complaint details |
| `category` | `String` | Maintenance / Food / Safety / Other |
| `status` | `String` | Open / In Progress / Resolved |
| `resolution` | `String?` | Resolution notes |
| `createdAt` | `DateTime` | Submission timestamp |

## Authentication Strategy

- Use JWT or session-based authentication in Next.js API Routes
- Manage roles with `User.role` and protect admin-only pages
- Store hashed passwords securely using `bcrypt` or `argon2`

## Usage

- `pnpm dev` - start local development server
- `pnpm build` - create production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint checks

## Notes

- Keep UI and API routes separated under `app/`.
- Use `lib/prisma.ts` for Prisma client instantiation.
- Use a central `components/ui` folder for reusable UI elements.
- For production, use environment variables and secure your database credentials.
