'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Sun, Moon, Star, Tag, X, Plus, Minus, Check, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTheme } from 'next-themes'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  description?: string
  isBestSeller: boolean
  isPromo: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface BuyerInfo {
  name: string
  address: string
  phone: string
  email?: string
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    address: '',
    phone: '',
    email: ''
  })
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } else {
        console.error('Failed to fetch products:', response.status)
        // Use fallback data if API fails
        getFallbackData()
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use fallback data if API fails
      getFallbackData()
    }
  }

  const getFallbackData = () => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Gaming Pro',
        brand: 'TechMaster',
        price: 15000000,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        description: 'Laptop gaming high performance dengan RTX 4070',
        isBestSeller: true,
        isPromo: false
      },
      {
        id: '2',
        name: 'Smartphone Premium',
        brand: 'MobileTech',
        price: 8000000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
        description: 'Smartphone flagship dengan kamera terbaik',
        isBestSeller: true,
        isPromo: true
      },
      {
        id: '3',
        name: 'Headphone Wireless',
        brand: 'AudioPro',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        description: 'Headphone noise cancelling premium',
        isBestSeller: false,
        isPromo: true
      },
      {
        id: '4',
        name: 'Smartwatch Sport',
        brand: 'TimeTech',
        price: 3500000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        description: 'Smartwatch untuk olahraga dan fitness',
        isBestSeller: false,
        isPromo: false
      },
      {
        id: '5',
        name: 'Tablet Pro',
        brand: 'TechMaster',
        price: 12000000,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
        description: 'Tablet profesional untuk produktivitas',
        isBestSeller: true,
        isPromo: false
      },
      {
        id: '6',
        name: 'Camera Mirrorless',
        brand: 'PhotoPro',
        price: 18000000,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
        description: 'Kamera mirrorless 4K profesional',
        isBestSeller: false,
        isPromo: true
      }
    ]
    setProducts(sampleProducts)
    setFilteredProducts(sampleProducts)
  }

  // Filter products
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBrand && selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedBrand, products])

  // Get unique brands
  const brands = Array.from(new Set(products.map(p => p.brand)))

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleOrderSubmit = async () => {
    if (!buyerInfo.name || !buyerInfo.address || !buyerInfo.phone) {
      alert('Mohon lengkapi data diri Anda')
      return
    }

    if (cart.length === 0) {
      alert('Keranjang belanja kosong')
      return
    }

    setLoading(true)
    
    try {
      const orderData = {
        buyerName: buyerInfo.name,
        address: buyerInfo.address,
        phone: buyerInfo.phone,
        email: buyerInfo.email,
        orderItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingCost: 0 // You can calculate shipping cost based on location
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderSuccess(true)
        setCart([])
        setBuyerInfo({ name: '', address: '', phone: '', email: '' })
        setIsOrderDialogOpen(false)
        
        // Show success message with order ID
        alert(`Pesanan berhasil! Order ID: ${order.orderId}`)
        
        setTimeout(() => {
          setOrderSuccess(false)
        }, 3000)
      } else {
        const error = await response.json()
        alert(`Gagal membuat pesanan: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                ZonaLapak
              </h1>
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">Toko Online Management System</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Admin Button - Hidden on small mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/admin'}
                className="hidden sm:flex text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>

              {/* Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative h-8 w-8 sm:h-9 sm:w-9 p-0 sm:p-2">
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Keranjang Belanja</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Keranjang kosong</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                          </div>
                          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white">
                                Checkout
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Form Pemesanan</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="name">Nama Lengkap *</Label>
                                  <Input
                                    id="name"
                                    value={buyerInfo.name}
                                    onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                                    placeholder="Masukkan nama lengkap"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="phone">Telepon *</Label>
                                  <Input
                                    id="phone"
                                    value={buyerInfo.phone}
                                    onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                                    placeholder="Masukkan nomor telepon"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="address">Alamat Pengiriman *</Label>
                                  <Textarea
                                    id="address"
                                    value={buyerInfo.address}
                                    onChange={(e) => setBuyerInfo({...buyerInfo, address: e.target.value})}
                                    placeholder="Masukkan alamat lengkap"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="email">Email (opsional)</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={buyerInfo.email}
                                    onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                                    placeholder="Masukkan email"
                                  />
                                </div>
                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold">Total Biaya:</span>
                                    <span className="font-bold text-lg">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                  </div>
                                  <Button 
                                    onClick={handleOrderSubmit} 
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white"
                                  >
                                    {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-blue-600 to-red-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">Selamat Datang di ZonaLapak</h2>
            <p className="text-sm sm:text-base lg:text-xl opacity-90">Temukan produk terbaik dengan harga terjangkau</p>
          </div>

          {/* Best Sellers & Promos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <h3 className="text-xl sm:text-2xl font-semibold">Best Seller</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {products.filter(p => p.isBestSeller).slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-lg p-2 sm:p-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{product.name}</h4>
                      <p className="text-xs sm:text-sm opacity-90">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <Tag className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <h3 className="text-xl sm:text-2xl font-semibold">Promo Spesial</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {products.filter(p => p.isPromo).slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-lg p-2 sm:p-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{product.name}</h4>
                      <p className="text-xs sm:text-sm opacity-90">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">Promo</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk atau brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm sm:text-base"
              />
            </div>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full sm:w-48 h-10 text-sm sm:text-base">
                <SelectValue placeholder="Filter Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Brand</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 sm:py-8 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Katalog Produk</h3>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">Tidak ada produk yang ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-32 sm:h-40 md:h-48 object-cover"
                      />
                      {product.isBestSeller && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-xs px-2 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Best Seller</span>
                          <span className="sm:hidden">BS</span>
                        </Badge>
                      )}
                      {product.isPromo && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-xs px-2 py-1">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Promo</span>
                          <span className="sm:hidden">Sale</span>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">{product.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.brand}</p>
                    {product.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{product.description}</p>
                    )}
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </CardContent>
                  <CardFooter className="p-3 sm:p-4 pt-0">
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Tambah ke Keranjang</span>
                      <span className="sm:hidden">+ Keranjang</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Message */}
      {orderSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-green-500 text-white border-green-600">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Pesanan berhasil dibuat! Kami akan menghubungi Anda segera.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}