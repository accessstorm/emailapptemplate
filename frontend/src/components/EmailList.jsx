import { useState } from "react";

export default function EmailList({ emails, currentView, setEmails }) {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const tabs = [
    { id: "primary", label: "Primary", count: null, active: true },
    { id: "promotions", label: "Promotions", count: "50 new", active: false },
    { id: "social", label: "Social", count: "8 new", active: false },
    { id: "updates", label: "Updates", count: "50 new", active: false },
  ];

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
    setSelectAll(!selectAll);
  };

  const handleStarEmail = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: !email.isStarred }
        : email
    ));
  };

  const handleMarkAsRead = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, isRead: true }
        : email
    ));
  };

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleDownloadAttachment = (attachment) => {
    const url = URL.createObjectURL(attachment.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 bg-white">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email List Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <button className="text-gray-600 hover:text-gray-900">
            <span>↻</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <span>📁</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <span>🗑️</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {currentView === "sent" ? `${emails.length} sent emails` : "1-50 of 2,004"}
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y divide-gray-200">
        {emails.map((email) => (
            <div
              key={email.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !email.isRead ? "bg-blue-50" : ""
              }`}
              onClick={() => {
                handleMarkAsRead(email.id);
                handleViewEmail(email);
              }}
            >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={() => handleSelectEmail(email.id)}
                className="w-4 h-4 text-blue-600 rounded"
                onClick={(e) => e.stopPropagation()}
              />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarEmail(email.id);
                }}
                className={`text-lg ${
                  email.isStarred ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500"
                }`}
              >
                {email.isStarred ? "⭐" : "☆"}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${!email.isRead ? "font-bold" : ""}`}>
                    {currentView === "sent" ? email.to : email.from}
                  </span>
                  {!email.isRead && currentView !== "sent" && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  <span className={!email.isRead ? "font-semibold" : ""}>
                    {email.subject}
                  </span>
                  <span className="text-gray-400 ml-2">- {email.preview}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {email.time}
              </div>
            </div>
            
            {/* Show attachments if any */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs">
                    <span>📎</span>
                    <span className="truncate max-w-20">{attachment.name}</span>
                    <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <span>◀</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <span>▶</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          More
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedEmail.subject}
              </h2>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✖️
              </button>
            </div>

            {/* Email Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {/* Email Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-700">
                    {currentView === "sent" ? "To:" : "From:"}
                  </span>
                  <span className="text-gray-600">
                    {currentView === "sent" ? selectedEmail.to : selectedEmail.from}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedEmail.time}
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <div className="whitespace-pre-wrap text-gray-800">
                  {selectedEmail.fullMessage || selectedEmail.preview}
                </div>
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Attachments:</h3>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📎</span>
                          <div>
                            <div className="font-medium text-gray-800">{attachment.name}</div>
                            <div className="text-sm text-gray-500">{formatFileSize(attachment.size)}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                          style={{ backgroundColor: '#ffda03' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e6c400'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffda03'}
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
