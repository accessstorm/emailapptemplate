import React, { useState, useEffect } from "react";
import ComposeModal from "./components/ComposeModal";
import Sidebar from "./components/Sidebar";
import EmailList from "./components/EmailList";
import EmailDetail from "./components/EmailDetail";
import TemplateModal from "./components/TemplateModal";
import AddClientModal from "./components/AddClientModal";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [currentView, setCurrentView] = useState("mailbox");
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null); // null means show all mails
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

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
        console.log('Fetched sent emails from backend:', data.sentEmails);
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
    checkBackendStatus();
  }, []);

  const getCurrentEmails = () => {
    if (currentView === "sent") {
      console.log('Raw sentEmails from backend:', sentEmails);
      let emails = sentEmails.map(email => {
        const mappedEmail = {
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
          messageHtml: email.messageHtml,
          sentAt: email.sentAt,
          labels: email.labels || []
        };
        console.log('Mapped email labels:', mappedEmail.id, mappedEmail.labels);
        return mappedEmail;
      });

      // Filter by selected label if any
      if (selectedLabel) {
        console.log('Filtering emails by label:', selectedLabel);
        console.log('All emails before filtering:', emails.map(e => ({ id: e.id, labels: e.labels })));
        emails = emails.filter(email => email.labels && email.labels.includes(selectedLabel));
        console.log('Filtered emails:', emails.map(e => ({ id: e.id, labels: e.labels })));
      } else {
        console.log('Showing all emails (no label filter)');
      }

      return emails;
    }
    // For mailbox view, return empty array (no dummy emails)
    return [];
  };

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    setCurrentView("email-detail");
  };

  const handleBackToMails = () => {
    setSelectedEmail(null);
    setCurrentView("sent");
  };

  const handleLabelFilter = (labelId) => {
    console.log('Label filter clicked:', labelId, 'Current selectedLabel:', selectedLabel);
    if (selectedLabel === labelId) {
      console.log('Clearing label filter');
      setSelectedLabel(null); // Clear filter
    } else {
      console.log('Setting label filter to:', labelId);
      setSelectedLabel(labelId);
    }
    setCurrentView("sent");
  };

  // Refresh sent emails when labels might have changed
  const refreshSentEmails = () => {
    fetchSentEmails();
  };

  // Check backend status
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const handleTemplateClick = () => {
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (template) => {
    // This will be handled by the compose modal when it's opened
    setShowTemplateModal(false);
    // You could also open the compose modal with the template pre-filled
    // setShowComposeModal(true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen gradient-bg">
        {/* Sidebar */}
        <ErrorBoundary title="Sidebar Error" message="There was an error loading the sidebar. Please try refreshing the page.">
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
            selectedLabel={selectedLabel}
            onLabelFilter={handleLabelFilter}
            onTemplateClick={handleTemplateClick}
          />
        </ErrorBoundary>
        
        {/* Backend Status Indicator */}
        {backendStatus === 'disconnected' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium">
                  ⚠️ Backend Server Not Running
                </p>
                <p className="text-sm mt-1">
                  Please start the backend server: <code className="bg-red-200 px-1 rounded">cd backend && npm start</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Just the mailbox */}
        <div className="flex-1 flex flex-col">
          {currentView === "mailbox" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to MailBox</h2>
                <p className="text-gray-500">Click on "Sent Messages" in the sidebar to view your emails</p>
              </div>
            </div>
          )}
          
          {currentView === "sent" && (
            <ErrorBoundary title="Email List Error" message="There was an error loading the email list. Please try refreshing the page.">
            <EmailList
              emails={getCurrentEmails()}
              currentView={currentView}
              setEmails={setEmails}
              onEmailSelect={handleEmailSelect}
              onLabelsUpdated={refreshSentEmails}
              selectedLabel={selectedLabel}
            />
            </ErrorBoundary>
          )}
          
          {currentView === "email-detail" && selectedEmail && (
            <ErrorBoundary title="Email Detail Error" message="There was an error loading the email details.">
              <EmailDetail 
                email={selectedEmail}
                onBack={handleBackToMails}
              />
            </ErrorBoundary>
          )}
        </div>
        
        {/* Compose Modal */}
        {showCompose && (
          <ErrorBoundary title="Compose Error" message="There was an error with the compose modal. Please try again.">
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
          </ErrorBoundary>
        )}

        {/* Add Client Modal */}
        {showAddClientModal && (
          <ErrorBoundary title="Add Client Error" message="There was an error with the add client modal.">
            <AddClientModal
              isOpen={showAddClientModal}
              onClose={() => setShowAddClientModal(false)}
              onClientAdded={handleAddClient}
            />
          </ErrorBoundary>
        )}
        
        {/* Template Modal */}
        {showTemplateModal && (
          <ErrorBoundary>
            <TemplateModal
              isOpen={showTemplateModal}
              onSelectTemplate={handleTemplateSelect}
              onClose={() => setShowTemplateModal(false)}
            />
          </ErrorBoundary>
        )}
        
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
