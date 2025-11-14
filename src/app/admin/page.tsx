'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Menu, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  createdAt: string
  updatedAt: string
}

interface Order {
  id: string
  orderId: string
  buyerId: string
  shippingCost: number
  totalCost: number
  status: 'CONFIRMED' | 'ON_PROCESS' | 'DELIVERED'
  createdAt: string
  updatedAt: string
  buyer: {
    name: string
    address: string
    phone: string
    email?: string
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
      brand: string
    }
  }[]
}

interface Buyer {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  createdAt: string
  orders: Order[]
}

export default function AdminDashboard() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    isBestSeller: false,
    isPromo: false
  })
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Fetch data
  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchBuyers()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchBuyers = async () => {
    try {
      const response = await fetch('/api/buyers')
      if (response.ok) {
        const data = await response.json()
        setBuyers(data)
      }
    } catch (error) {
      console.error('Error fetching buyers:', error)
    }
  }

  // Product management
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.brand || !productForm.price) {
      alert('Mohon lengkapi data produk')
      return
    }

    setLoading(true)
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price)
        }),
      })

      if (response.ok) {
        await fetchProducts()
        setProductForm({
          name: '',
          brand: '',
          price: '',
          image: '',
          description: '',
          isBestSeller: false,
          isPromo: false
        })
        setEditingProduct(null)
        setIsProductDialogOpen(false)
        alert(editingProduct ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan')
      } else {
        const error = await response.json()
        alert(`Gagal menyimpan produk: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Terjadi kesalahan saat menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      image: product.image,
      description: product.description || '',
      isBestSeller: product.isBestSeller,
      isPromo: product.isPromo
    })
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProducts()
        alert('Produk berhasil dihapus')
      } else {
        const error = await response.json()
        alert(`Gagal menghapus produk: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Terjadi kesalahan saat menghapus produk')
    }
  }

  // Order management
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchOrders()
        alert('Status pesanan berhasil diperbarui')
      } else {
        const error = await response.json()
        alert(`Gagal memperbarui status: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Terjadi kesalahan saat memperbarui status')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) return

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchOrders()
        alert('Pesanan berhasil dihapus')
      } else {
        const error = await response.json()
        alert(`Gagal menghapus pesanan: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Terjadi kesalahan saat menghapus pesanan')
    }
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalCost, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalBuyers = buyers.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-500'
      case 'ON_PROCESS': return 'bg-yellow-500'
      case 'DELIVERED': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />
      case 'ON_PROCESS': return <Clock className="h-4 w-4" />
      case 'DELIVERED': return <Truck className="h-4 w-4" />
      default: return null
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h1 className={`font-bold text-lg lg:text-xl bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent ${!sidebarOpen && 'hidden'}`}>
              ZonaLapak Admin
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <nav className="space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className={`w-full justify-start ${!sidebarOpen && 'px-2'} h-10 lg:h-9`}
              onClick={() => {
                setActiveTab('dashboard')
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            >
              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              {sidebarOpen && <span className="hidden lg:inline">Dashboard</span>}
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className={`w-full justify-start ${!sidebarOpen && 'px-2'} h-10 lg:h-9`}
              onClick={() => {
                setActiveTab('products')
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            >
              <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              {sidebarOpen && <span className="hidden lg:inline">Produk</span>}
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className={`w-full justify-start ${!sidebarOpen && 'px-2'} h-10 lg:h-9`}
              onClick={() => {
                setActiveTab('orders')
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            >
              <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              {sidebarOpen && <span className="hidden lg:inline">Pesanan</span>}
            </Button>
            <Button
              variant={activeTab === 'buyers' ? 'default' : 'ghost'}
              className={`w-full justify-start ${!sidebarOpen && 'px-2'} h-10 lg:h-9`}
              onClick={() => {
                setActiveTab('buyers')
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            >
              <Users className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              {sidebarOpen && <span className="hidden lg:inline">Pembeli</span>}
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-6">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Pendapatan</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="text-lg sm:text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Pesanan</CardTitle>
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Produk</CardTitle>
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="text-lg sm:text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Pembeli</CardTitle>
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="text-lg sm:text-2xl font-bold">{totalBuyers}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{order.orderId}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{order.buyer.name}</p>
                      </div>
                      <div className="flex sm:flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 hidden sm:inline">{order.status}</span>
                          <span className="sm:hidden ml-1">
                            {order.status === 'CONFIRMED' ? '✓' : order.status === 'ON_PROCESS' ? '⏳' : '🚚'}
                          </span>
                        </Badge>
                        <p className="text-sm font-medium">Rp {order.totalCost.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Manajemen Produk</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Masukkan nama produk"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        placeholder="Masukkan brand"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Harga</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="Masukkan harga"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">URL Image</Label>
                      <Input
                        id="image"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="Masukkan URL image"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Masukkan deskripsi produk"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={productForm.isBestSeller}
                          onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})}
                        />
                        <span>Best Seller</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={productForm.isPromo}
                          onChange={(e) => setProductForm({...productForm, isPromo: e.target.checked})}
                        />
                        <span>Promo</span>
                      </label>
                    </div>
                    <Button 
                      onClick={handleSaveProduct} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Produk'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map(product => (
                <Card key={product.id}>
                  <CardHeader className="p-3 sm:p-6">
                    <div className="relative">
                      <img 
                        src={product.image || 'https://via.placeholder.com/300x200'} 
                        alt={product.name} 
                        className="w-full h-24 sm:h-32 object-cover rounded"
                      />
                      {product.isBestSeller && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-xs">Best Seller</Badge>
                      )}
                      {product.isPromo && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-xs">Promo</Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm sm:text-base lg:text-lg mt-2 line-clamp-2">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.brand}</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">Rp {product.price.toLocaleString('id-ID')}</p>
                    {product.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 hidden sm:block">{product.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between p-3 sm:p-6 pt-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                      <span className="sm:hidden">✏️</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Hapus</span>
                      <span className="sm:hidden">🗑️</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Manajemen Pesanan</h2>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pesanan atau pembeli..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="ON_PROCESS">On Process</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.orderId}</CardTitle>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Informasi Pembeli</h4>
                        <p className="text-sm"><strong>Nama:</strong> {order.buyer.name}</p>
                        <p className="text-sm"><strong>Telepon:</strong> {order.buyer.phone}</p>
                        <p className="text-sm"><strong>Alamat:</strong> {order.buyer.address}</p>
                        {order.buyer.email && (
                          <p className="text-sm"><strong>Email:</strong> {order.buyer.email}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Detail Pesanan</h4>
                        <div className="space-y-1">
                          {order.orderItems.map(item => (
                            <div key={item.id} className="text-sm">
                              {item.product.name} ({item.brand}) - {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm"><strong>Biaya Kirim:</strong> Rp {order.shippingCost.toLocaleString('id-ID')}</p>
                          <p className="text-sm font-bold"><strong>Total:</strong> Rp {order.totalCost.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ON_PROCESS')}
                        >
                          Proses Pesanan
                        </Button>
                      )}
                      {order.status === 'ON_PROCESS' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                        >
                          Tandai Terkirim
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'buyers' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Manajemen Pembeli</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {buyers.map(buyer => (
                <Card key={buyer.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{buyer.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Telepon:</strong> {buyer.phone}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Email:</strong> {buyer.email || 'Tidak ada'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Alamat:</strong> {buyer.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Total Pesanan:</strong> {buyer.orders.length}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}