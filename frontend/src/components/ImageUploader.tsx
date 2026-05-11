import React, { useRef, useState } from 'react'

interface ImageUploaderProps {
  label: string
  onFileSelected: (file: File | null) => void
}

export function ImageUploader({ label, onFileSelected }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    validateAndSetFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0] || null
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File | null) => {
    setError(null)
    if (!file) {
      setPreview(null)
      onFileSelected(null)
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WEBP images are allowed.')
      setPreview(null)
      onFileSelected(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.')
      setPreview(null)
      onFileSelected(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    onFileSelected(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setError(null)
    onFileSelected(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{label}</span>
      <div
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden bg-slate-50
          hover:bg-emerald-50 hover:border-emerald-300
          ${preview ? 'border-emerald-400 p-0 shadow-inner' : 'border-slate-300'}
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />

        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover max-h-[280px]" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-red-50 transition-colors"
              >
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-500 py-12">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-4 text-emerald-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <p className="text-base font-semibold text-slate-700">Click to upload or drag & drop</p>
            <p className="text-xs mt-1.5 text-slate-500 font-medium">SVG, PNG, JPG or WEBP (max. 5MB)</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
    </div>
  )
}
