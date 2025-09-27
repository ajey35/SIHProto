"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { MainLayout } from "@/components/layout/main-layout"
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
  const [currentTab, setCurrentTab] = useState("map")

  const renderDashboard = () => {
    switch (user.role) {
      case "nccr_admin":
        return <NCCRAdminDashboard user={user} onLogout={onLogout} currentTab={currentTab} />
      case "ngo":
        return <NGODashboard user={user} onLogout={onLogout} currentTab={currentTab} />
      case "panchayat":
        return <PanchayatDashboard user={user} onLogout={onLogout} currentTab={currentTab} />
      case "verifier":
        return <VerifierDashboard user={user} onLogout={onLogout} currentTab={currentTab} />
      case "buyer":
        return <BuyerDashboard user={user} onLogout={onLogout} currentTab={currentTab} />
      default:
        return <div>Unknown user role</div>
    }
  }

  return (
    <MainLayout user={user} onLogout={onLogout}>
      {renderDashboard()}
    </MainLayout>
  )
}
