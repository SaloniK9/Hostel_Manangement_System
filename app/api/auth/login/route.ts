import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          error: 'Validation failed',
          errors: validation.error.errors.map(e => e.message) 
        }, 
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    console.log(`[LOGIN_ATTEMPT][${requestId}]`, { email })

    // Database interaction with specific error handling
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      })
    } catch (dbError: any) {
      console.error(`[DATABASE_ERROR][${requestId}]`, {
        code: dbError.code,
        message: dbError.message,
      })

      // Handle typical Prisma connection error (P1001)
      if (dbError.code === 'P1001' || dbError.message.includes('Can\'t reach database server')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database connection failed. Please try again later.',
            error: 'Database connection failed'
          }, 
          { status: 503 }
        )
      }

      throw dbError // Re-throw if it's not a connection error we specifically handle
    }

    if (!user) {
      console.log(`[LOGIN_FAILED][${requestId}] User not found`, { email })
      return NextResponse.json(
        { success: false, message: 'Invalid email or password', error: 'Invalid email or password' }, 
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log(`[LOGIN_FAILED][${requestId}] Invalid password`, { email })
      return NextResponse.json(
        { success: false, message: 'Invalid email or password', error: 'Invalid email or password' }, 
        { status: 401 }
      )
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      redirectTo: user.role === 'ADMIN' ? '/admin' : user.role === 'WARDEN' ? '/warden' : '/student',
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log(`[LOGIN_SUCCESS][${requestId}]`, { email, role: user.role })
    return response

  } catch (error: any) {
    console.error(`[LOGIN_CRITICAL_ERROR][${requestId}]`, {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      { 
        success: false, 
        message: 'An internal server error occurred',
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}