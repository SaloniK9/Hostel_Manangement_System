import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getStudentPayments = async (studentId: string) => {
  return await prisma.payment.findMany({
    where: { studentId },
    orderBy: { paymentDate: 'desc' }
  })
}

export const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      student: { select: { name: true, studentId: true } }
    },
    orderBy: { paymentDate: 'desc' }
  })
}

export const recordPayment = async (data: Prisma.PaymentCreateInput) => {
  return await prisma.payment.create({
    data
  })
}

export const updatePaymentStatus = async (id: string, status: string) => {
  return await prisma.payment.update({
    where: { id },
    data: { status }
  })
}
