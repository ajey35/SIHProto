"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IndianMap } from "@/components/map/indian-map"
import { mockProposals, mockCarbonCredits, blueEcosystems } from "@/lib/mock-data"
import {
  LogOut,
  Users,
  MapPin,
  FileText,
  Coins,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  Activity,
  Shield,
  Wallet,
  X,
  Check,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface NCCRAdminDashboardProps {
  user: User
  onLogout: () => void
}

export function NCCRAdminDashboard({ user, onLogout }: NCCRAdminDashboardProps) {
  const [selectedEcosystem, setSelectedEcosystem] = useState<(typeof blueEcosystems)[0] | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<(typeof mockProposals)[0] | null>(null)
  const [issuanceDialog, setIssuanceDialog] = useState(false)
  const [proposalStatuses, setProposalStatuses] = useState<Record<string, string>>({})
  const [newIssuance, setNewIssuance] = useState({
    projectId: "",
    verifiedCO2: "",
    pricePerCredit: "",
    description: "",
  })

  const stats = {
    totalEcosystems: blueEcosystems.length,
    totalCarbonStock: blueEcosystems.reduce((sum, eco) => sum + eco.carbonStock, 0),
    activeProjects: mockProposals.length,
    issuedCredits: mockCarbonCredits.reduce((sum, credit) => sum + credit.totalCO2, 0),
    pendingVerifications: mockProposals.filter(
      (p) => proposalStatuses[p.id] !== "APPROVED" && proposalStatuses[p.id] !== "REJECTED",
    ).length,
    registeredUsers: 25,
    totalRevenue: mockCarbonCredits.reduce((sum, credit) => sum + credit.totalCO2 * credit.pricePerCredit, 0),
    retiredCredits: mockCarbonCredits.reduce((sum, credit) => sum + (credit.totalCO2 - credit.availableCredits), 0),
  }

  const handleApproveProposal = (proposalId: string, proposalName: string) => {
    console.log(`[v0] Approving proposal ${proposalId}`)
    setProposalStatuses((prev) => ({ ...prev, [proposalId]: "APPROVED" }))
    toast({
      title: "Proposal Approved",
      description: `${proposalName} has been approved successfully.`,
    })
  }

  const handleRejectProposal = (proposalId: string, proposalName: string) => {
    console.log(`[v0] Rejecting proposal ${proposalId}`)
    setProposalStatuses((prev) => ({ ...prev, [proposalId]: "REJECTED" }))
    toast({
      title: "Proposal Rejected",
      description: `${proposalName} has been rejected.`,
      variant: "destructive",
    })
  }

  const handleRequestChanges = (proposalId: string, proposalName: string) => {
    console.log(`[v0] Requesting changes for proposal ${proposalId}`)
    setProposalStatuses((prev) => ({ ...prev, [proposalId]: "CHANGES_REQUESTED" }))
    toast({
      title: "Changes Requested",
      description: `Changes have been requested for ${proposalName}.`,
    })
  }

  const handleIssueCredits = () => {
    console.log("[v0] Issuing new carbon credits:", newIssuance)
    toast({
      title: "Credits Issued",
      description: `${newIssuance.verifiedCO2} tCO₂ credits have been issued for project ${newIssuance.projectId}.`,
    })
    setIssuanceDialog(false)
    setNewIssuance({ projectId: "", verifiedCO2: "", pricePerCredit: "", description: "" })
  }

  const getProposalStatus = (proposalId: string, originalStatus: string) => {
    return proposalStatuses[proposalId] || originalStatus
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "REJECTED":
        return "destructive"
      case "CHANGES_REQUESTED":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">NCCR Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">National Centre for Coastal Research</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right flex-1 sm:flex-none">
                <p className="font-medium text-sm sm:text-base">{user.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={onLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4 mb-6">
          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalEcosystems}</p>
                  <p className="text-xs text-muted-foreground">Blue Ecosystems</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalCarbonStock.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Carbon Stock (tCO₂)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.activeProjects}</p>
                  <p className="text-xs text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.issuedCredits.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Issued Credits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.pendingVerifications}</p>
                  <p className="text-xs text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.registeredUsers}</p>
                  <p className="text-xs text-muted-foreground">Registered Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.retiredCredits.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Retired Credits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto p-1">
            <TabsTrigger value="map" className="text-xs sm:text-sm px-2 py-2">
              <MapPin className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Ecosystem Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="proposals" className="text-xs sm:text-sm px-2 py-2">
              <FileText className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Proposals ({stats.pendingVerifications})</span>
              <span className="sm:hidden">Proposals</span>
            </TabsTrigger>
            <TabsTrigger value="credits" className="text-xs sm:text-sm px-2 py-2">
              <Coins className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Carbon Credits</span>
              <span className="sm:hidden">Credits</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm px-2 py-2">
              <Users className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">User Management</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2">
              <BarChart3 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Blue Carbon Ecosystems of India</CardTitle>
                <CardDescription>
                  Interactive map showing all registered blue carbon ecosystems and their carbon stock potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] sm:h-[600px] w-full">
                  <IndianMap onEcosystemSelect={setSelectedEcosystem} className="h-full w-full" />
                </div>
              </CardContent>
            </Card>

            {selectedEcosystem && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">{selectedEcosystem.name} - Detailed Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm sm:text-base">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">State:</span>
                          <span>{selectedEcosystem.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{selectedEcosystem.ecosystemType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="default">{selectedEcosystem.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm sm:text-base">Carbon Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span>{selectedEcosystem.area} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Carbon Stock:</span>
                          <span>{selectedEcosystem.carbonStock} tCO₂</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Density:</span>
                          <span>{(selectedEcosystem.carbonStock / selectedEcosystem.area).toFixed(1)} tCO₂/km²</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm sm:text-base">Actions</h4>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Projects
                        </Button>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
            <Card className="animate-slide-up">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Pending Proposals</CardTitle>
                    <CardDescription>Review and approve restoration project proposals</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProposals.map((proposal) => {
                    const currentStatus = getProposalStatus(proposal.id, proposal.status)
                    return (
                      <div
                        key={proposal.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base">{proposal.ngoName}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Proposal ID: {proposal.proposalId}
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-xs">
                            {currentStatus.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground text-xs">Expected CO₂:</span>
                            <p className="font-medium">{proposal.expectedCO2} tCO₂</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Budget:</span>
                            <p className="font-medium">₹{proposal.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Species:</span>
                            <p className="font-medium">{proposal.species.slice(0, 2).join(", ")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Duration:</span>
                            <p className="font-medium">2 years</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Proposal Details - {proposal.ngoName}</DialogTitle>
                                <DialogDescription>Complete proposal information and documentation</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Expected CO₂ Sequestration</Label>
                                    <p className="text-lg font-semibold">{proposal.expectedCO2} tCO₂</p>
                                  </div>
                                  <div>
                                    <Label>Project Budget</Label>
                                    <p className="text-lg font-semibold">₹{proposal.budget.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Species to be Planted</Label>
                                  <p className="mt-1">{proposal.species.join(", ")}</p>
                                </div>
                                <div>
                                  <Label>Project Timeline</Label>
                                  <p className="mt-1">
                                    {new Date(proposal.timeline.start).toLocaleDateString()} -
                                    {new Date(proposal.timeline.end).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApproveProposal(proposal.id, proposal.ngoName)}
                                    disabled={currentStatus === "APPROVED"}
                                    className="w-full sm:w-auto"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleRequestChanges(proposal.id, proposal.ngoName)}
                                    disabled={currentStatus === "APPROVED" || currentStatus === "REJECTED"}
                                    className="w-full sm:w-auto"
                                  >
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Request Changes
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRejectProposal(proposal.id, proposal.ngoName)}
                                    disabled={currentStatus === "REJECTED"}
                                    className="w-full sm:w-auto"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {currentStatus === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveProposal(proposal.id, proposal.ngoName)}
                                className="w-full sm:w-auto"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestChanges(proposal.id, proposal.ngoName)}
                                className="w-full sm:w-auto"
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Changes
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectProposal(proposal.id, proposal.ngoName)}
                                className="w-full sm:w-auto"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Carbon Credits Management</CardTitle>
                    <CardDescription>Monitor and manage issued carbon credits</CardDescription>
                  </div>
                  <Dialog open={issuanceDialog} onOpenChange={setIssuanceDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Issue New Credits
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Issue New Carbon Credits</DialogTitle>
                        <DialogDescription>Create new carbon credits from verified project data</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="projectId">Project ID</Label>
                          <Input
                            id="projectId"
                            value={newIssuance.projectId}
                            onChange={(e) => setNewIssuance((prev) => ({ ...prev, projectId: e.target.value }))}
                            placeholder="proj-011"
                          />
                        </div>
                        <div>
                          <Label htmlFor="verifiedCO2">Verified CO₂ (tCO₂)</Label>
                          <Input
                            id="verifiedCO2"
                            type="number"
                            value={newIssuance.verifiedCO2}
                            onChange={(e) => setNewIssuance((prev) => ({ ...prev, verifiedCO2: e.target.value }))}
                            placeholder="150.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pricePerCredit">Price per Credit (₹)</Label>
                          <Input
                            id="pricePerCredit"
                            type="number"
                            value={newIssuance.pricePerCredit}
                            onChange={(e) => setNewIssuance((prev) => ({ ...prev, pricePerCredit: e.target.value }))}
                            placeholder="25"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newIssuance.description}
                            onChange={(e) => setNewIssuance((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Mangrove restoration project in Sundarbans..."
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleIssueCredits}>Issue Credits</Button>
                          <Button variant="outline" onClick={() => setIssuanceDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCarbonCredits.map((credit) => (
                    <div key={credit.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Project {credit.projectId}</h4>
                        <Badge variant={credit.status === "ISSUED" ? "default" : "secondary"}>{credit.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total CO₂:</span>
                          <p className="font-medium">{credit.totalCO2} tCO₂</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Available:</span>
                          <p className="font-medium">{credit.availableCredits} tCO₂</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p className="font-medium">₹{credit.pricePerCredit}/tCO₂</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Verified:</span>
                          <p className="font-medium">{new Date(credit.verificationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">NFT ID:</span>
                          <p className="font-medium text-xs">{credit.nftId}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View NFT
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users and their verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input placeholder="Search users..." />
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="ngo">NGOs</SelectItem>
                        <SelectItem value="panchayat">Panchayats</SelectItem>
                        <SelectItem value="verifier">Verifiers</SelectItem>
                        <SelectItem value="buyer">Buyers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed user management interface</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Features: User verification, role management, DID issuance, wallet binding
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Sequestration Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Success Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Success metrics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Health & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">System Security</p>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">API Health</p>
                    <p className="text-sm text-muted-foreground">99.9% uptime</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Wallet className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold">Blockchain Status</p>
                    <p className="text-sm text-muted-foreground">Solana network healthy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
