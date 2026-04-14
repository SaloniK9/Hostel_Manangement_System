import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getAllHostels = async () => {
  return await prisma.hostel.findMany({
    include: {
      _count: {
        select: { rooms: true, students: true }
      }
    }
  })
}

export const getHostelById = async (id: string) => {
  return await prisma.hostel.findUnique({
    where: { id },
    include: {
      rooms: true,
      students: true
    }
  })
}

export const createHostel = async (data: Prisma.HostelCreateInput) => {
  return await prisma.hostel.create({
    data
  })
}

export const updateHostel = async (id: string, data: Prisma.HostelUpdateInput) => {
  return await prisma.hostel.update({
    where: { id },
    data
  })
}

export const deleteHostel = async (id: string) => {
  return await prisma.hostel.delete({
    where: { id }
  })
}
