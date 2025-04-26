"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function SplashScreen() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setScale(1.5) // Increased scale for a larger content display
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}  // Starting with smaller scale
        animate={{ opacity: 1, scale: scale }} // Applying larger scale
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center justify-center text-white"
      >
        {/* Replace HardHat icon with a bigger image */}
        <img
          src="/logo12.png"  // Ensure this path points to your image in the public folder
          alt="CruzLink Logo"
          className="h-32 w-32 object-contain"  // Increased size for a bigger logo
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold mt-4"
        >
          CruzLink
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-sm mt-2"
        >
          Ride Safe
        </motion.p>
      </motion.div>
    </div>
  )
}
