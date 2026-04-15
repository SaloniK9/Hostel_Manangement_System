import { NextResponse } from 'next/server'
import { getAllPayments, recordPayment, getStudentPayments } from '@/lib/services/paymentService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (studentId) {
      const payments = await getStudentPayments(studentId)
      return NextResponse.json(payments)
    }

    const payments = await getAllPayments()
    return NextResponse.json(payments)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const payment = await recordPayment(data)
    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
