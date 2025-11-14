import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, brand, price, image, description, isBestSeller, isPromo } = body

    if (!name || !brand || !price) {
      return NextResponse.json(
        { error: 'Name, brand, and price are required' },
        { status: 400 }
      )
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        price: parseFloat(price),
        image: image || '',
        description,
        isBestSeller: isBestSeller || false,
        isPromo: isPromo || false
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product is referenced in any order items
    const orderItems = await db.orderItem.findMany({
      where: { productId: params.id }
    })

    if (orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product that is referenced in orders' },
        { status: 400 }
      )
    }

    // Delete the product
    await db.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}