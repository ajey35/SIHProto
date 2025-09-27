"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LogOut,
  Plus,
  MapPin,
  FileText,
  Camera,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { mockLandParcels, mockProposals, type LandParcel } from "@/lib/mock-data"

interface PanchayatDashboardProps {
  user: User
  onLogout: () => void
  currentTab?: string
}

export function PanchayatDashboard({ user, onLogout, currentTab = "map" }: PanchayatDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddParcelDialog, setShowAddParcelDialog] = useState(false)
  const [showParcelDetailsDialog, setShowParcelDetailsDialog] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null)

  // Filter data for this panchayat
  const panchayatParcels = mockLandParcels.filter((p) => p.panchayatId === user.id)
  const panchayatProposals = mockProposals.filter((p) =>
    panchayatParcels.some((parcel) => parcel.parcelId === p.parcelId),
  )

  const stats = {
    totalParcels: panchayatParcels.length,
    availableParcels: panchayatParcels.filter((p) => p.status === "AVAILABLE").length,
    allocatedParcels: panchayatParcels.filter((p) => p.status === "ALLOCATED").length,
    pendingProposals: panchayatProposals.filter((p) => p.status === "PENDING").length,
    totalArea: panchayatParcels.reduce((sum, p) => sum + p.area, 0),
  }

  const handleAddParcel = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAddParcelDialog(false)
    // Mock submission logic
  }

  const handleApproveProposal = (proposalId: string) => {
    // Mock approval logic
    console.log("[v0] Approving proposal:", proposalId)
  }

  const handleRejectProposal = (proposalId: string) => {
    // Mock rejection logic
    console.log("[v0] Rejecting proposal:", proposalId)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Panchayat Dashboard</h1>
              <p className="text-muted-foreground">{user.organization}</p>
            </div>
            <div className="flex items-center gap-4">
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parcels">Land Parcels</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalParcels}</div>
                  <p className="text-xs text-muted-foreground">Under management</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableParcels}</div>
                  <p className="text-xs text-muted-foreground">Ready for proposals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Allocated</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.allocatedParcels}</div>
                  <p className="text-xs text-muted-foreground">In restoration</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.pendingProposals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                  <MapPin className="h-4 w-4 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600">{(stats.totalArea / 1000).toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Hectares managed</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on land parcels and proposals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New proposal received for Parcel-001</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Parcel-002 marked as allocated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Monitoring report submitted</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setShowAddParcelDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Land Parcel
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("proposals")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Review Pending Proposals
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("monitoring")}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    View Project Progress
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="parcels" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Land Parcels</h2>
                <p className="text-muted-foreground">Manage your panchayat's land parcels</p>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Search parcels..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="allocated">Allocated</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowAddParcelDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parcel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {panchayatParcels.map((parcel) => (
                <Card key={parcel.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{parcel.parcelId}</CardTitle>
                        <CardDescription>
                          {parcel.district}, {parcel.state}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          parcel.status === "AVAILABLE"
                            ? "default"
                            : parcel.status === "RESERVED"
                              ? "secondary"
                              : parcel.status === "ALLOCATED"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {parcel.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src={parcel.photos[0] || "/placeholder.svg"}
                        alt="Land parcel"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Area</p>
                        <p className="text-muted-foreground">{(parcel.area / 1000).toFixed(1)} hectares</p>
                      </div>
                      <div>
                        <p className="font-medium">Soil Type</p>
                        <p className="text-muted-foreground">{parcel.soilType}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">Current Use</p>
                        <p className="text-muted-foreground">{parcel.currentLandUse}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedParcel(parcel)
                          setShowParcelDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Restoration Proposals</h2>
                <p className="text-muted-foreground">Review and approve proposals for your land parcels</p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal ID</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Parcel</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Expected CO₂</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panchayatProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.proposalId}</TableCell>
                      <TableCell>{proposal.ngoName}</TableCell>
                      <TableCell>{proposal.parcelId}</TableCell>
                      <TableCell>{proposal.species.slice(0, 2).join(", ")}</TableCell>
                      <TableCell>{proposal.expectedCO2} tonnes</TableCell>
                      <TableCell>₹{(proposal.budget / 100000).toFixed(1)}L</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            proposal.status === "ACCEPTED"
                              ? "default"
                              : proposal.status === "PENDING"
                                ? "secondary"
                                : proposal.status === "REVISION_REQUESTED"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {proposal.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {proposal.status === "PENDING" && (
                            <>
                              <Button size="sm" variant="default" onClick={() => handleApproveProposal(proposal.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectProposal(proposal.id)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Project Monitoring</h2>
              <p className="text-muted-foreground">Track progress of restoration projects in your area</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Ongoing restoration projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {panchayatProposals
                    .filter((p) => p.status === "ACCEPTED")
                    .map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{project.proposalId}</p>
                          <p className="text-sm text-muted-foreground">NGO: {project.ngoName}</p>
                          <p className="text-sm text-muted-foreground">Parcel: {project.parcelId}</p>
                        </div>
                        <div className="text-right">
                          <Badge>Active</Badge>
                          <p className="text-sm text-muted-foreground mt-1">{project.expectedCO2} tonnes CO₂</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Monitoring Reports</CardTitle>
                  <CardDescription>Latest updates from project sites</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Drone Survey Report</p>
                        <p className="text-sm text-muted-foreground">Parcel-001 - March 2024</p>
                      </div>
                      <Badge variant="secondary">New</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Growth Assessment</p>
                        <p className="text-sm text-muted-foreground">Parcel-002 - February 2024</p>
                      </div>
                      <Badge>Reviewed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Survival Rate Report</p>
                        <p className="text-sm text-muted-foreground">Parcel-001 - January 2024</p>
                      </div>
                      <Badge variant="outline">Archived</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Track milestones and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Baseline Data Collection</p>
                      <p className="text-sm text-muted-foreground">Completed - March 1, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Site Preparation</p>
                      <p className="text-sm text-muted-foreground">Completed - March 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Plantation Phase 1</p>
                      <p className="text-sm text-muted-foreground">In Progress - Started March 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">First Monitoring Report</p>
                      <p className="text-sm text-muted-foreground">Scheduled - April 20, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showAddParcelDialog} onOpenChange={setShowAddParcelDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Land Parcel</DialogTitle>
              <DialogDescription>Register a new land parcel for potential restoration projects</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddParcel} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parcel-id">Parcel ID</Label>
                  <Input placeholder="parcel-003" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cadastral-id">Cadastral ID</Label>
                  <Input placeholder="WB-SUN-12346" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq meters)</Label>
                  <Input type="number" placeholder="12000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil-type">Soil Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                      <SelectItem value="sandy-clay">Sandy Clay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-use">Current Land Use</Label>
                <Input placeholder="Barren coastal land" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location Description</Label>
                <Textarea
                  placeholder="Detailed location description including landmarks and accessibility..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="geojson">GeoJSON Coordinates</Label>
                <Textarea placeholder='{"type": "Polygon", "coordinates": [...]}' rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">Land Photos</Label>
                <Input type="file" multiple accept="image/*" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddParcelDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Parcel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showParcelDetailsDialog} onOpenChange={setShowParcelDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Parcel Details</DialogTitle>
              <DialogDescription>Detailed information about {selectedParcel?.parcelId}</DialogDescription>
            </DialogHeader>
            {selectedParcel && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parcel ID:</span>
                          <span>{selectedParcel.parcelId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cadastral ID:</span>
                          <span>{selectedParcel.cadastralId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span>{(selectedParcel.area / 1000).toFixed(1)} hectares</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline">{selectedParcel.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Land Characteristics</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Soil Type:</span>
                          <span>{selectedParcel.soilType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Use:</span>
                          <span>{selectedParcel.currentLandUse}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>
                            {selectedParcel.district}, {selectedParcel.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Photos</h3>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <img
                          src={selectedParcel.photos[0] || "/placeholder.svg"}
                          alt="Land parcel"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowParcelDetailsDialog(false)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Parcel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
