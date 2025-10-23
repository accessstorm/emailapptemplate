import { useState } from "react";
import ComposeModal from "./components/ComposeModal";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import EmailList from "./components/EmailList";

function App() {
  const [currentView, setCurrentView] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: "Google",
      subject: "Security alert - App password created",
      preview: "We noticed a new app password was created for your account...",
      time: "4:20 PM",
      isRead: false,
      isStarred: false,
    },
    {
      id: 2,
      from: "LinkedIn",
      subject: "[Important]- Need updated profile for Shortlisting!",
      preview: "Update your profile to get better job opportunities...",
      time: "3:45 PM",
      isRead: false,
      isStarred: true,
    },
    {
      id: 3,
      from: "Steam",
      subject: "Backrooms Media from your Steam wishlist is now on",
      preview: "The game you wishlisted is now available...",
      time: "2:30 PM",
      isRead: true,
      isStarred: false,
    },
    {
      id: 4,
      from: "Naukri Campus",
      subject: "Best CV Formats for Freshers: Simple, Professional &...",
      preview: "Check out these professional CV templates...",
      time: "1:15 PM",
      isRead: true,
      isStarred: false,
    },
    {
      id: 5,
      from: "Hyperskill Crew",
      subject: "Welcome to Hyperskill -",
      preview: "Start your programming journey with us...",
      time: "12:00 PM",
      isRead: false,
      isStarred: false,
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
  };

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
      }));
    }
    return emails;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onComposeClick={() => setShowCompose(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Email List */}
        <EmailList 
          emails={getCurrentEmails()} 
          currentView={currentView}
          setEmails={setEmails}
        />
      </div>
      
      {/* Compose Modal */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onEmailSent={handleEmailSent} />}
    </div>
  );
}

export default App;
