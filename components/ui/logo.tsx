import { Leaf, Waves } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg`}
        >
          <Waves className={`${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6"} text-white`} />
        </div>
        <Leaf
          className={`absolute -top-1 -right-1 ${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6"} text-accent`}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${textSizeClasses[size]} leading-tight`}>Blue Carbon</span>
          <span
            className={`text-muted-foreground ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} -mt-1`}
          >
            Registry
          </span>
        </div>
      )}
    </div>
  )
}
