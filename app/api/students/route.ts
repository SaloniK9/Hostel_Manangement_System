import { NextResponse } from 'next/server'
import { getAllStudents, createStudent } from '@/lib/services/studentService'

export async function GET() {
  try {
    const students = await getAllStudents()
    return NextResponse.json(students)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentData, userData } = await request.json()
    const student = await createStudent(studentData, userData)
    return NextResponse.json(student, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
