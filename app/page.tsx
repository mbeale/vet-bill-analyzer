'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import VerdictDisplay from './components/VerdictDisplay';

export default function Home() {
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process receipt');
      }

      const data = await response.json();
      setVerdict(data);
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('Error processing receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PetCare AI</h1>
          <p className="text-lg text-gray-600">
            Validate veterinary costs with crowdsourced regional data
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <FileUpload onUpload={handleUpload} loading={loading} />
        </div>

        {verdict && <VerdictDisplay verdict={verdict} />}
      </div>
    </main>
  );
}
