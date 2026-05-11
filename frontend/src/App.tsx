import { useState } from 'react'
import { ImageUploader } from './components/ImageUploader'
import { OcrResultCard } from './components/OcrResultCard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useOcr } from './hooks/useOcr'

function App() {
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const { status, result, partialErrors, errorMessage, processImages, reset } = useOcr()

  const handleSubmit = () => {
    if (frontFile && backFile) {
      processImages(frontFile, backFile)
    }
  }

  const handleReset = () => {
    setFrontFile(null)
    setBackFile(null)
    reset()
  }

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 lg:p-16 flex justify-center selection:bg-emerald-200">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        
        {/* Header Section */}
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-2 shadow-sm border border-emerald-200 text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            Aadhaar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">OCR Scanner</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto font-medium">
            Securely upload the front and back of an Aadhaar card to instantly extract structured data using AI.
          </p>
        </header>

        <main className="flex flex-col gap-8 w-full relative z-10">
          {status === 'success' && result ? (
            <div className="flex flex-col gap-6 animate-fade-in-up">
               <OcrResultCard data={result} errors={partialErrors} />
               <div className="flex justify-center mt-6">
                 <button 
                   onClick={handleReset}
                   className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 >
                   Scan Another Card
                 </button>
               </div>
            </div>
          ) : status === 'processing' || status === 'uploading' ? (
             <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-12 min-h-[400px] flex items-center justify-center shadow-sm">
                <LoadingSpinner />
             </div>
          ) : (
            <div className="flex flex-col gap-8">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  <div>
                    <h4 className="font-bold text-red-800">Processing Error</h4>
                    <p className="text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <ImageUploader label="Front Side" onFileSelected={setFrontFile} />
                <ImageUploader label="Back Side" onFileSelected={setBackFile} />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!frontFile || !backFile}
                  className={`
                    px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-2
                    ${frontFile && backFile 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-0.5 cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
                    }
                  `}
                >
                  Extract Information
                  {frontFile && backFile && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Soft background glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-slate-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-emerald-100/40 blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-teal-100/40 blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>
    </div>
  )
}

export default App
