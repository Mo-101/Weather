"use client"

import React from "react"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-[9999]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-xl font-semibold">Loading Application...</p>
      <p className="text-sm">Please wait while we prepare the experience.</p>
    </div>
  )
}