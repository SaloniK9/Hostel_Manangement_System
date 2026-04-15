import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
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
