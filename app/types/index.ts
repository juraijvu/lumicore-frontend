export interface RawDocument {
  [key: string]: any;
}

export interface CleanedDocument {
  doc_id: string;
  type: string;
  counterparty: string;
  project: string;
  expiry_date: string;
  amount: number;
}

export interface FetchDataResponse {
  batch_id: string;
  records?: RawDocument[];
  items?: RawDocument[];
  message?: string;
}

export interface SubmitResponse {
  score: number;
  message: string;
  details?: any;
}
