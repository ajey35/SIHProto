"use client"

import type { User } from "@/lib/auth"
import { NCCRAdminDashboard } from "./nccr-admin-dashboard"
import { NGODashboard } from "./ngo-dashboard"
import { PanchayatDashboard } from "./panchayat-dashboard"
import { VerifierDashboard } from "./verifier-dashboard"
import { BuyerDashboard } from "./buyer-dashboard"

interface DashboardProps {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const renderDashboard = () => {
    switch (user.role) {
      case "nccr_admin":
        return <NCCRAdminDashboard user={user} onLogout={onLogout} />
      case "ngo":
        return <NGODashboard user={user} onLogout={onLogout} />
      case "panchayat":
        return <PanchayatDashboard user={user} onLogout={onLogout} />
      case "verifier":
        return <VerifierDashboard user={user} onLogout={onLogout} />
      case "buyer":
        return <BuyerDashboard user={user} onLogout={onLogout} />
      default:
        return <div>Unknown user role</div>
    }
  }

  return renderDashboard()
}
