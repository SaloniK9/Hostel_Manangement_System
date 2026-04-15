-- 1. CLEANUP (Optional - only if you want to start fresh)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- 2. CREATE SCHEMA AND ENUMS
CREATE SCHEMA IF NOT EXISTS "public";
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'WARDEN', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CREATE TABLES
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Hostel" (
    "id" TEXT NOT NULL,
    "hostelName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "wardenName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Room" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentOccupants" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'VACANT',
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "hostelId" TEXT,
    "roomId" TEXT,
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- 4. INDICES
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_studentId_key" ON "User"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "Room_roomId_key" ON "Room"("roomId");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_studentId_key" ON "Student"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_userId_key" ON "Student"("userId");

-- 5. FOREIGN KEYS
ALTER TABLE "Room" DROP CONSTRAINT IF EXISTS "Room_hostelId_fkey";
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Student" DROP CONSTRAINT IF EXISTS "Student_userId_fkey";
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. SEED DATA (INITIAL USERS)
-- Passwords: admin123, warden123
INSERT INTO "User" ("id", "email", "password", "role", "updatedAt") 
VALUES 
('admin-uuid', 'admin@hms.com', '$2b$10$7Xxl8c2ShxTy9tGLvtAnMOGQahBACseHYzOe5zz26mfn1fs0v9uCC', 'ADMIN', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" ("id", "email", "password", "role", "updatedAt") 
VALUES 
('warden-uuid', 'warden@hms.com', '$2b$10$XLZyoBAANg0hG46IZw3hc.tHWCzqM4LsuHxPo8JvEUGrOCJ1AuF5m', 'WARDEN', NOW())
ON CONFLICT (email) DO NOTHING;

-- CREATE INITIAL HOSTEL
INSERT INTO "Hostel" ("id", "hostelName", "location", "capacity", "wardenName", "contact")
VALUES 
('hostel-uuid', 'Boys Hostel A', 'Campus Block A', 100, 'John Doe', '123-456-7890')
ON CONFLICT DO NOTHING;
