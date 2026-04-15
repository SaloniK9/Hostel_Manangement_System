import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hostelId = searchParams.get('hostelId')
    const where = hostelId ? { hostelId } : {}
    const rooms = await prisma.room.findMany({
      where,
      include: { hostel: { select: { hostelName: true } } },
      orderBy: { roomId: 'asc' }
    })
    return NextResponse.json(rooms)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const room = await prisma.room.create({ data, include: { hostel: { select: { hostelName: true } } } })
    return NextResponse.json(room, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const room = await prisma.room.update({ where: { id }, data, include: { hostel: { select: { hostelName: true } } } })
    return NextResponse.json(room)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.room.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
