"use client"

import React from "react"

export default function RiskLegend() {
  return (
    <div className="p-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg shadow-lg text-xs">
      <h3 className="font-semibold mb-1">Risk Legend</h3>
      <ul className="space-y-1">
        <li className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Low Risk</li>
        <li className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span> Medium Risk</li>
        <li className="flex items-center"><span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span> High Risk</li>
        <li className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> Severe Risk</li>
      </ul>
      {/* Customize as needed */}
    </div>
  )
}