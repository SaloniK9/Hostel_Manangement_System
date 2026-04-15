import { NextResponse } from 'next/server'
import { getDailyAttendance, markAttendance, getStudentAttendance } from '@/lib/services/attendanceService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const dateStr = searchParams.get('date')

    if (studentId) {
      const attendance = await getStudentAttendance(studentId)
      return NextResponse.json(attendance)
    }

    const date = dateStr ? new Date(dateStr) : new Date()
    const attendance = await getDailyAttendance(date)
    return NextResponse.json(attendance)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const attendance = await markAttendance(data)
    return NextResponse.json(attendance, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
