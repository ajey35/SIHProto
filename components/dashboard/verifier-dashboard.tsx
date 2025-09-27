"use client"

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
import { Progress } from "@/components/ui/progress"
import {
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Camera,
  Leaf,
  TrendingUp,
  Download,
  Upload,
  Clock,
} from "lucide-react"

interface VerifierDashboardProps {
  user: User
  onLogout: () => void
  currentTab?: string
}

interface VerificationTask {
  id: string
  type: "BASELINE" | "MONITORING" | "FINAL"
  projectId: string
  projectName: string
  ngoName: string
  parcelId: string
  submittedAt: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED"
  aiScore: number
  documents: string[]
  images: string[]
}

const mockVerificationTasks: VerificationTask[] = [
  {
    id: "1",
    type: "BASELINE",
    projectId: "proj-007",
    projectName: "Sundarbans Mangrove Restoration",
    ngoName: "Green Earth Foundation",
    parcelId: "parcel-001",
    submittedAt: "2024-03-20T09:00:00Z",
    priority: "HIGH",
    status: "PENDING",
    aiScore: 85,
    documents: ["baseline-report.pdf", "soil-analysis.pdf"],
    images: ["site-photo-1.jpg", "site-photo-2.jpg", "drone-survey.jpg"],
  },
  {
    id: "2",
    type: "MONITORING",
    projectId: "proj-008",
    projectName: "Pichavaram Restoration Phase 2",
    ngoName: "Coastal Conservation Trust",
    parcelId: "parcel-002",
    submittedAt: "2024-03-18T14:30:00Z",
    priority: "MEDIUM",
    status: "IN_REVIEW",
    aiScore: 92,
    documents: ["monitoring-report-q1.pdf", "growth-measurements.xlsx"],
    images: ["progress-photo-1.jpg", "progress-photo-2.jpg"],
  },
  {
    id: "3",
    type: "FINAL",
    projectId: "proj-006",
    projectName: "Chilika Wetland Restoration",
    ngoName: "Blue Planet Initiative",
    parcelId: "parcel-003",
    submittedAt: "2024-03-15T11:15:00Z",
    priority: "HIGH",
    status: "VERIFIED",
    aiScore: 88,
    documents: ["final-report.pdf", "carbon-assessment.pdf"],
    images: ["final-survey-1.jpg", "final-survey-2.jpg"],
  },
]

export function VerifierDashboard({ user, onLogout, currentTab = "map" }: VerifierDashboardProps) {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [verificationDecision, setVerificationDecision] = useState<"APPROVE" | "REJECT" | "REQUEST_CHANGES" | null>(
    null,
  )

  const stats = {
    pendingTasks: mockVerificationTasks.filter((t) => t.status === "PENDING").length,
    inReview: mockVerificationTasks.filter((t) => t.status === "IN_REVIEW").length,
    completedToday: mockVerificationTasks.filter((t) => t.status === "VERIFIED").length,
    avgAiScore: Math.round(mockVerificationTasks.reduce((sum, t) => sum + t.aiScore, 0) / mockVerificationTasks.length),
  }

  const handleStartVerification = (task: VerificationTask) => {
    setSelectedTask(task)
    setShowVerificationDialog(true)
    setVerificationNotes("")
    setVerificationDecision(null)
  }

  const handleSubmitVerification = () => {
    if (selectedTask && verificationDecision) {
      console.log("[v0] Submitting verification:", {
        taskId: selectedTask.id,
        decision: verificationDecision,
        notes: verificationNotes,
      })
      setShowVerificationDialog(false)
      setSelectedTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600"
      case "MEDIUM":
        return "text-orange-600"
      case "LOW":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary"
      case "IN_REVIEW":
        return "default"
      case "VERIFIED":
        return "outline"
      case "REJECTED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Verifier Dashboard</h1>
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
            <TabsTrigger value="queue">Verification Queue</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Review</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
                  <p className="text-xs text-muted-foreground">Currently reviewing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                  <p className="text-xs text-muted-foreground">Verified today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg AI Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.avgAiScore}%</div>
                  <p className="text-xs text-muted-foreground">AI confidence</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Verification Queue</h2>
                <p className="text-muted-foreground">Review and verify project submissions</p>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockVerificationTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{task.projectName}</CardTitle>
                        <CardDescription>{task.ngoName}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-muted-foreground">{task.type.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Parcel</p>
                        <p className="text-muted-foreground">{task.parcelId}</p>
                      </div>
                      <div>
                        <p className="font-medium">Submitted</p>
                        <p className="text-muted-foreground">{new Date(task.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">AI Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={task.aiScore} className="flex-1" />
                          <span className="text-muted-foreground">{task.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{task.documents.length} docs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        <span>{task.images.length} images</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStartVerification(task)}
                        disabled={task.status === "VERIFIED"}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {task.status === "VERIFIED" ? "Completed" : "Review"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Verification Analytics</h2>
              <p className="text-muted-foreground">Performance metrics and insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Performance</CardTitle>
                  <CardDescription>Your verification statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tasks Completed This Month</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Review Time</span>
                    <span className="font-bold">2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy Rate</span>
                    <span className="font-bold">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Agreement Rate</span>
                    <span className="font-bold">89.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Types Distribution</CardTitle>
                  <CardDescription>Breakdown by verification type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Baseline Verifications</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monitoring Reports</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Final Assessments</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                  <CardDescription>Data quality and compliance scores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <p className="text-sm text-muted-foreground">Data Completeness</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">91%</div>
                      <p className="text-sm text-muted-foreground">MRV Compliance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">88%</div>
                      <p className="text-sm text-muted-foreground">Photo Quality</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">92%</div>
                      <p className="text-sm text-muted-foreground">Documentation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Trends</CardTitle>
                  <CardDescription>Verification trends and patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Increased Monitoring Submissions</p>
                      <p className="text-sm text-muted-foreground">+23% this month</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Improved AI Accuracy</p>
                      <p className="text-sm text-muted-foreground">+5% accuracy gain</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Faster Review Times</p>
                      <p className="text-sm text-muted-foreground">-0.8 hours average</p>
                    </div>
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Verification History</h2>
              <p className="text-muted-foreground">Complete record of your verification activities</p>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Review Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVerificationTasks
                    .filter((t) => t.status === "VERIFIED")
                    .map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{new Date(task.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{task.projectName}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>{task.ngoName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Approved</Badge>
                        </TableCell>
                        <TableCell>{task.aiScore}%</TableCell>
                        <TableCell>2.1 hours</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">AI Verification Tools</h2>
              <p className="text-muted-foreground">Advanced tools to assist with verification</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image Analysis</CardTitle>
                  <CardDescription>AI-powered image verification and analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload images for AI analysis</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Analysis Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Species identification and counting</li>
                      <li>• Growth rate assessment</li>
                      <li>• Health condition analysis</li>
                      <li>• Temporal change detection</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Verification</CardTitle>
                  <CardDescription>Automated document analysis and validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload documents for verification</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Verification Checks:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Data consistency validation</li>
                      <li>• Calculation accuracy check</li>
                      <li>• Format compliance review</li>
                      <li>• Cross-reference verification</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carbon Calculation Validator</CardTitle>
                  <CardDescription>Verify carbon sequestration calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Area (hectares)</Label>
                      <Input type="number" placeholder="12.5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species">Species Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avicennia">Avicennia marina</SelectItem>
                          <SelectItem value="rhizophora">Rhizophora mucronata</SelectItem>
                          <SelectItem value="mixed">Mixed species</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Plantation Age (years)</Label>
                    <Input type="number" placeholder="2" />
                  </div>
                  <Button className="w-full">
                    <Leaf className="h-4 w-4 mr-2" />
                    Calculate Expected CO₂
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Checker</CardTitle>
                  <CardDescription>Verify MRV standard compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Baseline Data Complete</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monitoring Schedule Met</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Photo Documentation</span>
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Third-party Validation</span>
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Compliance Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Verification Review</DialogTitle>
              <DialogDescription>Review and verify: {selectedTask?.projectName}</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Project Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Project:</span>
                          <span>{selectedTask.projectName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NGO:</span>
                          <span>{selectedTask.ngoName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{selectedTask.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parcel:</span>
                          <span>{selectedTask.parcelId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">AI Score:</span>
                          <span>{selectedTask.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Documents</h3>
                      <div className="space-y-2">
                        {selectedTask.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{doc}</span>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Images</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTask.images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                          >
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">AI Analysis</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Data Quality:</span>
                          <Badge variant="outline">Excellent</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Completeness:</span>
                          <Badge variant="outline">95%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Anomalies:</span>
                          <Badge variant="outline">None detected</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-decision">Verification Decision</Label>
                    <Select onValueChange={(value) => setVerificationDecision(value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select decision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVE">Approve</SelectItem>
                        <SelectItem value="REQUEST_CHANGES">Request Changes</SelectItem>
                        <SelectItem value="REJECT">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verification-notes">Verification Notes</Label>
                    <Textarea
                      placeholder="Add your verification notes, observations, and recommendations..."
                      rows={4}
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitVerification} disabled={!verificationDecision}>
                    Submit Verification
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
