import { NextResponse } from 'next/server'
import { getAllHostels, createHostel } from '@/lib/services/hostelService'

export async function GET() {
  try {
    const hostels = await getAllHostels()
    return NextResponse.json(hostels)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const hostel = await createHostel(data)
    return NextResponse.json(hostel, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
