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
import { LogOut, Plus, MapPin, DollarSign, Leaf, FileText, Camera, Upload, Eye, Edit, X } from "lucide-react"
import { mockLandParcels, mockProposals, type LandParcel } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface NGODashboardProps {
  user: User
  onLogout: () => void
  currentTab?: string
}

export function NGODashboard({ user, onLogout, currentTab = "map" }: NGODashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null)
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [showBaselineDialog, setShowBaselineDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const ngoProposals = mockProposals.filter((p) => p.ngoId === user.id)
  const availableParcels = mockLandParcels.filter((p) => p.status === "AVAILABLE")

  const stats = {
    activeProjects: ngoProposals.filter((p) => p.status === "ACCEPTED").length,
    pendingProposals: ngoProposals.filter((p) => p.status === "PENDING").length,
    totalCO2Expected: ngoProposals.reduce((sum, p) => sum + p.expectedCO2, 0),
    totalBudget: ngoProposals.reduce((sum, p) => sum + p.budget, 0),
  }

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setShowProposalDialog(false)
      toast({
        title: "Proposal Submitted",
        description: "Your restoration proposal has been submitted successfully and is under review.",
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitBaseline = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setShowBaselineDialog(false)
      toast({
        title: "Baseline Data Submitted",
        description: "Your baseline environmental data has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your baseline data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="parcels" className="text-xs sm:text-sm">
                Parcels
              </TabsTrigger>
              <TabsTrigger value="proposals" className="text-xs sm:text-sm">
                Proposals
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm">
                Projects
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="text-xs sm:text-sm">
                Monitor
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">Currently implementing</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <FileText className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingProposals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Capture</CardTitle>
                  <Leaf className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCO2Expected.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Tonnes expected</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">₹{(stats.totalBudget / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Proposal submitted for Parcel-001</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Baseline data collection completed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verification requested for Project-009</p>
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
                  <Button className="w-full justify-start" onClick={() => setActiveTab("parcels")}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Browse Available Land Parcels
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setShowProposalDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Submit New Proposal
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("monitoring")}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Monitoring Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="parcels" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Available Land Parcels</h2>
                <p className="text-muted-foreground text-sm">Browse and select parcels for restoration projects</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="Search by location..." className="w-full sm:w-64" />
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {availableParcels.map((parcel) => (
                <Card
                  key={parcel.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{parcel.parcelId}</CardTitle>
                        <CardDescription className="text-sm">{parcel.panchayatName}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {parcel.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={parcel.photos[0] || "/placeholder.svg?height=200&width=300&query=coastal land parcel"}
                        alt="Land parcel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Area</p>
                        <p className="font-semibold">{(parcel.area / 1000).toFixed(1)} hectares</p>
                      </div>
                      <div>
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Soil Type</p>
                        <p className="font-semibold">{parcel.soilType}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Current Use</p>
                        <p className="font-semibold">{parcel.currentLandUse}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => setSelectedParcel(parcel)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowProposalDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Propose
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
                <h2 className="text-2xl font-bold">My Proposals</h2>
                <p className="text-muted-foreground">Track and manage your project proposals</p>
              </div>
              <Button onClick={() => setShowProposalDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal ID</TableHead>
                    <TableHead>Parcel</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Expected CO₂</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ngoProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.proposalId}</TableCell>
                      <TableCell>{proposal.parcelId}</TableCell>
                      <TableCell>{proposal.species.join(", ")}</TableCell>
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
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Active Projects</h2>
              <p className="text-muted-foreground">Monitor and manage your approved restoration projects</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ngoProposals
                .filter((p) => p.status === "ACCEPTED")
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project.proposalId}</CardTitle>
                          <CardDescription>Parcel: {project.parcelId}</CardDescription>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Timeline</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(project.timeline.start).toLocaleDateString()} -{" "}
                            {new Date(project.timeline.end).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Expected CO₂</p>
                          <p className="text-sm text-muted-foreground">{project.expectedCO2} tonnes</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Species</p>
                        <div className="flex flex-wrap gap-1">
                          {project.species.map((species, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {species}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowBaselineDialog(true)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Data
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Project Monitoring</h2>
              <p className="text-muted-foreground">Upload monitoring data and track project progress</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Monitoring Data</CardTitle>
                  <CardDescription>Submit regular monitoring reports and imagery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-select">Select Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {ngoProposals
                          .filter((p) => p.status === "ACCEPTED")
                          .map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.proposalId}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monitoring-type">Monitoring Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drone-imagery">Drone Imagery</SelectItem>
                        <SelectItem value="ground-photos">Ground Photos</SelectItem>
                        <SelectItem value="growth-measurements">Growth Measurements</SelectItem>
                        <SelectItem value="survival-rate">Survival Rate Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monitoring-date">Monitoring Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Files</Label>
                    <Input type="file" multiple accept="image/*,.pdf,.doc,.docx" />
                  </div>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Monitoring Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Your latest monitoring uploads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Drone Survey - March 2024</p>
                        <p className="text-sm text-muted-foreground">Project: prop-007</p>
                      </div>
                      <Badge variant="secondary">Submitted</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Growth Measurements</p>
                        <p className="text-sm text-muted-foreground">Project: prop-007</p>
                      </div>
                      <Badge>Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Survival Rate Assessment</p>
                        <p className="text-sm text-muted-foreground">Project: prop-007</p>
                      </div>
                      <Badge variant="outline">Under Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">Submit New Proposal</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    Create a restoration proposal for an available land parcel
                  </DialogDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowProposalDialog(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmitProposal} className="space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="parcel-select" className="text-sm font-semibold">
                      Land Parcel <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select parcel" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableParcels.map((parcel) => (
                          <SelectItem key={parcel.id} value={parcel.id}>
                            {parcel.parcelId} - {parcel.panchayatName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-sm font-semibold">
                      Budget (₹) <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" placeholder="250000" className="h-12" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="species" className="text-sm font-semibold">
                    Species to Plant <span className="text-destructive">*</span>
                  </Label>
                  <Input placeholder="e.g., Avicennia marina, Rhizophora mucronata" className="h-12" required />
                  <p className="text-xs text-muted-foreground">Enter species names separated by commas</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="start-date" className="text-sm font-semibold">
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Input type="date" className="h-12" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="end-date" className="text-sm font-semibold">
                      End Date <span className="text-destructive">*</span>
                    </Label>
                    <Input type="date" className="h-12" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="expected-co2" className="text-sm font-semibold">
                    Expected CO₂ Capture (tonnes) <span className="text-destructive">*</span>
                  </Label>
                  <Input type="number" step="0.1" placeholder="120.5" className="h-12" required />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="project-description" className="text-sm font-semibold">
                    Project Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="Describe your restoration approach, methodology, and expected outcomes..."
                    rows={6}
                    className="resize-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="attachments" className="text-sm font-semibold">
                    Project Plan & Documents
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-sm font-medium">Click to upload files</span>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProposalDialog(false)}
                  disabled={isSubmitting}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="order-1 sm:order-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Proposal"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Completely redesigned baseline dialog with better form layout and validation */}
        <Dialog open={showBaselineDialog} onOpenChange={setShowBaselineDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">Submit Baseline Data</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    Upload baseline environmental data for your project
                  </DialogDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowBaselineDialog(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmitBaseline} className="space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="project-select-baseline" className="text-sm font-semibold">
                      Project <span className="text-destructive">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {ngoProposals
                          .filter((p) => p.status === "ACCEPTED")
                          .map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.proposalId}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="soil-carbon" className="text-sm font-semibold">
                      Soil Carbon Content (%) <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" step="0.01" placeholder="2.5" className="h-12" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="ph-level" className="text-sm font-semibold">
                      pH Level <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" step="0.1" placeholder="7.2" className="h-12" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="salinity" className="text-sm font-semibold">
                      Salinity (ppt) <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" step="0.1" placeholder="15.5" className="h-12" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="water-depth" className="text-sm font-semibold">
                      Water Depth (cm) <span className="text-destructive">*</span>
                    </Label>
                    <Input type="number" placeholder="30" className="h-12" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="biodiversity" className="text-sm font-semibold">
                    Existing Biodiversity Assessment <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="Document existing flora and fauna in the area..."
                    rows={6}
                    className="resize-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="baseline-photos" className="text-sm font-semibold">
                    Baseline Photos
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <Input type="file" multiple accept="image/*" className="hidden" id="baseline-file-upload" />
                    <Label htmlFor="baseline-file-upload" className="cursor-pointer">
                      <span className="text-sm font-medium">Click to upload files</span>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB each</p>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBaselineDialog(false)}
                  disabled={isSubmitting}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="order-1 sm:order-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    "Submit Baseline Data"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
