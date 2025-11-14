import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const brand = searchParams.get('brand')
    const isBestSeller = searchParams.get('bestSeller')
    const isPromo = searchParams.get('promo')

    let products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Apply filters
    if (search) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (brand) {
      products = products.filter(product => product.brand === brand)
    }

    if (isBestSeller === 'true') {
      products = products.filter(product => product.isBestSeller)
    }

    if (isPromo === 'true') {
      products = products.filter(product => product.isPromo)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, brand, price, image, description, isBestSeller, isPromo } = body

    if (!name || !brand || !price) {
      return NextResponse.json(
        { error: 'Name, brand, and price are required' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}