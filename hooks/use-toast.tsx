"use client"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

const toastCount = 0

export function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  // Simple toast implementation - in a real app you'd use a proper toast library
  console.log(`[v0] Toast: ${title} - ${description}`)

  // Create a temporary notification element
  const toastElement = document.createElement("div")
  toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up ${
    variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-card text-card-foreground border"
  }`

  toastElement.innerHTML = `
    <div class="font-semibold">${title}</div>
    ${description ? `<div class="text-sm opacity-90">${description}</div>` : ""}
  `

  document.body.appendChild(toastElement)

  // Remove after 3 seconds
  setTimeout(() => {
    toastElement.remove()
  }, 3000)
}

export function useToast() {
  return { toast }
}
