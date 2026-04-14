import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        student: {
          include: {
            hostel: true,
            room: true,
            payments: { orderBy: { paymentDate: 'desc' }, take: 5 },
            attendances: { orderBy: { attendanceDate: 'desc' }, take: 5 },
            leaveRequests: { orderBy: { startDate: 'desc' }, take: 5 },
            complaints: { orderBy: { createdAt: 'desc' }, take: 5 }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
