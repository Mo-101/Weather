export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full bg-transparent">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">Loading Map...</div>
        </div>
      </div>
    </div>
  )
}
