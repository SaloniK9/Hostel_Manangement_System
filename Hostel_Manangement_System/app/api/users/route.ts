import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST create user
export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    const hashed = await hashPassword(password || 'password123')
    const user = await prisma.user.create({
      data: { email, password: hashed, role },
      select: { id: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH update user
export async function PATCH(request: Request) {
  try {
    const { id, email, role, password } = await request.json()
    const updateData: any = {}
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (password) updateData.password = await hashPassword(password)
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
