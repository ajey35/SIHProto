"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import type { User } from "@/lib/auth"

interface MainLayoutProps {
  user: User
  onLogout: () => void
  children: React.ReactNode
}

export function MainLayout({ user, onLogout, children }: MainLayoutProps) {
  const [currentTab, setCurrentTab] = useState("map")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
