export type UserRole = "nccr_admin" | "ngo" | "panchayat" | "verifier" | "buyer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organization?: string
  did?: string
  walletAddress?: string
  isVerified: boolean
  createdAt: string
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@nccr.gov.in",
    name: "NCCR Administrator",
    role: "nccr_admin",
    organization: "National Centre for Coastal Research",
    did: "did:sol:nccr-admin-01",
    walletAddress: "NCCRAdminWallet123...",
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "greenearth@ngo.org",
    name: "Green Earth NGO",
    role: "ngo",
    organization: "Green Earth Foundation",
    did: "did:sol:ngo-23",
    walletAddress: "NGOWallet456...",
    isVerified: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    email: "sarpanch@panchayat.gov.in",
    name: "Coastal Panchayat",
    role: "panchayat",
    organization: "Coastal Village Panchayat",
    did: "did:sol:panchayat-001",
    walletAddress: "PanchayatWallet789...",
    isVerified: true,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "4",
    email: "verifier@verification.com",
    name: "Carbon Verifier",
    role: "verifier",
    organization: "Coastal Carbon Verification Ltd",
    did: "did:sol:ver-12",
    walletAddress: "VerifierWallet012...",
    isVerified: true,
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "5",
    email: "buyer@company.com",
    name: "Carbon Credit Buyer",
    role: "buyer",
    organization: "EcoTech Solutions",
    walletAddress: "BuyerWallet345...",
    isVerified: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

// Mock authentication state
let currentUser: User | null = null

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password123") {
      currentUser = user
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
      return user
    }
    return null
  },

  logout: async (): Promise<void> => {
    currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser

    // Check if we're in a browser environment
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem("currentUser")
      if (stored) {
        currentUser = JSON.parse(stored)
        return currentUser
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
    return null
  },

  register: async (userData: Partial<User> & { password: string }): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      organization: userData.organization,
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return newUser
  },
}
