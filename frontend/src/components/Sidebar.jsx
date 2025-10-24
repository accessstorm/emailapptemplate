import { useState } from "react";

export default function Sidebar({ currentView, setCurrentView, onComposeClick, isOpen, onClose, clients, onClientSelect, onAddClient, drafts, onDraftSelect, onDeleteDraft }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '' });

  const navigationItems = [
    { 
      id: "drafts", 
      label: "Drafts", 
      icon: "📝", 
      count: drafts.length > 0 ? drafts.length.toString() : null,
      color: "orange",
      description: "Unfinished messages"
    }
  ];

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

  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      onAddClient(newClient);
      setNewClient({ name: '', email: '', company: '' });
      setShowAddClient(false);
    }
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

          {/* More Button */}
          <button className="modern-nav-item group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <span className="font-medium">More</span>
            </div>
          </button>
        </nav>

        {/* Drafts Section */}
        {currentView === "drafts" && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Draft Messages</span>
              <span className="text-xs text-gray-500">{drafts.length} drafts</span>
            </div>
            
            {drafts.length > 0 ? (
              <div className="space-y-2">
                {drafts.map((draft) => (
                  <div
                    key={draft._id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => onDraftSelect(draft)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {draft.to || 'No recipient'}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {draft.subject || 'No subject'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {draft.message ? draft.message.substring(0, 50) + '...' : 'No content'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(draft.lastModified).toLocaleDateString()} at {new Date(draft.lastModified).toLocaleTimeString()}
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
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-sm">No drafts yet</div>
                <div className="text-xs">Start composing to create your first draft</div>
              </div>
            )}
          </div>
        )}

        {/* Clients Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Clients</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowAddClient(!showAddClient)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
                title="Add Client"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button 
                onClick={() => setShowClients(!showClients)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
              >
                <svg className={`w-4 h-4 transition-transform ${showClients ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Add Client Form */}
          {showAddClient && (
            <form onSubmit={handleAddClientSubmit} className="mb-3 p-3 bg-gray-50 rounded-lg fade-in">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Company (Optional)"
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddClient(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs py-1 px-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Clients List */}
          {showClients && (
            <div className="space-y-1 fade-in">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onClientSelect(client)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.company}</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Labels Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Labels</span>
            <button 
              onClick={() => setShowLabels(!showLabels)}
              className="btn-ghost p-1"
            >
              <svg className={`w-4 h-4 transition-transform ${showLabels ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showLabels && (
            <div className="space-y-1 fade-in">
              {labels.map((label, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${label.color}-500`}></div>
                    <span>{label.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{label.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="modern-avatar">
              <span className="font-bold">J</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">John Doe</div>
              <div className="text-xs text-gray-500">john@example.com</div>
            </div>
            <button className="btn-ghost p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
