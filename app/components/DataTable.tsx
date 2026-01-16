'use client';

import { CleanedDocument } from '../types';

interface DataTableProps {
  data: CleanedDocument[];
  onEdit: (index: number, field: keyof CleanedDocument, value: string | number) => void;
  title: string;
}

export default function DataTable({ data, onEdit, title }: DataTableProps) {
  const handleInputChange = (
    index: number,
    field: keyof CleanedDocument,
    value: string
  ) => {
    if (field === 'amount') {
      const numValue = parseFloat(value);
      onEdit(index, field, isNaN(numValue) ? 0 : numValue);
    } else {
      onEdit(index, field, value);
    }
  };

  const validateField = (field: keyof CleanedDocument, value: any): boolean => {
    if (!value) return false;
    if (field === 'expiry_date') {
      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }
    if (field === 'amount') {
      return typeof value === 'number' && value > 0;
    }
    return true;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doc ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counterparty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={doc.doc_id || ''}
                    onChange={(e) => handleInputChange(index, 'doc_id', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('doc_id', doc.doc_id)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={doc.type || ''}
                    onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('type', doc.type)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={doc.counterparty || ''}
                    onChange={(e) => handleInputChange(index, 'counterparty', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('counterparty', doc.counterparty)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={doc.project || ''}
                    onChange={(e) => handleInputChange(index, 'project', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('project', doc.project)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={doc.expiry_date || ''}
                    onChange={(e) => handleInputChange(index, 'expiry_date', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('expiry_date', doc.expiry_date)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                    placeholder="YYYY-MM-DD"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={doc.amount || 0}
                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                    className={`w-full px-2 py-1 border rounded ${
                      validateField('amount', doc.amount)
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
