import React, { useState } from "react";
import ComposeModal from "./components/ComposeModal";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmailList from "./components/EmailList";

function App() {
  const [currentView, setCurrentView] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [clients, setClients] = useState([
    { id: 1, name: "John Smith", email: "john.smith@example.com", company: "Tech Corp" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", company: "Design Studio" },
    { id: 3, name: "Mike Wilson", email: "mike.wilson@business.com", company: "Business Inc" }
  ]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: "Google",
      subject: "Security alert - App password created",
      preview: "We noticed a new app password was created for your account...",
      time: "4:20 PM",
      isRead: false,
      isStarred: false,
      avatar: "G",
      priority: "high"
    },
    {
      id: 2,
      from: "LinkedIn",
      subject: "[Important]- Need updated profile for Shortlisting!",
      preview: "Update your profile to get better job opportunities...",
      time: "3:45 PM",
      isRead: false,
      isStarred: true,
      avatar: "L",
      priority: "medium"
    },
    {
      id: 3,
      from: "Steam",
      subject: "Backrooms Media from your Steam wishlist is now on",
      preview: "The game you wishlisted is now available...",
      time: "2:30 PM",
      isRead: true,
      isStarred: false,
      avatar: "S",
      priority: "low"
    },
    {
      id: 4,
      from: "Naukri Campus",
      subject: "Best CV Formats for Freshers: Simple, Professional &...",
      preview: "Check out these professional CV templates...",
      time: "1:15 PM",
      isRead: true,
      isStarred: false,
      avatar: "N",
      priority: "low"
    },
    {
      id: 5,
      from: "Hyperskill Crew",
      subject: "Welcome to Hyperskill -",
      preview: "Start your programming journey with us...",
      time: "12:00 PM",
      isRead: false,
      isStarred: false,
      avatar: "H",
      priority: "medium"
    },
  ]);

  const handleEmailSent = (emailData) => {
    const sentEmail = {
      id: Date.now(),
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
      attachments: emailData.attachments || [],
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };
    setSentEmails(prev => [sentEmail, ...prev]);
    
    // Refresh drafts list after sending email
    fetchDrafts();
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowCompose(true);
  };

  const handleAddClient = (newClient) => {
    const client = {
      id: Date.now(),
      ...newClient
    };
    setClients(prev => [...prev, client]);
  };

  // Draft API functions
  const fetchDrafts = async () => {
    try {
      console.log('Fetching drafts...');
      const response = await fetch('http://localhost:5000/api/drafts');
      const data = await response.json();
      console.log('Drafts response:', data);
      if (data.success) {
        setDrafts(data.drafts);
        console.log('Drafts set:', data.drafts);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
    }
  };

  const saveDraft = async (draftData) => {
    try {
      console.log('Saving draft:', draftData);
      const response = await fetch('http://localhost:5000/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData)
      });
      const data = await response.json();
      console.log('Save draft response:', data);
      if (data.success) {
        setCurrentDraft(data.draft);
        await fetchDrafts(); // Refresh drafts list
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const updateDraft = async (draftId, draftData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/drafts/${draftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData)
      });
      const data = await response.json();
      if (data.success) {
        setCurrentDraft(data.draft);
        await fetchDrafts(); // Refresh drafts list
      }
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };

  const deleteDraft = async (draftId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/drafts/${draftId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchDrafts(); // Refresh drafts list
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const handleDraftSelect = (draft) => {
    setCurrentDraft(draft);
    setShowCompose(true);
  };

  // Load drafts on component mount
  React.useEffect(() => {
    fetchDrafts();
  }, []);

  const getCurrentEmails = () => {
    if (currentView === "sent") {
      return sentEmails.map(email => ({
        id: email.id,
        from: "me",
        to: email.to,
        subject: email.subject,
        preview: email.message.substring(0, 50) + "...",
        time: email.timestamp,
        isRead: true,
        isStarred: false,
        attachments: email.attachments || [],
        fullMessage: email.message,
        avatar: "M",
        priority: "normal"
      }));
    }
    return emails;
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onComposeClick={() => {
          setCurrentDraft(null);
          setSelectedClient(null);
          setShowCompose(true);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        clients={clients}
        onClientSelect={handleClientSelect}
        onAddClient={handleAddClient}
        drafts={drafts}
        onDraftSelect={handleDraftSelect}
        onDeleteDraft={deleteDraft}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Email List */}
        <EmailList 
          emails={getCurrentEmails()} 
          currentView={currentView}
          setEmails={setEmails}
        />
      </div>
      
      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal 
          onClose={() => setShowCompose(false)} 
          onEmailSent={handleEmailSent}
          selectedClient={selectedClient}
          onClientCleared={() => setSelectedClient(null)}
          currentDraft={currentDraft}
          onDraftCleared={() => setCurrentDraft(null)}
          onSaveDraft={saveDraft}
          onUpdateDraft={updateDraft}
        />
      )}
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
