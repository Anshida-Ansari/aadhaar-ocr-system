export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 border-4 border-teal-200 rounded-full border-b-transparent animate-spin duration-1000"></div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 animate-pulse">Processing Aadhaar Card...</h3>
        <p className="text-sm text-slate-500 mt-2 font-medium">Extracting text via secure OCR engine</p>
      </div>
    </div>
  )
}
