"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import {
  MapPin,
  FileText,
  Coins,
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react"
import type { User } from "@/lib/auth"

interface SidebarProps {
  user: User | null
  onLogout: () => void
  currentTab?: string
  onTabChange?: (tab: string) => void
}

const navigationItems = [
  { id: "map", label: "Ecosystem Map", icon: MapPin },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "credits", label: "Carbon Credits", icon: Coins },
  { id: "users", label: "User Management", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar({ user, onLogout, currentTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId)
    setIsOpen(false) // Close mobile sidebar after selection
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left",
                currentTab === item.id && "bg-secondary text-secondary-foreground"
              )}
              onClick={() => handleTabClick(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User Info & Actions */}
      {user && (
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>
    </>
  )
}
