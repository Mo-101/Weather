export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <div className="text-lg font-semibold mb-2">Loading Weather App</div>
        <div className="text-sm text-gray-300">Initializing 3D Earth Map...</div>
      </div>
    </div>
  )
}
