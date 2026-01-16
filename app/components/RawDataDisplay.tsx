'use client';

import { RawDocument } from '../types';

interface RawDataDisplayProps {
  data: RawDocument[];
}

export default function RawDataDisplay({ data }: RawDataDisplayProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Raw Data from API</h2>
      <div className="bg-gray-800 rounded p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
