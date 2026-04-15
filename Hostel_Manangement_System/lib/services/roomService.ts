import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const getAllRooms = async () => {
  return await prisma.room.findMany({
    include: {
      hostel: {
        select: { hostelName: true }
      }
    }
  })
}

export const getRoomsByHostel = async (hostelId: string) => {
  return await prisma.room.findMany({
    where: { hostelId },
    include: {
      _count: {
        select: { allocations: true }
      }
    }
  })
}

export const createRoom = async (data: Prisma.RoomCreateInput) => {
  return await prisma.room.create({
    data
  })
}

export const updateRoom = async (id: string, data: Prisma.RoomUpdateInput) => {
  return await prisma.room.update({
    where: { id },
    data
  })
}

export const deleteRoom = async (id: string) => {
  return await prisma.room.delete({
    where: { id }
  })
}
