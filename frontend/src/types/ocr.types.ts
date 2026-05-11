
export interface IAadhaarResponse {
  aadhaarNumber: string | null
  name: string | null
  dob: string | null
  gender: string | null
  address: string | null
  pincode: string | null
}


export interface IApiSuccess {
  success: true
  message: string
  data: IAadhaarResponse
  errors?: Record<string, string>  
}

export interface IApiError {
  success: false
  message: string
  errors?: Record<string, string>
}

export type IApiResponse = IApiSuccess | IApiError


export interface IUploadedFiles {
  frontFile: File | null
  backFile: File | null
}

export interface IPreviewUrls {
  frontPreview: string | null
  backPreview: string | null
}


export type OcrStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export interface IOcrState {
  status: OcrStatus
  result: IAadhaarResponse | null
  partialErrors: Record<string, string>
  errorMessage: string | null
}
