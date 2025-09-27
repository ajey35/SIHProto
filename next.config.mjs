/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js and related libraries for SSR
    if (isServer) {
      config.externals = [...config.externals, 'three', '@react-three/fiber', '@react-three/drei']
    }
    
    // Handle canvas and other Node.js specific modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
    }
    
    return config
  },
}

export default nextConfig
