'use client';

import { useEffect, useState } from 'react';

export default function DebugConversationPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get first conversation
        const listResponse = await fetch('/api/conversations');
        if (!listResponse.ok) {
          setError(`List API error: ${listResponse.status} ${listResponse.statusText}`);
          setLoading(false);
          return;
        }

        const conversations = await listResponse.json();
        if (!Array.isArray(conversations) || conversations.length === 0) {
          setError('No conversations found');
          setLoading(false);
          return;
        }

        const firstConv = conversations[0];

        // Get conversation details
        const detailResponse = await fetch(`/api/conversations/${firstConv.id}`);
        if (!detailResponse.ok) {
          setError(`Detail API error: ${detailResponse.status} ${detailResponse.statusText}`);
          setLoading(false);
          return;
        }

        const detail = await detailResponse.json();
        setData(detail);
        setLoading(false);
      } catch (err: any) {
        setError(`Exception: ${err.message}`);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <pre className="bg-red-50 p-4 rounded">{error}</pre>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug: Conversation Data</h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="font-bold text-green-800 mb-2">✅ API Call Successful!</h2>
        <div className="text-sm text-green-700">
          <div><strong>Subject:</strong> {data?.subject || 'N/A'}</div>
          <div><strong>Status:</strong> {data?.status || 'N/A'}</div>
          <div><strong>User:</strong> {data?.user?.firstName} {data?.user?.lastName} ({data?.user?.email})</div>
          <div><strong>Messages count:</strong> {data?.messages?.length || 0}</div>
        </div>
      </div>

      {data?.messages && data.messages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-blue-800 mb-4">📨 Messages ({data.messages.length})</h2>
          {data.messages.map((msg: any, idx: number) => (
            <div key={msg.id} className="bg-white p-4 rounded mb-3 border">
              <div className="font-semibold mb-2">
                Message #{idx + 1}: {msg.fromName} {msg.isFromAdmin ? '[ADMIN]' : '[CLIENT]'}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {msg.fromEmail} • {new Date(msg.createdAt).toLocaleString()}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <details className="bg-gray-100 p-4 rounded">
        <summary className="font-bold cursor-pointer">Raw JSON Data</summary>
        <pre className="mt-4 text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
