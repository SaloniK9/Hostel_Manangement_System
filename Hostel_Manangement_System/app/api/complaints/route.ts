import { NextResponse } from 'next/server'
import { getAllComplaints, createComplaint, getStudentComplaints, updateComplaintStatus } from '@/lib/services/complaintService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (studentId) {
      const complaints = await getStudentComplaints(studentId)
      return NextResponse.json(complaints)
    }

    const complaints = await getAllComplaints()
    return NextResponse.json(complaints)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const complaint = await createComplaint(data)
    return NextResponse.json(complaint, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, resolution } = await request.json()
    const complaint = await updateComplaintStatus(id, status, resolution)
    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
