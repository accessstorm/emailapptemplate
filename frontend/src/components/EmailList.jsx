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
    <div className="modern-email-list">
      {/* Tabs */}
      <div className="modern-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`modern-tab ${tab.active ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              {tab.count && (
                <span className="modern-badge secondary">
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Email List Header */}
      <div className="modern-toolbar">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 rounded modern-focus"
          />
          <button className="modern-toolbar-button" title="Refresh">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="modern-toolbar-button" title="Archive">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4-4 4m5-4h6" />
            </svg>
          </button>
          <button className="modern-toolbar-button" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {currentView === "sent" ? `${emails.length} sent emails` : `${emails.length} emails`}
          </div>
          <button className="modern-toolbar-button" title="More options">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-1 p-4">
        {emails.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📧</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {currentView === "sent" ? "No sent emails yet" : "No emails"}
            </h3>
            <p className="text-gray-500">
              {currentView === "sent" 
                ? "Send your first email to see it here" 
                : "Your inbox is empty"}
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <div
            key={email.id}
            className={`modern-email-item ${!email.isRead ? "unread" : ""} modern-card`}
            onClick={() => {
              handleMarkAsRead(email.id);
              handleViewEmail(email);
            }}
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={() => handleSelectEmail(email.id)}
                className="w-4 h-4 text-blue-600 rounded modern-focus"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="modern-avatar">
                <span className="font-bold">{email.avatar || email.from.charAt(0)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${!email.isRead ? "text-gray-900" : "text-gray-700"}`}>
                    {currentView === "sent" ? email.to : email.from}
                  </span>
                  {!email.isRead && currentView !== "sent" && (
                    <span className="modern-badge success">New</span>
                  )}
                  {email.priority && email.priority !== 'normal' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      email.priority === 'high' ? 'bg-red-100 text-red-800' :
                      email.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {email.priority}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  <span className={!email.isRead ? "font-semibold text-gray-900" : ""}>
                    {email.subject}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {email.preview}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStarEmail(email.id);
                  }}
                  className={`p-1 rounded transition-colors ${
                    email.isStarred 
                      ? "text-yellow-500 hover:text-yellow-600" 
                      : "text-gray-300 hover:text-yellow-500"
                  }`}
                >
                  <svg className="w-4 h-4" fill={email.isStarred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                
                <div className="text-xs text-gray-500">
                  {email.time}
                </div>
              </div>
            </div>
            
            {/* Show attachments if any */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="truncate max-w-20">{attachment.name}</span>
                    <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="modern-toolbar">
        <div className="flex items-center gap-2">
          <button className="modern-toolbar-button" title="Previous">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="modern-toolbar-button" title="Next">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          More
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="modern-modal-overlay fade-in">
          <div className="modern-modal slide-in">
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
                          className="btn-primary"
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
