export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-sm font-medium">Loading...</div>
        </div>
      </div>
    </div>
  )
}
