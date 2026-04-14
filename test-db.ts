import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('--- Database Connectivity Test ---')
  console.log('Testing connection to Supabase...')
  
  try {
    // Attempt a simple raw query or a count
    console.time('connection-time')
    const userCount = await prisma.user.count()
    console.timeEnd('connection-time')
    
    console.log('✅ Port 6543 is OPEN and connectivity is stable!')
    console.log('✅ Current User Count:', userCount)
    
  } catch (error: any) {
    console.log('❌ Connection FAILED.')
    console.error('Error Details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    
    if (error.message.includes('P1001')) {
      console.log('⚠️  PORT BLOCKAGE DETECTED: This machine cannot reach the database on port 6543.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
