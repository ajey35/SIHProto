export interface LandParcel {
  id: string
  parcelId: string
  panchayatId: string
  panchayatName: string
  geojson: any
  area: number
  soilType: string
  currentLandUse: string
  photos: string[]
  cadastralId: string
  status: "AVAILABLE" | "RESERVED" | "ALLOCATED" | "RECLAIMED"
  createdAt: string
  state: string
  district: string
}

export interface Proposal {
  id: string
  proposalId: string
  parcelId: string
  ngoId: string
  ngoName: string
  species: string[]
  expectedCO2: number
  budget: number
  timeline: {
    start: string
    end: string
  }
  status: "PENDING" | "REVISION_REQUESTED" | "ACCEPTED" | "REJECTED"
  submittedAt: string
  attachments: string[]
}

export interface CarbonCredit {
  id: string
  projectId: string
  totalCO2: number
  availableCredits: number
  pricePerCredit: number
  verificationDate: string
  nftId?: string
  status: "ISSUED" | "PARTIALLY_RETIRED" | "FULLY_RETIRED"
}

// Mock Indian states and blue carbon ecosystems
export const blueEcosystems = [
  {
    id: "1",
    name: "Sundarbans Mangrove Forest",
    state: "West Bengal",
    coordinates: [88.4, 21.9],
    area: 4262,
    carbonStock: 15600,
    ecosystemType: "Mangrove",
    status: "Active",
  },
  {
    id: "2",
    name: "Pichavaram Mangrove",
    state: "Tamil Nadu",
    coordinates: [79.8, 11.4],
    area: 1100,
    carbonStock: 4200,
    ecosystemType: "Mangrove",
    status: "Active",
  },
  {
    id: "3",
    name: "Bhitarkanika Mangroves",
    state: "Odisha",
    coordinates: [86.9, 20.7],
    area: 672,
    carbonStock: 2800,
    ecosystemType: "Mangrove",
    status: "Active",
  },
  {
    id: "4",
    name: "Coringa Wildlife Sanctuary",
    state: "Andhra Pradesh",
    coordinates: [82.2, 16.8],
    area: 235,
    carbonStock: 980,
    ecosystemType: "Mangrove",
    status: "Active",
  },
  {
    id: "5",
    name: "Chilika Lake",
    state: "Odisha",
    coordinates: [85.3, 19.7],
    area: 1165,
    carbonStock: 3200,
    ecosystemType: "Coastal Wetland",
    status: "Active",
  },
]

export const mockLandParcels: LandParcel[] = [
  {
    id: "1",
    parcelId: "parcel-001",
    panchayatId: "3",
    panchayatName: "Coastal Village Panchayat",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [88.4, 21.9],
          [88.41, 21.9],
          [88.41, 21.91],
          [88.4, 21.91],
          [88.4, 21.9],
        ],
      ],
    },
    area: 12000,
    soilType: "Sandy loam",
    currentLandUse: "Barren coastal land",
    photos: ["/coastal-land.jpg"],
    cadastralId: "WB-SUN-12345",
    status: "AVAILABLE",
    createdAt: "2024-03-01T10:00:00Z",
    state: "West Bengal",
    district: "South 24 Parganas",
  },
  {
    id: "2",
    parcelId: "parcel-002",
    panchayatId: "3",
    panchayatName: "Coastal Village Panchayat",
    geojson: {
      type: "Polygon",
      coordinates: [
        [
          [79.8, 11.4],
          [79.81, 11.4],
          [79.81, 11.41],
          [79.8, 11.41],
          [79.8, 11.4],
        ],
      ],
    },
    area: 8500,
    soilType: "Clay",
    currentLandUse: "Degraded mangrove area",
    photos: ["/degraded-mangrove.jpg"],
    cadastralId: "TN-PIC-67890",
    status: "RESERVED",
    createdAt: "2024-03-15T14:30:00Z",
    state: "Tamil Nadu",
    district: "Cuddalore",
  },
]

export const mockProposals: Proposal[] = [
  {
    id: "1",
    proposalId: "prop-007",
    parcelId: "parcel-001",
    ngoId: "2",
    ngoName: "Green Earth Foundation",
    species: ["Avicennia marina", "Rhizophora mucronata"],
    expectedCO2: 120.5,
    budget: 250000,
    timeline: {
      start: "2024-04-01",
      end: "2026-04-01",
    },
    status: "PENDING",
    submittedAt: "2024-03-20T09:00:00Z",
    attachments: ["/project-plan.png"],
  },
]

export const mockCarbonCredits: CarbonCredit[] = [
  {
    id: "1",
    projectId: "proj-009",
    totalCO2: 120.0,
    availableCredits: 95.5,
    pricePerCredit: 25,
    verificationDate: "2024-02-01T00:00:00Z",
    nftId: "nft-carbon-001",
    status: "PARTIALLY_RETIRED",
  },
  {
    id: "2",
    projectId: "proj-010",
    totalCO2: 85.3,
    availableCredits: 85.3,
    pricePerCredit: 22,
    verificationDate: "2024-03-15T00:00:00Z",
    nftId: "nft-carbon-002",
    status: "ISSUED",
  },
]
