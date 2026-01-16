'use client';

import { useState } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from './lib/api';
import { CleanedDocument, RawDocument } from './types';
import DataTable from './components/DataTable';
import RawDataDisplay from './components/RawDataDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

function DataCleaningApp() {
  const [candidateName, setCandidateName] = useState('John Smith');
  const [batchId, setBatchId] = useState('');
  const [rawData, setRawData] = useState<RawDocument[]>([]);
  const [cleanedData, setCleanedData] = useState<CleanedDocument[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  // Fetch data query
  const fetchQuery = useQuery({
    queryKey: ['fetchData'],
    queryFn: async () => {
      const response = await api.fetchData(1);
      const items = response.records || response.items || [];
      setRawData(items);
      setBatchId(response.batch_id || '');
      return response;
    },
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Normalize data mutation
  const normalizeMutation = useMutation({
    mutationFn: async (data: RawDocument[]) => {
      return await api.normalizeData(data);
    },
    onSuccess: (data) => {
      setCleanedData(data);
    },
  });

  // Submit data mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      return await api.submitData(candidateName, batchId, cleanedData);
    },
    onSuccess: (data) => {
      const finalScore = data.validation?.score || data.score || 0;
      setScore(finalScore);
    },
  });

  const handleFetchData = () => {
    setScore(null);
    fetchQuery.refetch();
  };

  const handleNormalizeData = () => {
    if (rawData && rawData.length > 0) {
      normalizeMutation.mutate(rawData);
    }
  };

  const handleEditField = (
    index: number,
    field: keyof CleanedDocument,
    value: string | number
  ) => {
    const updated = [...cleanedData];
    updated[index] = { ...updated[index], [field]: value };
    setCleanedData(updated);
  };

  const handleSubmit = () => {
    if (cleanedData && cleanedData.length > 0 && batchId) {
      submitMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LumiCore Data Cleaning Application
          </h1>
          <p className="text-gray-600">
            Fetch, normalize, and submit document data with confidence
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch ID
              </label>
              <input
                type="text"
                value={batchId}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Will be set after fetching data"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleFetchData}
              disabled={fetchQuery.isFetching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {fetchQuery.isFetching ? 'Fetching...' : 'Fetch Data'}
            </button>

            <button
              onClick={handleNormalizeData}
              disabled={!rawData || rawData.length === 0 || normalizeMutation.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {normalizeMutation.isPending ? 'Normalizing...' : 'Normalize Data'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!cleanedData || cleanedData.length === 0 || submitMutation.isPending}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Data'}
            </button>

            <button
              onClick={() => setShowRawData(!showRawData)}
              disabled={!rawData || rawData.length === 0}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </button>
          </div>

          {/* Status Messages */}
          {fetchQuery.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                Error fetching data. Retrying... (Attempt {fetchQuery.failureCount + 1})
              </p>
            </div>
          )}

          {normalizeMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error normalizing data. Please try again.</p>
            </div>
          )}

          {submitMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error submitting data. Please try again.</p>
            </div>
          )}

          {/* Score Display */}
          {score !== null && (
            <div className={`mt-4 p-6 rounded-lg ${
              score === 100 ? 'bg-green-50 border-2 border-green-500' : 'bg-yellow-50 border-2 border-yellow-500'
            }`}>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">
                  Score: {score}/100
                </p>
                {score === 100 ? (
                  <p className="text-green-800 font-semibold">Perfect Score! 🎉</p>
                ) : (
                  <p className="text-yellow-800">Review and fix any issues to improve your score.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading States */}
        {fetchQuery.isFetching && <LoadingSpinner />}

        {/* Raw Data Display */}
        {showRawData && rawData && rawData.length > 0 && (
          <div className="mb-6">
            <RawDataDisplay data={rawData} />
          </div>
        )}

        {/* Cleaned Data Table */}
        {cleanedData && cleanedData.length > 0 && (
          <div className="mb-6">
            <DataTable
              data={cleanedData}
              onEdit={handleEditField}
              title="Cleaned Data (Editable)"
            />
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Green fields are valid, red fields need attention. 
                Edit any field directly in the table before submitting.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {(!rawData || rawData.length === 0) && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Get Started
            </h3>
            <ol className="text-left max-w-2xl mx-auto space-y-2 text-gray-700">
              <li>1. Enter your name and click "Fetch Data" to retrieve documents</li>
              <li>2. Click "Normalize Data" to clean and standardize the data</li>
              <li>3. Review and edit the cleaned data if needed</li>
              <li>4. Click "Submit Data" to send to the API and get your score</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataCleaningApp />
    </QueryClientProvider>
  );
}
