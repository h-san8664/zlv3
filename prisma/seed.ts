import { db } from '../src/lib/db'

async function main() {
  // Create sample products
  const products = await Promise.all([
    db.product.create({
      data: {
        name: 'Laptop Gaming Pro',
        brand: 'TechMaster',
        price: 15000000,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        description: 'Laptop gaming high performance dengan RTX 4070',
        isBestSeller: true,
        isPromo: false
      }
    }),
    db.product.create({
      data: {
        name: 'Smartphone Premium',
        brand: 'MobileTech',
        price: 8000000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
        description: 'Smartphone flagship dengan kamera terbaik',
        isBestSeller: true,
        isPromo: true
      }
    }),
    db.product.create({
      data: {
        name: 'Headphone Wireless',
        brand: 'AudioPro',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        description: 'Headphone noise cancelling premium',
        isBestSeller: false,
        isPromo: true
      }
    }),
    db.product.create({
      data: {
        name: 'Smartwatch Sport',
        brand: 'TimeTech',
        price: 3500000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        description: 'Smartwatch untuk olahraga dan fitness',
        isBestSeller: false,
        isPromo: false
      }
    }),
    db.product.create({
      data: {
        name: 'Tablet Pro',
        brand: 'TechMaster',
        price: 12000000,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
        description: 'Tablet profesional untuk produktivitas',
        isBestSeller: true,
        isPromo: false
      }
    }),
    db.product.create({
      data: {
        name: 'Camera Mirrorless',
        brand: 'PhotoPro',
        price: 18000000,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
        description: 'Kamera mirrorless 4K profesional',
        isBestSeller: false,
        isPromo: true
      }
    })
  ])

  console.log('✅ Sample products created:', products.length)

  // Create sample buyers
  const buyers = await Promise.all([
    db.buyer.create({
      data: {
        name: 'John Doe',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        phone: '08123456789',
        email: 'john.doe@example.com'
      }
    }),
    db.buyer.create({
      data: {
        name: 'Jane Smith',
        address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
        phone: '08987654321',
        email: 'jane.smith@example.com'
      }
    })
  ])

  console.log('✅ Sample buyers created:', buyers.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })