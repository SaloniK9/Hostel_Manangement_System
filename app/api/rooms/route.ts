import { NextResponse } from 'next/server'
import { getAllRooms, createRoom, getRoomsByHostel } from '@/lib/services/roomService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hostelId = searchParams.get('hostelId')

    if (hostelId) {
      const rooms = await getRoomsByHostel(hostelId)
      return NextResponse.json(rooms)
    }

    const rooms = await getAllRooms()
    return NextResponse.json(rooms)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const room = await createRoom(data)
    return NextResponse.json(room, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
