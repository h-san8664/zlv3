import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let buyers = await db.buyer.findMany({
      include: {
        orders: {
          include: {
            orderItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Apply search filter
    if (search) {
      buyers = buyers.filter(buyer =>
        buyer.name.toLowerCase().includes(search.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(search.toLowerCase()) ||
        buyer.phone.includes(search)
      )
    }

    return NextResponse.json(buyers)
  } catch (error) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, phone, email } = body

    if (!name || !address || !phone) {
      return NextResponse.json(
        { error: 'Name, address, and phone are required' },
        { status: 400 }
      )
    }

    const buyer = await db.buyer.create({
      data: {
        name,
        address,
        phone,
        email
      }
    })

    return NextResponse.json(buyer, { status: 201 })
  } catch (error) {
    console.error('Error creating buyer:', error)
    return NextResponse.json(
      { error: 'Failed to create buyer' },
      { status: 500 }
    )
  }
}