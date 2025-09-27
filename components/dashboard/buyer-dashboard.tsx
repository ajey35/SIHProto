"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  LogOut,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Leaf,
  Shield,
  Eye,
  Download,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Award,
} from "lucide-react"
import { mockCarbonCredits, type CarbonCredit } from "@/lib/mock-data"

interface BuyerDashboardProps {
  user: User
  onLogout: () => void
  currentTab?: string
}

interface ExtendedCarbonCredit extends CarbonCredit {
  projectName: string
  ngoName: string
  location: string
  ecosystemType: string
  vintage: string
  certificationStandard: string
  rating: number
  co2PerCredit: number
}

const mockMarketplaceCredits: ExtendedCarbonCredit[] = [
  {
    ...mockCarbonCredits[0],
    projectName: "Sundarbans Mangrove Restoration",
    ngoName: "Green Earth Foundation",
    location: "West Bengal, India",
    ecosystemType: "Mangrove",
    vintage: "2024",
    certificationStandard: "VCS",
    rating: 4.8,
    co2PerCredit: 1.0,
  },
  {
    ...mockCarbonCredits[1],
    projectName: "Pichavaram Coastal Restoration",
    ngoName: "Coastal Conservation Trust",
    location: "Tamil Nadu, India",
    ecosystemType: "Mangrove",
    vintage: "2024",
    certificationStandard: "Gold Standard",
    rating: 4.6,
    co2PerCredit: 1.0,
  },
  {
    id: "3",
    projectId: "proj-011",
    totalCO2: 200.0,
    availableCredits: 200.0,
    pricePerCredit: 28,
    verificationDate: "2024-03-10T00:00:00Z",
    nftId: "nft-carbon-003",
    status: "ISSUED",
    projectName: "Chilika Lake Wetland Conservation",
    ngoName: "Blue Planet Initiative",
    location: "Odisha, India",
    ecosystemType: "Coastal Wetland",
    vintage: "2024",
    certificationStandard: "VCS",
    rating: 4.9,
    co2PerCredit: 1.0,
  },
]

export function BuyerDashboard({ user, onLogout, currentTab = "map" }: BuyerDashboardProps) {
  const [activeTab, setActiveTab] = useState("marketplace")
  const [selectedCredit, setSelectedCredit] = useState<ExtendedCarbonCredit | null>(null)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [showWalletDialog, setShowWalletDialog] = useState(false)

  const [cart, setCart] = useState<{ credit: ExtendedCarbonCredit; quantity: number }[]>([])
  const [portfolio, setPortfolio] = useState([
    {
      id: "1",
      projectName: "Bhitarkanika Mangrove Project",
      quantity: 50,
      purchasePrice: 24,
      currentPrice: 26,
      purchaseDate: "2024-02-15",
      nftId: "nft-carbon-004",
    },
  ])

  const stats = {
    totalCredits: portfolio.reduce((sum, p) => sum + p.quantity, 0),
    portfolioValue: portfolio.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0),
    totalSpent: portfolio.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.quantity * item.credit.pricePerCredit, 0),
  }

  const handleAddToCart = (credit: ExtendedCarbonCredit, quantity: number) => {
    const existingItem = cart.find((item) => item.credit.id === credit.id)
    if (existingItem) {
      setCart(
        cart.map((item) => (item.credit.id === credit.id ? { ...item, quantity: item.quantity + quantity } : item)),
      )
    } else {
      setCart([...cart, { credit, quantity }])
    }
  }

  const handlePurchase = () => {
    if (selectedCredit) {
      handleAddToCart(selectedCredit, purchaseQuantity)
      setShowPurchaseDialog(false)
      setPurchaseQuantity(1)
      setSelectedCredit(null)
    }
  }

  const handleCheckout = () => {
    // Mock checkout process
    console.log("[v0] Processing checkout:", cart)
    setCart([])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Carbon Credit Marketplace</h1>
              <p className="text-muted-foreground">{user.organization}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowWalletDialog(true)}>
                <Wallet className="h-4 w-4 mr-2" />
                Wallet
              </Button>
              <div className="relative">
                <Button variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cart.length})
                </Button>
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {mockMarketplaceCredits.reduce((sum, c) => sum + c.availableCredits, 0).toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Tonnes CO₂ equivalent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    $
                    {Math.round(
                      mockMarketplaceCredits.reduce((sum, c) => sum + c.pricePerCredit, 0) /
                        mockMarketplaceCredits.length,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Per credit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cart Total</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">${stats.cartTotal}</div>
                  <p className="text-xs text-muted-foreground">{cart.length} items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">${stats.portfolioValue}</div>
                  <p className="text-xs text-muted-foreground">{stats.totalCredits} credits owned</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Available Carbon Credits</h2>
                <p className="text-muted-foreground">Browse and purchase verified blue carbon credits</p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mangrove">Mangrove</SelectItem>
                    <SelectItem value="wetland">Coastal Wetland</SelectItem>
                    <SelectItem value="seagrass">Seagrass</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockMarketplaceCredits.map((credit) => (
                <Card key={credit.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{credit.projectName}</CardTitle>
                        <CardDescription>{credit.ngoName}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{credit.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src="/coastal-land.jpg"
                        alt="Project site"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {credit.location}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Ecosystem</p>
                        <p className="text-muted-foreground">{credit.ecosystemType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Vintage</p>
                        <p className="text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {credit.vintage}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Standard</p>
                        <Badge variant="outline">{credit.certificationStandard}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">${credit.pricePerCredit}</p>
                        <p className="text-sm text-muted-foreground">per credit</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{credit.availableCredits} available</p>
                        <p className="text-sm text-muted-foreground">tonnes CO₂</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setSelectedCredit(credit)
                          setShowPurchaseDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedCredit(credit)
                          setShowPurchaseDialog(true)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <CardDescription>Review your selected carbon credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.credit.projectName}</p>
                          <p className="text-sm text-muted-foreground">{item.credit.ngoName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.quantity} × ${item.credit.pricePerCredit} = $
                            {item.quantity * item.credit.pricePerCredit}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.quantity} tonnes CO₂</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-lg font-bold">Total: ${stats.cartTotal}</p>
                        <p className="text-sm text-muted-foreground">
                          {cart.reduce((sum, item) => sum + item.quantity, 0)} credits
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCart([])}>
                          Clear Cart
                        </Button>
                        <Button onClick={handleCheckout}>
                          <Wallet className="h-4 w-4 mr-2" />
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Carbon Credit Portfolio</h2>
              <p className="text-muted-foreground">Track and manage your carbon credit investments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Credits:</span>
                    <span className="font-bold">{stats.totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Value:</span>
                    <span className="font-bold text-green-600">${stats.portfolioValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Invested:</span>
                    <span className="font-bold">${stats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unrealized P&L:</span>
                    <span
                      className={`font-bold ${stats.portfolioValue - stats.totalSpent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ${stats.portfolioValue - stats.totalSpent >= 0 ? "+" : ""}
                      {stats.portfolioValue - stats.totalSpent}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.totalCredits}</div>
                    <p className="text-sm text-muted-foreground">Tonnes CO₂ Offset</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">3</div>
                    <p className="text-sm text-muted-foreground">Projects Supported</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">125</div>
                    <p className="text-sm text-muted-foreground">Hectares Restored</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm">All credits verified on blockchain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">NFT certificates available</span>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificates
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
                <CardDescription>Detailed view of your carbon credit holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((holding) => (
                      <TableRow key={holding.id}>
                        <TableCell className="font-medium">{holding.projectName}</TableCell>
                        <TableCell>{holding.quantity}</TableCell>
                        <TableCell>${holding.purchasePrice}</TableCell>
                        <TableCell>${holding.currentPrice}</TableCell>
                        <TableCell
                          className={
                            holding.currentPrice - holding.purchasePrice >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          ${holding.currentPrice - holding.purchasePrice >= 0 ? "+" : ""}
                          {(holding.currentPrice - holding.purchasePrice) * holding.quantity}
                        </TableCell>
                        <TableCell>{new Date(holding.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Retire
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Market Analytics</h2>
              <p className="text-muted-foreground">Carbon credit market trends and insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Trends</CardTitle>
                  <CardDescription>Carbon credit price movements over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Price chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Statistics</CardTitle>
                  <CardDescription>Key market metrics and indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$26.50</div>
                      <p className="text-sm text-muted-foreground">Avg Price</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">485</div>
                      <p className="text-sm text-muted-foreground">Credits Available</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">+8.5%</div>
                      <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ecosystem Distribution</CardTitle>
                  <CardDescription>Credits by ecosystem type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mangrove Restoration</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Coastal Wetlands</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Seagrass Meadows</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>Credits by Indian coastal states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>West Bengal</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tamil Nadu</span>
                        <span>28%</span>
                      </div>
                      <Progress value={28} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Odisha</span>
                        <span>22%</span>
                      </div>
                      <Progress value={22} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Andhra Pradesh</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="retirement" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Credit Retirement</h2>
              <p className="text-muted-foreground">Retire carbon credits to claim environmental benefits</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retire Credits</CardTitle>
                  <CardDescription>Permanently retire credits to offset your carbon footprint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retirement-project">Select Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose from your portfolio" />
                      </SelectTrigger>
                      <SelectContent>
                        {portfolio.map((holding) => (
                          <SelectItem key={holding.id} value={holding.id}>
                            {holding.projectName} ({holding.quantity} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirement-quantity">Quantity to Retire</Label>
                    <Input type="number" placeholder="10" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirement-reason">Retirement Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate-offset">Corporate Carbon Offset</SelectItem>
                        <SelectItem value="personal-offset">Personal Carbon Offset</SelectItem>
                        <SelectItem value="event-offset">Event Carbon Neutrality</SelectItem>
                        <SelectItem value="product-offset">Product Carbon Neutrality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Award className="h-4 w-4 mr-2" />
                    Retire Credits
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Retirement History</CardTitle>
                  <CardDescription>Your carbon credit retirement record</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No credits retired yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Retire credits to start building your environmental impact record
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Purchase Carbon Credits</DialogTitle>
              <DialogDescription>
                {selectedCredit?.projectName} - {selectedCredit?.ngoName}
              </DialogDescription>
            </DialogHeader>
            {selectedCredit && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src="/coastal-land.jpg"
                        alt="Project site"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Project Details</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{selectedCredit.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ecosystem:</span>
                          <span>{selectedCredit.ecosystemType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vintage:</span>
                          <span>{selectedCredit.vintage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Standard:</span>
                          <Badge variant="outline">{selectedCredit.certificationStandard}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{selectedCredit.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Purchase Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity (Credits)</Label>
                          <Input
                            type="number"
                            value={purchaseQuantity}
                            onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                            min="1"
                            max={selectedCredit.availableCredits}
                          />
                          <p className="text-sm text-muted-foreground">
                            Max: {selectedCredit.availableCredits} credits available
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Price per credit:</span>
                            <span className="font-medium">${selectedCredit.pricePerCredit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span className="font-medium">{purchaseQuantity}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${purchaseQuantity * selectedCredit.pricePerCredit}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Environmental Impact:</strong> This purchase will offset {purchaseQuantity} tonnes
                            of CO₂ equivalent and support {selectedCredit.ecosystemType.toLowerCase()} restoration in{" "}
                            {selectedCredit.location}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePurchase}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Digital Wallet</DialogTitle>
              <DialogDescription>Manage your blockchain wallet and transactions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Wallet Address</span>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$2,450</div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCredits}</div>
                  <p className="text-sm text-muted-foreground">Credits Owned</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Recent Transactions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 border rounded">
                    <span>Purchase - Bhitarkanika Project</span>
                    <span className="text-red-600">-$1,200</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 border rounded">
                    <span>Wallet Top-up</span>
                    <span className="text-green-600">+$5,000</span>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
