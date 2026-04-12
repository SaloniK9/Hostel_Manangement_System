# Implementation Plan — Hostel Management System

This plan is built for a Next.js App Router application with MySQL as the backend. The design supports three portals with role-aware access: Admin, Warden, and Student.

## Phase 1: Database and Role Modeling

### Goal
Create a MySQL schema that supports Admin, Warden, and Student access levels while preserving room, hostel, payment, attendance, leave, and complaint relationships.

### Recommended Approach
Use Prisma ORM with a `UserRole` enum for explicit portal separation.

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
  id          String      @id @default(uuid())
  email       String      @unique
  password    String
  role        UserRole
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  student     Student?    @relation(fields: [studentId], references: [id])
  studentId   String?     @unique
}

model Hostel {
  id          String      @id @default(uuid())
  hostelName  String
  location    String
  capacity    Int
  wardenName  String
  contact     String
  rooms       Room[]
  students    Student[]
  createdAt   DateTime    @default(now())
}

model Room {
  id              String          @id @default(uuid())
  roomId          String          @unique
  hostel          Hostel          @relation(fields: [hostelId], references: [id])
  hostelId        String
  roomType        String
  capacity        Int
  currentOccupants Int            @default(0)
  status          String          @default("VACANT")
  allocations     RoomAllocation[]
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

### Using a Roles Table (Alternative)

If you need dynamic roles, add a `Role` table alongside `User`:

```prisma
model Role {
  id    String   @id @default(uuid())
  name  String   @unique
  users User[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  roleId    String
  role      Role     @relation(fields: [roleId], references: [id])
}
```

### Phase 1 Tasks

1. Install Prisma and initialize schema.
2. Add tables for `User`, `Hostel`, `Room`, `Student`, `RoomAllocation`, `Payment`, `Attendance`, `LeaveRequest`, `Complaint`.
3. Keep fields aligned with ER diagram naming conventions: `Room_ID`, `Student_ID`, `Hostel_Name`, `Warden_Name`, `AdmissionDate`, `PaymentDate`.
4. Create initial seed data for one Admin, one Warden, one Hostel, and sample Rooms.

## Phase 2: Auth Middleware and Role Redirects

### Goal
Ensure every authenticated user lands in the correct portal and cannot access a different role's pages.

### Middleware Design

1. Create `middleware.ts` at the project root.
2. Use `NextResponse.next()` for authenticated requests.
3. Read session or JWT token to determine `user.role`.
4. Redirect based on role:
   - `ADMIN` → `/admin`
   - `WARDEN` → `/warden`
   - `STUDENT` → `/student`

### Example Redirect Logic

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  if (!token) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/warden') || url.pathname.startsWith('/student')) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/login' || url.pathname === '/') {
    switch (payload.role) {
      case 'ADMIN':
        url.pathname = '/admin';
        break;
      case 'WARDEN':
        url.pathname = '/warden';
        break;
      case 'STUDENT':
        url.pathname = '/student';
        break;
    }
    return NextResponse.redirect(url);
  }

  if (payload.role === 'ADMIN' && url.pathname.startsWith('/warden')) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }
  if (payload.role === 'WARDEN' && url.pathname.startsWith('/admin')) {
    url.pathname = '/warden';
    return NextResponse.redirect(url);
  }
  if (payload.role === 'STUDENT' && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/warden'))) {
    url.pathname = '/student';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

### Middleware Matcher

```ts
export const config = {
  matcher: ['/admin/:path*', '/warden/:path*', '/student/:path*', '/api/:path*'],
};
```

### API Guarding

- Use role checks inside `app/api/*` route handlers.
- Example: only allow `/api/hostels` for `ADMIN` and `WARDEN`.
- Return `403` when role does not match.

## Phase 3: UI/UX with Role-Specific Layouts

### Goal
Build three distinct, isolated layouts so users only see pages and navigation relevant to their role.

### Folder Structure

```text
app/
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
```

### Layout Responsibilities

- `app/admin/layout.tsx`: admin sidebar, global header, admin-only breadcrumbs and page wrappers.
- `app/warden/layout.tsx`: warden-specific menu, quick actions for room allocation and leave approvals.
- `app/student/layout.tsx`: student dashboard view, personal summary, profile and fee status.

### Navigation Strategy

- Each layout loads a distinct sidebar component or route list.
- Do not render Admin nav items in Warden layout.
- Do not render Warden or Admin nav links in Student layout.
- Use role-specific header badges to show `Admin`, `Warden`, or `Student`.

### UX Requirements

- Admin portal includes system settings, users, hostels, rooms and reports.
- Warden portal focuses on student roster, room allocation, attendance, leave approvals, and complaints.
- Student portal presents current room, hostel, fees, attendance summary, and complaint submission.

### Example Component Flow

- `components/sidebar.tsx` receives `role` and renders a filtered nav list.
- `components/layout-switcher.tsx` can help users switch context during development, but hidden in production.

## Phase 4: Integration and Validation

### Goal
Connect the frontend and backend and verify portal behavior.

### Tasks

1. Implement login with role detection.
2. Protect pages using layout guards and middleware.
3. Fetch data from role-appropriate API routes.
4. Build forms for room allocation, fees, attendance and complaint submission.
5. Validate access by testing each portal with users from each role.

### Deliverables

- `Admin` dashboard with user, hostel, and room controls
- `Warden` workspace for student management, allocations, attendance and leave approvals
- `Student` workspace for profile, room details, fee status, and complaints
- Secure role-aware API routes and middleware redirects
- MySQL schema matching ER diagram fields such as `Room_ID`, `Student_ID`, `Hostel_Name`, `Warden_Name`, and `PaymentDate`

## Additional Notes

- Use Prisma migration history to manage schema changes.
- Keep `lib/prisma.ts` as the shared Prisma client instance.
- Keep `lib/auth.ts` for token creation, verification and role helper functions.
- Use `app/api/auth/login/route.ts` to return role and redirect location after successful login.
- Use server-side and client-side checks together to prevent unauthorized navigation.


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
