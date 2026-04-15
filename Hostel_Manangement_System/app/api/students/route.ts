import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        hostel: { select: { hostelName: true } },
        room: { select: { roomId: true } },
        user: { select: { email: true } }
      },
      orderBy: { admissionDate: 'desc' }
    })
    return NextResponse.json(students)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentData, userData } = await request.json()
    const { hashPassword } = await import('@/lib/auth')
    const hashed = await hashPassword(userData.password || 'student123')
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: userData.email, password: hashed, role: 'STUDENT' }
      })
      return tx.student.create({
        data: { ...studentData, userId: user.id, studentId: studentData.studentId || `STU${Date.now()}` },
        include: { hostel: { select: { hostelName: true } }, room: { select: { roomId: true } }, user: { select: { email: true } } }
      })
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const student = await prisma.student.update({
      where: { id },
      data,
      include: { hostel: { select: { hostelName: true } }, room: { select: { roomId: true } }, user: { select: { email: true } } }
    })
    return NextResponse.json(student)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.$transaction([
      prisma.student.delete({ where: { id } }),
      prisma.user.delete({ where: { id: student.userId } }),
    ])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
