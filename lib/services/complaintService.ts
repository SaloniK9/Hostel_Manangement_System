import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getStudentComplaints = async (studentId: string) => {
  return await prisma.complaint.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' }
  })
}

export const getAllComplaints = async () => {
  return await prisma.complaint.findMany({
    include: {
      student: { select: { name: true, studentId: true, room: { select: { roomId: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const createComplaint = async (data: Prisma.ComplaintCreateInput) => {
  return await prisma.complaint.create({
    data
  })
}

export const updateComplaintStatus = async (id: string, status: string, resolution?: string) => {
  return await prisma.complaint.update({
    where: { id },
    data: { status, resolution }
  })
}
