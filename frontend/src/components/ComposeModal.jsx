import { useState, useRef, useEffect } from "react";

export default function ComposeModal({ onClose, onEmailSent }) {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const insertEmoji = (emoji) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message + emoji
    }));
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
    '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
    '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
    '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
    '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
  ];

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSend = async () => {
    setStatus("Sending...");
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('to', formData.to);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      
      // Add attachments
      attachments.forEach(attachment => {
        formDataToSend.append('attachments', attachment.file);
      });

      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        body: formDataToSend, // Don't set Content-Type, let browser set it with boundary
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("✅ Sent!");
        // Call the callback to add to sent emails
        onEmailSent({
          ...formData,
          attachments: attachments
        });
        setFormData({ to: "", subject: "", message: "" });
        setAttachments([]);
        setTimeout(() => onClose(), 1500);
      } else {
        setStatus(`❌ ${data.message || "Failed"}`);
        console.error("Email error:", data);
      }
    } catch (error) {
      setStatus("❌ Connection Error");
      console.error("Network error:", error);
    }
  };

  return (
    <>
      {/* Gmail-style Compose Modal */}
      <div className="fixed bottom-0 right-0 w-96 bg-white border border-gray-300 shadow-2xl z-50">
          {/* Header */}
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-300">
            <h3 className="font-medium text-gray-800">New Message</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                {isMinimized ? "□" : "➖"}
              </button>
              <button 
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                ✖️
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* To Field */}
              <div className="px-4 py-2 border-b border-gray-200">
                <input
                  name="to"
                  type="email"
                  placeholder="To"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full border-none outline-none text-sm"
                />
              </div>

              {/* Subject Field */}
              <div className="px-4 py-2 border-b border-gray-200">
                <input
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border-none outline-none text-sm"
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                        <span>📎</span>
                        <span className="truncate max-w-32">{attachment.name}</span>
                        <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
                        <button
                          onClick={() => removeAttachment(attachment.id)}
                          className="text-gray-500 hover:text-red-500 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Body */}
              <div className="px-4 py-2 flex-1 relative">
                <textarea
                  name="message"
                  placeholder="Compose email"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border-none outline-none text-sm resize-none h-32"
                ></textarea>
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="emoji-picker absolute bottom-0 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-1">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => insertEmoji(emoji)}
                          className="p-1 hover:bg-gray-100 rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSend}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#ffda03' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e6c400'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffda03'}
                  >
                    Send
                  </button>
                  
                  {/* Attachment Button */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title="Attach files"
                  >
                    📎
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {/* Link Button */}
                  <button 
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title="Insert link"
                    onClick={() => {
                      const url = prompt('Enter URL:');
                      if (url) {
                        setFormData(prev => ({
                          ...prev,
                          message: prev.message + `\n${url}`
                        }));
                      }
                    }}
                  >
                    🔗
                  </button>
                  
                  {/* Emoji Button */}
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-1 ${showEmojiPicker ? 'bg-gray-200' : ''}`}
                    title="Insert emoji"
                  >
                    😊
                  </button>
                  
                  {/* Google Drive Button */}
                  <button 
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title="Insert from Google Drive"
                    onClick={() => alert('Google Drive integration would go here')}
                  >
                    📁
                  </button>
                  
                  {/* Image Button */}
                  <button 
                    className="text-gray-600 hover:text-gray-800 p-1"
                    title="Insert image"
                    onClick={() => {
                      const imageUrl = prompt('Enter image URL:');
                      if (imageUrl) {
                        setFormData(prev => ({
                          ...prev,
                          message: prev.message + `\n![Image](${imageUrl})`
                        }));
                      }
                    }}
                  >
                    🖼️
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {status}
                </div>
              </div>
            </>
          )}
        </div>
    </>
  );
}
