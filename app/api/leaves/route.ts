import { NextResponse } from 'next/server'
import { getAllLeaves, createLeaveRequest, getStudentLeaves, updateLeaveStatus } from '@/lib/services/leaveService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (studentId) {
      const leaves = await getStudentLeaves(studentId)
      return NextResponse.json(leaves)
    }

    const leaves = await getAllLeaves()
    return NextResponse.json(leaves)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const leave = await createLeaveRequest(data)
    return NextResponse.json(leave, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, approvedBy } = await request.json()
    const leave = await updateLeaveStatus(id, status, approvedBy)
    return NextResponse.json(leave)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
