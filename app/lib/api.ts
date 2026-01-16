import axios from 'axios';
import { FetchDataResponse, RawDocument, CleanedDocument, SubmitResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  fetchData: async (batch: number = 1): Promise<FetchDataResponse> => {
    const response = await apiClient.get(`/api/fetch/?batch=${batch}`);
    return response.data;
  },

  normalizeData: async (rawData: RawDocument[]): Promise<CleanedDocument[]> => {
    const response = await apiClient.post('/api/normalize/', { raw_data: rawData });
    return response.data.normalized_data;
  },

  submitData: async (
    candidateName: string,
    batchId: string,
    cleanedItems: CleanedDocument[]
  ): Promise<SubmitResponse> => {
    const response = await apiClient.post('/api/submit/', {
      candidate_name: candidateName,
      batch_id: batchId,
      cleaned_items: cleanedItems,
    });
    return response.data;
  },
};
