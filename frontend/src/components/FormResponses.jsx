import React, { useState, useEffect } from 'react';

const FormResponses = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/form-submissions');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch form submissions. Make sure the backend is running.');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button
            onClick={() => setSelectedSubmission(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Form Response Details</h2>
          <div className="w-24"></div>
        </div>

        {/* Submission Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Submission Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Submitted At:</span>
                  <p className="text-gray-800 mt-1">{formatDate(selectedSubmission.submittedAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Form ID:</span>
                  <p className="text-gray-800 mt-1 font-mono text-xs">{selectedSubmission.formId}</p>
                </div>
                {selectedSubmission.submitterEmail && (
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800 mt-1">{selectedSubmission.submitterEmail}</p>
                  </div>
                )}
                {selectedSubmission.submitterName && (
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800 mt-1">{selectedSubmission.submitterName}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Form Data</h3>
              <div className="space-y-4">
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <label className="font-medium text-gray-600 text-sm uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-gray-800 mt-2 whitespace-pre-wrap">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedSubmission.ipAddress && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Technical Details</h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><span className="font-medium">IP Address:</span> {selectedSubmission.ipAddress}</p>
                  {selectedSubmission.userAgent && (
                    <p><span className="font-medium">User Agent:</span> {selectedSubmission.userAgent}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Form Responses</h2>
          <p className="text-gray-600 text-sm mt-1">
            {submissions.length} {submissions.length === 1 ? 'response' : 'responses'} received
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Submissions List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Responses Yet</h3>
            <p className="text-gray-500">Form responses will appear here when recipients submit forms.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-6"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {submission.submitterName || submission.submitterEmail || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(submission.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="ml-13 mt-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(submission.data).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="text-gray-600">
                            <span className="font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
                            <span className="text-gray-800">
                              {String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {Object.keys(submission.data).length > 3 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{Object.keys(submission.data).length - 3} more fields
                        </p>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;

