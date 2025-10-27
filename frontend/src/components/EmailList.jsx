import { useState, useCallback, useEffect } from "react";
import React from "react";

export default function EmailList({ emails, currentView, setEmails, onEmailSelect, onLabelsUpdated, selectedLabel }) {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const labels = [
    { id: "work", name: "Work", color: "blue" },
    { id: "personal", name: "Personal", color: "green" },
    { id: "important", name: "Important", color: "red" },
    { id: "newsletters", name: "Newsletters", color: "purple" },
  ];

  const handleSelectEmail = useCallback((emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
    setSelectAll(!selectAll);
  }, [selectAll, emails]);

  const handleStarEmail = useCallback((emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: !email.isStarred }
        : email
    ));
  }, [emails, setEmails]);

  const handleMarkAsRead = useCallback((emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId 
        ? { ...email, isRead: true }
        : email
    ));
  }, [emails, setEmails]);

  const updateEmailLabels = async (emailId, newLabels) => {
    try {
      console.log('Updating labels for email:', emailId, 'with labels:', newLabels);
      const response = await fetch(`http://localhost:5000/api/sent-emails/${emailId}/labels`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labels: newLabels })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Labels updated successfully:', data);
      } else {
        if (response.status === 404) {
          console.error('❌ Backend server not running or endpoint not found. Please start the backend server.');
          alert('❌ Backend server not running. Please start the backend server with: cd backend && npm start');
        } else {
          const errorData = await response.json();
          console.error('Failed to update labels:', errorData);
        }
      }
    } catch (error) {
      console.error('Error updating labels:', error);
      if (error.message.includes('fetch')) {
        alert('❌ Cannot connect to backend server. Please start the backend server with: cd backend && npm start');
      }
    }
  };

  const handleAddLabel = useCallback(async (emailId, labelId) => {
    console.log('Adding label', labelId, 'to email', emailId);
    
    const updatedEmails = emails.map(email => 
      email.id === emailId 
        ? { 
            ...email, 
            labels: email.labels ? [...email.labels, labelId] : [labelId]
          }
        : email
    );
    
    console.log('Updated emails:', updatedEmails);
    setEmails(updatedEmails);
    
    // Update in backend (with error handling)
    try {
      const email = emails.find(e => e.id === emailId);
      const newLabels = email.labels ? [...email.labels, labelId] : [labelId];
      console.log('New labels for backend:', newLabels);
      await updateEmailLabels(emailId, newLabels);
    } catch (error) {
      console.log('Backend update failed, but frontend state updated:', error);
    }
    
    // Refresh sent emails to update sidebar counts
    if (onLabelsUpdated) {
      onLabelsUpdated();
    }
  }, [emails, setEmails, onLabelsUpdated]);

  const handleRemoveLabel = useCallback(async (emailId, labelId) => {
    console.log('Removing label', labelId, 'from email', emailId);
    
    const updatedEmails = emails.map(email => 
      email.id === emailId 
        ? { 
            ...email, 
            labels: email.labels ? email.labels.filter(id => id !== labelId) : []
          }
        : email
    );
    
    console.log('Updated emails after removal:', updatedEmails);
    setEmails(updatedEmails);
    
    // Update in backend (with error handling)
    try {
      const email = emails.find(e => e.id === emailId);
      const newLabels = email.labels ? email.labels.filter(id => id !== labelId) : [];
      console.log('New labels for backend after removal:', newLabels);
      await updateEmailLabels(emailId, newLabels);
    } catch (error) {
      console.log('Backend update failed, but frontend state updated:', error);
    }
    
    // Refresh sent emails to update sidebar counts
    if (onLabelsUpdated) {
      onLabelsUpdated();
    }
  }, [emails, setEmails, onLabelsUpdated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.label-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

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

  console.log('EmailList rendered with emails:', emails);
  
  return (
    <div className="modern-email-list h-full flex flex-col">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded modern-focus"
            />
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {emails.length} Sent Messages
                {selectedLabel && (
                  <span className="ml-2 text-sm font-normal text-blue-600">
                    (Filtered by: {selectedLabel})
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                {selectedLabel && (
                  <button
                    onClick={() => {
                      // This will be handled by the parent component
                      console.log('Clear filter clicked');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={() => {
                    // Add test labels to all emails
                    emails.forEach(email => {
                      if (!email.labels || email.labels.length === 0) {
                        handleAddLabel(email.id, 'work');
                      }
                    });
                  }}
                  className="text-sm text-green-600 hover:text-green-800 underline"
                >
                  Add Test Labels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📧</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No sent emails yet</h3>
              <p className="text-gray-500">Send your first email to see it here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="modern-email-item cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => {
                  handleMarkAsRead(email.id);
                  onEmailSelect(email);
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
                      <span className="font-semibold text-sm text-gray-700">
                        To: {email.to}
                      </span>
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
                    <div className="text-sm text-gray-600 truncate font-medium">
                      {email.subject}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {email.preview}
                    </div>
                    
                    {/* Labels */}
                    {console.log('Email labels for', email.id, ':', email.labels)}
                    {email.labels && email.labels.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {email.labels.map(labelId => {
                          const label = labels.find(l => l.id === labelId);
                          const colorStyles = {
                            blue: { bg: '#dbeafe', text: '#1e40af' },
                            green: { bg: '#d1fae5', text: '#065f46' },
                            red: { bg: '#fee2e2', text: '#991b1b' },
                            purple: { bg: '#e9d5ff', text: '#6b21a8' }
                          };
                          const style = colorStyles[label.color] || { bg: '#f3f4f6', text: '#374151' };
                          return label ? (
                            <span 
                              key={labelId} 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: style.bg, 
                                color: style.text 
                              }}
                            >
                              {label.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                          No labels
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Labels Dropdown */}
                    <div className="relative label-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Label button clicked for email:', email.id, 'Current dropdown:', openDropdown);
                          setOpenDropdown(openDropdown === email.id ? null : email.id);
                        }}
                        className={`p-2 rounded transition-colors ${
                          openDropdown === email.id 
                            ? 'text-blue-600 bg-blue-100' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        title="Add labels"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === email.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <div className="py-1">
                            {console.log('Rendering dropdown for email:', email.id, 'with labels:', labels)}
                            {labels.map(label => (
                              <button
                                key={label.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (email.labels && email.labels.includes(label.id)) {
                                    handleRemoveLabel(email.id, label.id);
                                  } else {
                                    handleAddLabel(email.id, label.id);
                                  }
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                                  email.labels && email.labels.includes(label.id) ? 'bg-gray-50' : ''
                                }`}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ 
                                    backgroundColor: label.color === 'blue' ? '#3b82f6' :
                                                   label.color === 'green' ? '#10b981' :
                                                   label.color === 'red' ? '#ef4444' :
                                                   label.color === 'purple' ? '#8b5cf6' : '#6b7280'
                                  }}
                                ></div>
                                <span>{label.name}</span>
                                {email.labels && email.labels.includes(label.id) && (
                                  <svg className="w-4 h-4 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
