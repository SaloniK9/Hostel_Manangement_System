import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

export const getAllStudents = async () => {
  return await prisma.student.findMany({
    include: {
      hostel: { select: { hostelName: true } },
      room: { select: { roomId: true } },
      user: { select: { email: true } }
    }
  })
}

export const getStudentById = async (id: string) => {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      hostel: true,
      room: true,
      user: true,
      allocations: true,
      payments: true,
      attendances: true,
      leaveRequests: true,
      complaints: true
    }
  })
}

export const createStudent = async (studentData: any, userData: any) => {
  const hashedPassword = await hashPassword(userData.password || 'student123')
  
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: 'STUDENT',
      }
    })

    return await tx.student.create({
      data: {
        ...studentData,
        userId: user.id,
        studentId: studentData.studentId || `STU${Date.now()}`
      }
    })
  })
}

export const updateStudent = async (id: string, data: Prisma.StudentUpdateInput) => {
  return await prisma.student.update({
    where: { id },
    data
  })
}

export const deleteStudent = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id } })
    if (!student) throw new Error('Student not found')
    
    await tx.student.delete({ where: { id } })
    return await tx.user.delete({ where: { id: student.userId } })
  })
}
