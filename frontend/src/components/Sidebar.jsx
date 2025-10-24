import { useState } from "react";

export default function Sidebar({ currentView, setCurrentView, onComposeClick, isOpen, onClose, clients, onClientSelect, onAddClient, drafts, onDraftSelect, onDeleteDraft }) {
  const [openSection, setOpenSection] = useState(null);

  const navigationItems = [];

  const labels = [
    { name: "Work", color: "blue", count: 12 },
    { name: "Personal", color: "green", count: 8 },
    { name: "Important", color: "red", count: 5 },
    { name: "Newsletters", color: "purple", count: 15 },
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
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                onClose();
              }}
              className={`modern-nav-item ${currentView === item.id ? 'active' : ''} group`}
              title={item.description}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  currentView === item.id 
                    ? 'bg-white shadow-md' 
                    : 'bg-gray-100 group-hover:bg-white'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              {item.count && (
                <span className={`modern-badge ${currentView === item.id ? 'bg-white text-blue-600' : 'secondary'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
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
                {labels.map((label, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${label.color}-500`}></div>
                      <span className="text-sm">{label.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{label.count}</span>
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
