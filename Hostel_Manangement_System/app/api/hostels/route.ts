import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all hostels
export async function GET() {
  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        _count: { select: { rooms: true, students: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(hostels)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST create hostel
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const hostel = await prisma.hostel.create({ data })
    return NextResponse.json(hostel, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH update hostel
export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const hostel = await prisma.hostel.update({ where: { id }, data })
    return NextResponse.json(hostel)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE hostel
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.hostel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
