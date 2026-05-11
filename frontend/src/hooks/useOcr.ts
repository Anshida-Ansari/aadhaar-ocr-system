import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import type {
  IOcrState,
  IApiResponse,
} from '../types/ocr.types'

// ── Hook ─────────────────────────────────────────────────────────────────────

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

  // Start processing files
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
      formData.append('front', frontFile)   // must match multer field name
      formData.append('back', backFile)     // must match multer field name

      // Optional: Give it a slight delay to show the spinner moving to processing phase
      // Normally axios upload progress handles this, but here's a simpler approach
      setState((prev) => ({ ...prev, status: 'processing' }))

      const response = await axios.post<IApiResponse>('/api/ocr/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = response.data

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

  // Reset state to upload another card
  const reset = () => {
    setState({
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
