import React, { useState, useEffect } from "react";
import ComposeModal from "./components/ComposeModal";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmailList from "./components/EmailList";
import AddClientModal from "./components/AddClientModal";

function App() {
  const [currentView, setCurrentView] = useState("sent");
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [emails, setEmails] = useState([]);

  const handleEmailSent = (emailData) => {
    // Refresh sent emails list after sending email
    fetchSentEmails();
    
    // Refresh drafts list after sending email
    fetchDrafts();
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowCompose(true);
  };

  // Client API functions
  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients');
      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = (newClient) => {
    setClients(prev => [newClient, ...prev]);
    setShowAddClientModal(false);
  };

  // Sent Emails API functions
  const fetchSentEmails = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sent-emails');
      const data = await response.json();
      if (data.success) {
        setSentEmails(data.sentEmails);
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error);
    }
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

  // Load drafts, clients, and sent emails on component mount
  useEffect(() => {
    fetchDrafts();
    fetchClients();
    fetchSentEmails();
  }, []);

  const getCurrentEmails = () => {
    if (currentView === "sent") {
      return sentEmails.map(email => ({
        id: email._id,
        from: "me",
        to: email.to,
        subject: email.subject,
        preview: email.message.substring(0, 50) + "...",
        time: new Date(email.sentAt).toLocaleTimeString(),
        date: new Date(email.sentAt).toLocaleDateString(),
        isRead: true,
        isStarred: false,
        attachments: email.attachments || [],
        fullMessage: email.message,
        avatar: "M",
        priority: "normal",
        cc: email.cc,
        bcc: email.bcc,
        messageHtml: email.messageHtml
      }));
    }
    // For inbox view, return empty array (no dummy emails)
    return [];
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
        onAddClient={() => setShowAddClientModal(true)}
        drafts={drafts}
        onDraftSelect={handleDraftSelect}
        onDeleteDraft={deleteDraft}
        sentEmails={sentEmails}
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

      {/* Add Client Modal */}
      {showAddClientModal && (
        <AddClientModal
          isOpen={showAddClientModal}
          onClose={() => setShowAddClientModal(false)}
          onClientAdded={handleAddClient}
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
