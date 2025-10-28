import { useState, useRef, useEffect } from "react";
import { validateEmailForm } from "../utils/validation";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { regenerateTemplateHTML } from "../utils/visualEditorUtils";
import TemplateModal from "./TemplateModal";

export default function ComposeModal({ onClose, onEmailSent, selectedClient, onClientCleared, currentDraft, onDraftCleared, onSaveDraft, onUpdateDraft }) {
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
    messageHtml: "",
  });
  const [status, setStatus] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [confidentialMode, setConfidentialMode] = useState(false);
  const [fontSize, setFontSize] = useState("14px");
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUserWorking, setIsUserWorking] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);
  const messageRef = useRef(null);
  
  
  // Callback ref to handle contentEditable initialization
  const setMessageRef = (node) => {
    messageRef.current = node;
  };

  // Auto-fill email when client is selected
  useEffect(() => {
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        to: selectedClient.email
      }));
    }
  }, [selectedClient]);

  // Load draft data when currentDraft changes
  useEffect(() => {
    // Don't reset attachments if user is actively working
    if (isUserWorking) {
      return;
    }
    
    if (currentDraft) {
      console.log('Loading draft:', currentDraft);
      setFormData({
        to: currentDraft.to || "",
        cc: currentDraft.cc || "",
        bcc: currentDraft.bcc || "",
        subject: currentDraft.subject || "",
        message: currentDraft.message || "",
        messageHtml: currentDraft.messageHtml || ""
      });
      console.log("📎 Loading draft attachments:", currentDraft.attachments);
      setAttachments(currentDraft.attachments || []);
    } else {
      // Clear form when starting fresh
      setFormData({
        to: "",
        cc: "",
        bcc: "",
        subject: "",
        message: "",
        messageHtml: ""
      });
      console.log("📎 Clearing attachments for fresh start");
      setAttachments([]);
    }
  }, [currentDraft, isUserWorking]);

  // Restore contentEditable content when currentDraft changes
  useEffect(() => {
    if (messageRef.current) {
      if (currentDraft && currentDraft.messageHtml) {
        // Only restore if the content is different to avoid overwriting user input
        if (messageRef.current.innerHTML !== currentDraft.messageHtml) {
          console.log('Restoring contentEditable with:', currentDraft.messageHtml);
          messageRef.current.innerHTML = currentDraft.messageHtml;
        }
      } else if (!currentDraft) {
        // Only clear if we're not loading a draft
        console.log('Clearing contentEditable');
        messageRef.current.innerHTML = "";
      }
    }
  }, [currentDraft]);

  // Ensure contentEditable is properly editable after content restoration
  useEffect(() => {
    if (messageRef.current && currentDraft && currentDraft.messageHtml) {
      // Small delay to ensure the content is set before making it editable
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.focus();
          // Ensure the contentEditable attribute is still set
          messageRef.current.setAttribute('contenteditable', 'true');
        }
      }, 100);
    }
  }, [currentDraft]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (formData.to || formData.subject || formData.message) {
        try {
          if (currentDraft) {
            // Update existing draft
            await onUpdateDraft(currentDraft._id, formData);
          } else {
            // Create new draft
            await onSaveDraft(formData);
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 10000); // Auto-save every 10 seconds for better user experience

    return () => clearInterval(autoSaveInterval);
  }, [formData, currentDraft, onSaveDraft, onUpdateDraft]);

  // Debounced auto-save on typing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.to || formData.subject || formData.message) {
        try {
          setIsSaving(true);
          if (currentDraft) {
            // Update existing draft
            await onUpdateDraft(currentDraft._id, formData);
          } else {
            // Create new draft
            await onSaveDraft(formData);
          }
          setIsSaving(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setIsSaving(false);
        }
      }
    }, 2000); // Auto-save 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData, currentDraft, onSaveDraft, onUpdateDraft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Debounced validation
  const debouncedValidation = useDebouncedCallback((data) => {
    const validation = validateEmailForm(data);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
    } else {
      setValidationErrors({});
    }
  }, 500);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    }));
    setIsUserWorking(true); // Mark that user is actively working
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setIsUserWorking(true); // Mark that user is actively working
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
    if (messageRef.current) {
      messageRef.current.focus();
      document.execCommand('insertText', false, emoji);
    }
    setShowEmojiPicker(false);
  };

  const applyFormatting = (command, value = null) => {
    if (messageRef.current) {
      messageRef.current.focus();
      const success = document.execCommand(command, false, value);
      if (!success) {
        console.warn(`Command ${command} failed`);
      }
    }
  };

  const toggleBold = () => {
    applyFormatting('bold');
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    applyFormatting('italic');
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    applyFormatting('underline');
    setIsUnderline(!isUnderline);
  };

  const changeTextColor = (color) => {
    applyFormatting('foreColor', color);
    setTextColor(color);
  };

  const changeHighlightColor = (color) => {
    applyFormatting('backColor', color);
    setHighlightColor(color);
  };

  const changeAlignment = (align) => {
    if (align === 'left') {
      applyFormatting('justifyLeft');
    } else if (align === 'center') {
      applyFormatting('justifyCenter');
    } else if (align === 'right') {
      applyFormatting('justifyRight');
    } else if (align === 'justify') {
      applyFormatting('justifyFull');
    }
    setTextAlign(align);
  };

  const insertList = (ordered = false) => {
    applyFormatting(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormatting('createLink', url);
    }
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      applyFormatting('insertImage', imageUrl);
    }
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

  const handleTemplateSelect = (template) => {
    console.log('Template selected:', template);
    
    // Replace template variables with placeholder text
    let processedSubject = template.subject;
    let processedHtml = template.html;
    
    // Check if this is a Visual Editor template that needs HTML regeneration
    if (template.isUserTemplate && template.content) {
      console.log('Visual Editor template detected - regenerating HTML for proper image display');
      try {
        // Regenerate HTML from component data to ensure proper email structure
        const regeneratedHTML = regenerateTemplateHTML(template);
        if (regeneratedHTML) {
          processedHtml = regeneratedHTML;
          console.log('Successfully regenerated HTML for Visual Editor template');
        } else {
          console.warn('Failed to regenerate HTML, using saved HTML');
        }
      } catch (error) {
        console.error('Error regenerating Visual Editor template HTML:', error);
        console.log('Falling back to saved HTML');
      }
    }
    
    // Replace common variables with placeholder text
    const variableReplacements = {
      '{{clientName}}': 'Client Name',
      '{{projectName}}': 'Project Name',
      '{{yourName}}': 'Your Name',
      '{{yourTitle}}': 'Your Title',
      '{{companyName}}': 'Your Company',
      '{{recipientName}}': 'Recipient Name',
      '{{customSubject}}': 'Email Subject',
      '{{customTitle}}': 'Email Title',
      '{{customContent}}': 'Your email content here...'
    };
    
    Object.entries(variableReplacements).forEach(([variable, replacement]) => {
      processedSubject = processedSubject.replace(new RegExp(variable, 'g'), replacement);
      processedHtml = processedHtml.replace(new RegExp(variable, 'g'), replacement);
    });
    
    setFormData(prev => ({
      ...prev,
      subject: processedSubject,
      message: processedHtml.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
      messageHtml: processedHtml
    }));
    setShowTemplateSelector(false);
    
    // Focus on the message area after template is applied
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.focus();
      }
    }, 100);
  };

  const handleSend = async () => {
    if (isSending) return; // Prevent multiple sends
    
    // Validate form before sending
    const validation = validateEmailForm({ ...formData, attachments });
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setStatus("Please fix the errors before sending");
      return;
    }
    
    setIsSending(true);
    setStatus("Sending email...");
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('to', formData.to);
      formDataToSend.append('cc', formData.cc);
      formDataToSend.append('bcc', formData.bcc);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('messageHtml', formData.messageHtml);
      
      // Add draftId if this is being sent from a draft
      if (currentDraft && currentDraft._id) {
        formDataToSend.append('draftId', currentDraft._id);
      }
      
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
        setIsSending(false);
        // Call the callback to add to sent emails
        onEmailSent({
          ...formData,
          attachments: attachments
        });
        setFormData({ to: "", cc: "", bcc: "", subject: "", message: "", messageHtml: "" });
        setAttachments([]);
        setIsUserWorking(false); // Reset user working flag
        setTimeout(() => onClose(), 1500);
      } else {
        setStatus(`❌ ${data.userMessage || data.message || "Failed"}`);
        setIsSending(false);
        console.error("Email error:", data);
      }
    } catch (error) {
      setStatus("❌ Connection Error");
      setIsSending(false);
      console.error("Network error:", error);
    }
  };

  const handleClose = async () => {
    // Save as draft before closing if there's content
    if (formData.to || formData.subject || formData.message) {
      try {
        if (currentDraft) {
          // Update existing draft
          await onUpdateDraft(currentDraft._id, formData);
        } else {
          // Create new draft
          await onSaveDraft(formData);
        }
        setStatus("Draft saved");
      } catch (error) {
        console.error('Error saving draft on close:', error);
      }
    }
    // Clear current draft so next compose starts fresh
    setIsUserWorking(false); // Reset user working flag
    onDraftCleared();
    onClose();
  };

  return (
    <>
      {/* Modern Compose Modal */}
      <div className="modern-compose-modal">
        {/* Header - Clickable to minimize */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl flex-shrink-0 cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? "Click to maximize" : "Click to minimize"}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {currentDraft ? 'Edit Draft' : 'Compose Email'}
                </h3>
                <p className="text-xs text-blue-100">
                  {currentDraft ? 'Continue editing your draft' : 'Create a new message'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* To Field */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                      {selectedClient && (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {selectedClient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-blue-800">{selectedClient.name}</div>
                              <div className="text-xs text-blue-600">{selectedClient.company}</div>
                            </div>
                          </div>
                          <button
                            onClick={onClientCleared}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Clear client"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {currentDraft && (
                        <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              📝
                            </div>
                            <div>
                              <div className="text-sm font-medium text-orange-800">Draft Message</div>
                              <div className="text-xs text-orange-600">
                                Last saved: {new Date(currentDraft.lastModified).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={onDraftCleared}
                            className="text-orange-500 hover:text-orange-700 p-1"
                            title="Clear draft"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 min-w-[25px] font-medium">To</span>
                        <div className="flex-1">
                          <input
                            name="to"
                            type="email"
                            placeholder="Enter recipients..."
                            value={formData.to}
                            onChange={handleChange}
                            className={`flex-1 modern-input ${validationErrors.to ? 'border-red-500' : ''}`}
                          />
                          {validationErrors.to && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.to}</p>
                          )}
                        </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCcBcc(!showCcBcc)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Cc
                    </button>
                    <button
                      onClick={() => setShowCcBcc(!showCcBcc)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Bcc
                    </button>
                  </div>
                </div>
                
                {/* CC and BCC Fields */}
                {showCcBcc && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 min-w-[25px] font-medium">Cc</span>
                      <input
                        name="cc"
                        type="email"
                        placeholder="Cc recipients..."
                        value={formData.cc}
                        onChange={handleChange}
                        className="flex-1 modern-input"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 min-w-[25px] font-medium">Bcc</span>
                      <input
                        name="bcc"
                        type="email"
                        placeholder="Bcc recipients..."
                        value={formData.bcc}
                        onChange={handleChange}
                        className="flex-1 modern-input"
                      />
                    </div>
                  </div>
                )}
              </div>

            {/* Subject Field */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <input
                name="subject"
                type="text"
                placeholder="Enter subject..."
                value={formData.subject}
                onChange={handleChange}
                className={`w-full modern-input ${validationErrors.subject ? 'border-red-500' : ''}`}
              />
              {validationErrors.subject && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.subject}</p>
              )}
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-sm border border-blue-200">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="truncate max-w-32 font-medium">{attachment.name}</span>
                      <span className="text-gray-500 text-xs">({formatFileSize(attachment.size)})</span>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-gray-500 hover:text-red-500 ml-1 p-1 rounded hover:bg-red-50"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Body - Rich Text Canvas */}
            <div className="p-4 flex-1 relative min-h-[200px] overflow-hidden">
              <div
                ref={setMessageRef}
                contentEditable
                data-placeholder="Start typing your message..."
                className="w-full border-none outline-none text-sm resize-none h-48 min-h-[160px] max-h-80 overflow-y-auto focus:outline-none p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  style={{
                    fontSize: fontSize,
                    color: textColor,
                    textAlign: textAlign,
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isUnderline ? 'underline' : 'none',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif'
                  }}
                  onInput={(e) => {
                    // Store both HTML and plain text versions
                    const htmlContent = e.target.innerHTML;
                    const textContent = e.target.innerText;
                    console.log('ContentEditable input - HTML:', htmlContent, 'Text:', textContent);
                    setFormData(prev => ({ 
                      ...prev, 
                      message: textContent, // Use plain text for backend
                      messageHtml: htmlContent // Store HTML for display
                    }));
                    
                    // Update formatting state based on current selection
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      const container = range.commonAncestorContainer;
                      const parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
                      
                      if (parent) {
                        setIsBold(parent.style.fontWeight === 'bold' || parent.tagName === 'B' || parent.tagName === 'STRONG');
                        setIsItalic(parent.style.fontStyle === 'italic' || parent.tagName === 'I' || parent.tagName === 'EM');
                        setIsUnderline(parent.style.textDecoration === 'underline' || parent.tagName === 'U');
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle keyboard shortcuts
                    if (e.ctrlKey || e.metaKey) {
                      switch(e.key) {
                        case 'b':
                          e.preventDefault();
                          toggleBold();
                          break;
                        case 'i':
                          e.preventDefault();
                          toggleItalic();
                          break;
                        case 'u':
                          e.preventDefault();
                          toggleUnderline();
                          break;
                      }
                    }
                  }}
                  onFocus={() => {
                    // Ensure the contentEditable is properly focused and editable
                    if (messageRef.current) {
                      messageRef.current.focus();
                    }
                  }}
                  onClick={() => {
                    // Ensure the contentEditable is properly focused and editable when clicked
                    if (messageRef.current) {
                      messageRef.current.focus();
                    }
                  }}
                  suppressContentEditableWarning={true}
                ></div>
                
                {/* Placeholder styling */}
                <style jsx>{`
                  [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                  }
                `}</style>
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-grid">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => insertEmoji(emoji)}
                          className="emoji-button"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            {/* Simplified Toolbar */}
            <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                {/* Left side - Action buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={insertLink}
                    className="modern-toolbar-button"
                    title="Insert link"
                    style={{ color: '#374151' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="#374151" viewBox="0 0 24 24" style={{ color: '#374151' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="modern-toolbar-button"
                    title="Attach files"
                    style={{ color: '#374151' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="#374151" viewBox="0 0 24 24" style={{ color: '#374151' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`modern-toolbar-button ${showEmojiPicker ? 'active' : ''}`}
                    title="Insert emoji"
                    style={{ color: '#374151' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="#374151" viewBox="0 0 24 24" style={{ color: '#374151' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => setShowTemplateSelector(true)}
                    className="modern-toolbar-button"
                    title="Email Templates"
                    style={{ color: '#374151' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="#374151" viewBox="0 0 24 24" style={{ color: '#374151' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* Right side - Send and Discard buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSend}
                    disabled={isSending}
                    className={`btn-accent flex items-center gap-2 shadow-glow ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                  
                  <button 
                    onClick={handleClose}
                    className="modern-toolbar-button text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Discard"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Status */}
              <div className="text-sm text-gray-500 mt-2 text-center">
                {status || (isSaving ? 'Saving draft...' : (currentDraft ? 'Draft auto-saved' : 'Auto-save enabled'))}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Template Modal */}
        <TemplateModal
          isOpen={showTemplateSelector}
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
    </>
  );
}
