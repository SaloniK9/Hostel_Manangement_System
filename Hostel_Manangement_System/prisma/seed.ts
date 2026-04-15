import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Upsert Admin user (idempotent)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hms.com' },
    update: {},
    create: {
      email: 'admin@hms.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  })
  console.log('Admin user ready:', adminUser.email)

  // Upsert Warden user (idempotent)
  const wardenUser = await prisma.user.upsert({
    where: { email: 'warden@hms.com' },
    update: {},
    create: {
      email: 'warden@hms.com',
      password: await hashPassword('warden123'),
      role: 'WARDEN',
    },
  })
  console.log('Warden user ready:', wardenUser.email)

  // Create Hostel (only if none exist)
  const hostelCount = await prisma.hostel.count()
  if (hostelCount === 0) {
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
    console.log('Hostel and rooms created')
  } else {
    console.log('Hostel data already exists, skipping')
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })