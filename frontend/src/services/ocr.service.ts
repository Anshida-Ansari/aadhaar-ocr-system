import { axiosClient } from '../api/axiosClient';
import type { IApiResponse } from '../types/ocr.types';

export const ocrService = {
  processImages: async (formData: FormData): Promise<IApiResponse> => {
    const response = await axiosClient.post<IApiResponse>('/api/ocr/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
