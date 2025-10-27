import React from "react";

export default function EmailDetail({ email, onBack }) {
  return (
    <div className="modern-email-list h-full flex flex-col">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sent Messages
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Email Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{email.subject}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">From:</span>
                <span>{email.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">To:</span>
                <span>{email.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Date:</span>
                <span>{email.date} at {email.time}</span>
              </div>
            </div>

            {email.cc && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="font-medium">CC:</span>
                <span>{email.cc}</span>
              </div>
            )}

            {email.bcc && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="font-medium">BCC:</span>
                <span>{email.bcc}</span>
              </div>
            )}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-sm border border-blue-200">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="font-medium">{attachment.name}</span>
                    <span className="text-gray-500">({attachment.size})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: email.messageHtml || email.fullMessage.replace(/\n/g, '<br>') 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
