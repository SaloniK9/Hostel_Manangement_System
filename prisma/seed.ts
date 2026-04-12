import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hms.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  })

  // Create Warden user
  const wardenUser = await prisma.user.create({
    data: {
      email: 'warden@hms.com',
      password: await hashPassword('warden123'),
      role: 'WARDEN',
    },
  })

  // Create Hostel
  const hostel = await prisma.hostel.create({
    data: {
      hostelName: 'Boys Hostel A',
      location: 'Campus Block A',
      capacity: 100,
      wardenName: 'John Doe',
      contact: '123-456-7890',
    },
  })

  // Create sample Rooms
  await prisma.room.createMany({
    data: [
      {
        roomId: 'A101',
        hostelId: hostel.id,
        roomType: 'Single',
        capacity: 1,
      },
      {
        roomId: 'A102',
        hostelId: hostel.id,
        roomType: 'Double',
        capacity: 2,
      },
      {
        roomId: 'A103',
        hostelId: hostel.id,
        roomType: 'Triple',
        capacity: 3,
      },
    ],
  })

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })