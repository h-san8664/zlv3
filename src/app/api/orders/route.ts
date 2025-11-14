import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const buyerId = searchParams.get('buyerId')

    let orders = await db.order.findMany({
      include: {
        buyer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Apply filters
    if (status) {
      orders = orders.filter(order => order.status === status)
    }

    if (buyerId) {
      orders = orders.filter(order => order.buyerId === buyerId)
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buyerName, address, phone, email, orderItems, shippingCost } = body

    if (!buyerName || !address || !phone || !orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Buyer information and order items are required' },
        { status: 400 }
      )
    }

    // Generate custom order ID
    const orderId = `ZL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate total cost
    const totalCost = orderItems.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0) + (shippingCost || 0)

    // Create buyer
    const buyer = await db.buyer.create({
      data: {
        name: buyerName,
        address,
        phone,
        email
      }
    })

    // Create order
    const order = await db.order.create({
      data: {
        orderId,
        buyerId: buyer.id,
        shippingCost: shippingCost || 0,
        totalCost,
        status: 'CONFIRMED'
      }
    })

    // Create order items
    for (const item of orderItems) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })
    }

    // Return the complete order with relations
    const completeOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        buyer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}