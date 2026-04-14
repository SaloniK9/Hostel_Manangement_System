# Hostel Management System (HMS)

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.7.0-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)

## Project Overview

The **Hostel Management System (HMS)** is a comprehensive, multi-portal web application designed to streamline the operations of educational residential facilities. Built with **Next.js App Router**, **Prisma ORM**, and **MySQL**, it provides a secure, role-aware environment for administrators, wardens, and students to manage everything from room allocations to fee payments and attendance.

## Key Features & User Roles

### 🔑 Admin Portal
- **System Configuration**: Manage hostels, blocks, and global settings.
- **User Management**: Add and manage system users (Wardens, Admins).
- **Global Reporting**: View system-wide occupancy, payment reports, and analytics.

### 🏠 Warden Portal
- **Student Management**: Register students and manage their profiles.
- **Room Allocation**: Assign and transfer students between rooms.
- **Operations**: Manage attendance records, approve leave requests, and resolve student complaints.

### 🎓 Student Portal
- **Dashboard**: View current hostel and room details.
- **Financials**: Track fee payments and history.
- **Requests**: Submit leave requests and file complaints.
- **Attendance**: Monitor personal attendance records.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: Custom JWT with Middleware-based routing
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## Architecture

The project follows a clean, tiered architecture to ensure separation of concerns and maintainability:

1. **Frontend**: React Server Components (RSC) and Client Components using Next.js portals.
2. **API Routes**: Handle HTTP requests, authentication, and validation (`app/api/`).
3. **Service Layer**: Encapsulates all business logic and database interactions (`lib/services/`).
4. **Data Access**: Prisma Client for structured database operations (`prisma/`).

## Folder Structure

```text
app/
  (portals)/       # Role-specific page groups (admin, warden, student)
  api/             # Backend API endpoints
  login/           # Authentication pages
components/
  ui/              # Reusable UI primitives (Button, Card, etc.)
  shared/          # Common components across portals
lib/
  services/        # Business logic & DB operations (Service Layer)
  auth.ts          # Auth utilities
  prisma.ts        # Prisma client instance
  middleware.ts    # Role-based route protection
prisma/
  schema.prisma    # Database schema
  seed.ts          # Seed data for initial users and hostels
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL Server 8.0+

### Installation

1. **Clone and Install**:
   ```bash
   git clone <repo-url>
   cd hms
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/hms"
   JWT_SECRET="your-secure-secret-key"
   ```

3. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## API Overview

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticates user and sets cookie |
| `/api/hostels` | GET/POST | Admin/Warden | Manage hostel facilities |
| `/api/rooms` | GET/POST | Admin/Warden | Manage room inventory |
| `/api/students` | GET/POST | Warden | Register and view students |
| `/api/payments` | GET/POST | Student/Warden | Fee tracking |
| `/api/attendance` | GET/POST | Warden | Attendance management |
| `/api/leaves` | GET/POST | Student/Warden | Leave request workflow |

---
*Developed with performance and security as core principles.*
