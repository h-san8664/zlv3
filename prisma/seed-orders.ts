import { db } from '../src/lib/db'

async function main() {
  // Get existing products and buyers
  const products = await db.product.findMany()
  const buyers = await db.buyer.findMany()

  if (products.length === 0 || buyers.length === 0) {
    console.log('❌ No products or buyers found. Please run seed script first.')
    return
  }

  // Create sample orders
  const sampleOrders = [
    {
      orderId: `ZL-${Date.now()}-001`,
      buyerId: buyers[0].id,
      shippingCost: 10000,
      totalCost: 0,
      status: 'CONFIRMED' as const,
      orderItems: [
        {
          productId: products[0].id,
          quantity: 1,
          price: products[0].price
        }
      ]
    },
    {
      orderId: `ZL-${Date.now()}-002`,
      buyerId: buyers[1].id,
      shippingCost: 15000,
      totalCost: 0,
      status: 'ON_PROCESS' as const,
      orderItems: [
        {
          productId: products[1].id,
          quantity: 2,
          price: products[1].price
        }
      ]
    },
    {
      orderId: `ZL-${Date.now()}-003`,
      buyerId: buyers[0].id,
      shippingCost: 20000,
      totalCost: 0,
      status: 'DELIVERED' as const,
      orderItems: [
        {
          productId: products[2].id,
          quantity: 1,
          price: products[2].price
        },
        {
          productId: products[3].id,
          quantity: 1,
          price: products[3].price
        }
      ]
    }
  ]

  for (const orderData of sampleOrders) {
    // Calculate total cost
    orderData.totalCost = orderData.orderItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0) + orderData.shippingCost

    // Create order
    const order = await db.order.create({
      data: {
        orderId: orderData.orderId,
        buyerId: orderData.buyerId,
        shippingCost: orderData.shippingCost,
        totalCost: orderData.totalCost,
        status: orderData.status
      }
    })

    // Create order items
    for (const item of orderData.orderItems) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })
    }

    console.log(`✅ Created order: ${order.orderId}`)
  }

  console.log('🎉 Sample orders created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating sample orders:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })