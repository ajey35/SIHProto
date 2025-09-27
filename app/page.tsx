"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { authService, type User } from "@/lib/auth"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    // Check authentication state with a simple timeout
    const timer = setTimeout(() => {
      console.log("Checking auth state...")
      try {
        const currentUser = authService.getCurrentUser()
        console.log("Current user:", currentUser)
        setUser(currentUser)
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        console.log("Setting loading to false")
        setIsLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowRegister(false)}
                  className={!showRegister ? "bg-primary text-primary-foreground" : ""}
                >
                  Sign In
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowRegister(true)}
                  className={showRegister ? "bg-primary text-primary-foreground" : ""}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Blue Carbon Registry
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Blockchain-powered coastal restoration platform for sustainable blue carbon ecosystem management
              </p>
            </div>

            {/* Auth Section */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Auth Form */}
              <div className="animate-slide-up">
                {showRegister ? (
                  <RegisterForm
                    onRegisterSuccess={() => setShowRegister(false)}
                    onSwitchToLogin={() => setShowRegister(false)}
                  />
                ) : (
                  <LoginForm 
                    onLoginSuccess={handleLoginSuccess} 
                    onSwitchToRegister={() => setShowRegister(true)} 
                  />
                )}
              </div>

              {/* Features */}
              <div className="space-y-6 animate-slide-up">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Interactive ecosystem mapping</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Carbon credit management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Project proposal system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Blockchain verification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Multi-role dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Demo Credentials */}
                <div className="bg-muted/50 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Demo Credentials</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NCCR Admin:</span>
                      <span className="font-mono">admin@nccr.gov.in</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NGO:</span>
                      <span className="font-mono">greenearth@ngo.org</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Panchayat:</span>
                      <span className="font-mono">sarpanch@panchayat.gov.in</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verifier:</span>
                      <span className="font-mono">verifier@verification.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buyer:</span>
                      <span className="font-mono">buyer@company.com</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Password:</span>
                        <span className="font-mono font-semibold">password123</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
