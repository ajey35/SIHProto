"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { authService, type User } from "@/lib/auth"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Logo } from "@/components/ui/logo"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Logo size="lg" className="mb-4 animate-pulse-slow" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading platform...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Blue Carbon Registry</h1>
            <p className="text-muted-foreground">Blockchain-powered coastal restoration platform</p>
          </div>

          <div className="animate-slide-up">
            {showRegister ? (
              <RegisterForm
                onRegisterSuccess={() => setShowRegister(false)}
                onSwitchToLogin={() => setShowRegister(false)}
              />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setShowRegister(true)} />
            )}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p>• NCCR Admin: admin@nccr.gov.in</p>
              <p>• NGO: greenearth@ngo.org</p>
              <p>• Panchayat: sarpanch@panchayat.gov.in</p>
              <p>• Verifier: verifier@verification.com</p>
              <p>• Buyer: buyer@company.com</p>
              <p className="mt-2 font-medium">Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
