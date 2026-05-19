import { useState } from 'react'
import { AxiosError } from 'axios'
import { ocrService } from '../services/ocr.service'
import type { IOcrState } from '../types/ocr.types'


export function useOcr(): IOcrState & {
  processImages: (frontFile: File, backFile: File) => Promise<void>
  reset: () => void
} {
  const [state, setState] = useState<IOcrState>({
    status: 'idle',
    result: null,
    partialErrors: {},
    errorMessage: null,
  })

  const processImages = async (frontFile: File, backFile: File) => {
    setState((prev) => ({
      ...prev,
      status: 'uploading',
      errorMessage: null,
      result: null,
      partialErrors: {},
    }))

    try {
      const formData = new FormData()
      formData.append('front', frontFile)  
      formData.append('back', backFile)    


      setState((prev) => ({ ...prev, status: 'processing' }))

      const data = await ocrService.processImages(formData)

      if (data.success) {
        setState({
          status: 'success',
          result: data.data,
          partialErrors: data.errors || {},
          errorMessage: null,
        })
      } else {
        setState({
          status: 'error',
          result: null,
          partialErrors: {},
          errorMessage: data.message || 'An error occurred during OCR processing.',
        })
      }
    } catch (error) {
      let msg = 'Failed to connect to the server.'
      if (error instanceof AxiosError && error.response?.data?.message) {
        msg = error.response.data.message
      }
      setState({
        status: 'error',
        result: null,
        partialErrors: {},
        errorMessage: msg,
      })
    }
  }

  const reset = () => {setState({
      status: 'idle',
      result: null,
      partialErrors: {},
      errorMessage: null,
    })
  }

  return {
    ...state,
    processImages,
    reset,
  }
}
