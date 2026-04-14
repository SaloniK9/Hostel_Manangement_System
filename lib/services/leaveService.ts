import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getStudentLeaves = async (studentId: string) => {
  return await prisma.leaveRequest.findMany({
    where: { studentId },
    orderBy: { startDate: 'desc' }
  })
}

export const getAllLeaves = async () => {
  return await prisma.leaveRequest.findMany({
    include: {
      student: { select: { name: true, studentId: true } }
    },
    orderBy: { startDate: 'desc' }
  })
}

export const createLeaveRequest = async (data: Prisma.LeaveRequestCreateInput) => {
  return await prisma.leaveRequest.create({
    data
  })
}

export const updateLeaveStatus = async (id: string, status: string, approvedBy: string) => {
  return await prisma.leaveRequest.update({
    where: { id },
    data: { status, approvedBy }
  })
}
