import { useState } from 'react'
import type { IAadhaarResponse } from '../types/ocr.types'

interface OcrResultCardProps {
  data: IAadhaarResponse
  errors?: Record<string, string>
}

export function OcrResultCard({ data, errors = {} }: OcrResultCardProps) {
  const [showAadhaar, setShowAadhaar] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (data.aadhaarNumber) {
      navigator.clipboard.writeText(data.aadhaarNumber.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const maskAadhaar = (num: string | null) => {
    if (!num) return 'Not found'
    if (showAadhaar) return num
    return `XXXX XXXX ${num.slice(-4)}`
  }

  const FieldRow = ({ label, value, errorKey }: { label: string, value: string | null, errorKey: string }) => {
    const errorMsg = errors[errorKey]
    const displayValue = value || '—'

    return (
      <div className="flex flex-col py-4 border-b border-slate-100 last:border-0">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
        <div className="flex justify-between items-start gap-4">
          <span className={`text-base font-semibold ${!value ? 'text-slate-400 italic' : 'text-slate-800'}`}>
            {displayValue}
          </span>
        </div>
        {errorMsg && (
          <span className="text-xs text-orange-600 mt-1.5 flex items-center gap-1 font-medium bg-orange-50 w-fit px-2 py-0.5 rounded-md border border-orange-100">
             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {errorMsg}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>

      <div className="flex justify-between items-center mb-8 mt-2">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
          </div>
          Extracted Information
        </h2>
        <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full border border-emerald-200">
          Success
        </span>
      </div>

      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aadhaar Number</span>
          {data.aadhaarNumber && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAadhaar(!showAadhaar)}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-bold transition-colors focus:outline-none bg-emerald-100/50 px-3 py-1 rounded-md"
              >
                {showAadhaar ? 'Hide' : 'Reveal'}
              </button>
              <button
                onClick={handleCopy}
                className="text-sm text-slate-600 hover:text-slate-900 font-bold transition-colors focus:outline-none flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
        <div className="text-4xl font-mono tracking-widest font-black text-slate-800 mb-1">
          {maskAadhaar(data.aadhaarNumber)}
        </div>
        {errors.aadhaarNumber && (
           <span className="text-sm text-orange-600 flex items-center gap-1.5 mt-3 font-semibold">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
             {errors.aadhaarNumber}
           </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 bg-white">
        <div className="flex flex-col">
          <FieldRow label="Full Name" value={data.name} errorKey="name" />
          <FieldRow label="Date of Birth" value={data.dob} errorKey="dob" />
          <FieldRow label="Gender" value={data.gender} errorKey="gender" />
        </div>
        <div className="flex flex-col">
           <FieldRow label="Address" value={data.address} errorKey="address" />
           <FieldRow label="Pincode" value={data.pincode} errorKey="pincode" />
        </div>
      </div>
    </div>
  )
}
