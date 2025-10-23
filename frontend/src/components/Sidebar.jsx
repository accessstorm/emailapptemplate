import { useState } from "react";

export default function Sidebar({ currentView, setCurrentView, onComposeClick }) {
  const [showLabels, setShowLabels] = useState(false);

  const navigationItems = [
    { id: "inbox", label: "Inbox", icon: "📥", count: "1,627", active: true },
    { id: "starred", label: "Starred", icon: "⭐" },
    { id: "snoozed", label: "Snoozed", icon: "⏰" },
    { id: "sent", label: "Sent", icon: "📤" },
    { id: "drafts", label: "Drafts", icon: "📝", count: "10" },
    { id: "purchases", label: "Purchases", icon: "🛍️", count: "38" },
  ];

  const labels = [
    "github whitelist",
    "Moved 2023-11-18 14:18",
    "sengupta.jayavrata@uni...",
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Compose Button */}
      <div className="p-4">
        <button 
          onClick={onComposeClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-3 font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ backgroundColor: '#ffda03' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e6c400'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffda03'}
        >
          <span>✏️</span>
          Compose
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors ${
              currentView === item.id
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.count && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}

        {/* More Button */}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <span>⬇️</span>
          <span>More</span>
        </button>
      </nav>

      {/* Labels Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Labels</span>
          <button 
            onClick={() => setShowLabels(!showLabels)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showLabels ? "−" : "+"}
          </button>
        </div>
        
        {showLabels && (
          <div className="space-y-1">
            {labels.map((label, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
