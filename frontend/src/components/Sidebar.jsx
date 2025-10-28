import { useState } from "react";

export default function Sidebar({ currentView, setCurrentView, onComposeClick, isOpen, onClose, clients, onClientSelect, onAddClient, drafts, onDraftSelect, onDeleteDraft, sentEmails, selectedLabel, onLabelFilter, onTemplateClick }) {
  const [openSection, setOpenSection] = useState(null);

  const labels = [
    { id: "work", name: "Work", color: "blue" },
    { id: "personal", name: "Personal", color: "green" },
    { id: "important", name: "Important", color: "red" },
    { id: "newsletters", name: "Newsletters", color: "purple" },
  ];

  // Count emails for each label
  const getLabelCounts = () => {
    const counts = {};
    labels.forEach(label => {
      counts[label.id] = sentEmails.filter(email => 
        email.labels && email.labels.includes(label.id)
      ).length;
    });
    console.log('Label counts:', counts, 'for emails:', sentEmails.length);
    return counts;
  };

  const labelCounts = getLabelCounts();

  const navigationItems = [
    { 
      id: "sent", 
      label: "Sent", 
      icon: "📤", 
      count: sentEmails && sentEmails.length > 0 ? sentEmails.length.toString() : null,
      color: "green",
      description: "Sent messages"
    }
  ];


  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-green-100 text-green-800",
      normal: "bg-gray-100 text-gray-800"
    };
    return colors[priority] || colors.normal;
  };

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`modern-sidebar ${isOpen ? 'open' : ''} slide-in-right`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gradient">MailBox</h2>
            <button 
              onClick={onClose}
              className="btn-ghost lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-6">
          <button 
            onClick={onComposeClick}
            className="btn-accent w-full flex items-center justify-center gap-2 shadow-glow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Compose
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {/* Sent Messages */}
          <button
            onClick={() => {
              setCurrentView("sent");
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              currentView === "sent" 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                currentView === "sent" 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-100 text-green-600'
              }`}>
                📤
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Sent Messages</div>
                <div className="text-xs text-gray-500">
                  {sentEmails && sentEmails.length > 0 
                    ? `${sentEmails.length} messages sent`
                    : 'No messages sent yet'
                  }
                </div>
              </div>
            </div>
            {sentEmails && sentEmails.length > 0 && (
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Latest: {new Date(sentEmails[0].sentAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </button>

          {/* Mail Templates */}
          <button
            onClick={() => {
              if (onTemplateClick) {
                onTemplateClick();
              } else {
                setCurrentView("templates");
              }
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              currentView === "templates" 
                ? 'bg-purple-50 border border-purple-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                currentView === "templates" 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                📝
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Mail Templates</div>
                <div className="text-xs text-gray-500">Pre-written templates</div>
              </div>
            </div>
          </button>

          {/* Form Responses */}
          <button
            onClick={() => {
              setCurrentView("form-responses");
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              currentView === "form-responses" 
                ? 'bg-green-50 border border-green-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                currentView === "form-responses" 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-600'
              }`}>
                📋
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Form Responses</div>
                <div className="text-xs text-gray-500">View submitted forms</div>
              </div>
            </div>
          </button>
        </nav>


        {/* Drafts Section */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => toggleSection('drafts')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                📝
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Draft Messages</div>
                <div className="text-xs text-gray-500">{drafts.length} drafts</div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSection === 'drafts' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSection === 'drafts' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 pb-4 max-h-64 overflow-y-auto">
              {drafts.length > 0 ? (
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft._id}
                      className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => onDraftSelect(draft)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate mb-1">
                            {draft.to || 'No recipient'}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 truncate mb-1">
                            {draft.subject || 'No subject'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {draft.message ? draft.message.substring(0, 40) + '...' : 'No content'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(draft.lastModified).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDraft(draft._id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all"
                          title="Delete draft"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-sm">No drafts yet</div>
                  <div className="text-xs">Start composing to create your first draft</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clients Section */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => toggleSection('clients')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                👥
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Clients</div>
                <div className="text-xs text-gray-500">{clients.length} clients</div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSection === 'clients' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSection === 'clients' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 pb-4">
              {/* Add Client Button */}
              <div className="mb-3">
                <button 
                  onClick={onAddClient}
                  className="w-full flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Client
                </button>
              </div>
              
              {/* Clients List */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onClientSelect(client)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800 text-sm">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.company}</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Labels Section */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => toggleSection('labels')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                🏷️
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Labels</div>
                <div className="text-xs text-gray-500">{labels.length} labels</div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openSection === 'labels' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSection === 'labels' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {/* All Emails */}
                <button
                  onClick={() => onLabelFilter(null)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedLabel === null 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm font-medium">All Mails</span>
                  </div>
                  <span className="text-xs text-gray-400">{sentEmails.length}</span>
                </button>

                {/* Individual Labels */}
                {labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => onLabelFilter(label.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedLabel === label.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: label.color === 'blue' ? '#3b82f6' :
                                         label.color === 'green' ? '#10b981' :
                                         label.color === 'red' ? '#ef4444' :
                                         label.color === 'purple' ? '#8b5cf6' : '#6b7280'
                        }}
                      ></div>
                      <span className="text-sm font-medium">{label.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{labelCounts[label.id]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
