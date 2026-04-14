import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getStudentAttendance = async (studentId: string) => {
  return await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { attendanceDate: 'desc' }
  })
}

export const markAttendance = async (data: Prisma.AttendanceCreateInput) => {
  return await prisma.attendance.create({
    data
  })
}

export const getDailyAttendance = async (date: Date) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return await prisma.attendance.findMany({
    where: {
      attendanceDate: {
        gte: startOfDay,
        lt: endOfDay
      }
    },
    include: {
      student: { select: { name: true, studentId: true } }
    }
  })
}
