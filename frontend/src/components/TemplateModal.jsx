import React, { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { emailTemplates, templateCategories } from '../data/emailTemplates';
import VisualEditor from './VisualEditor';

export default function TemplateModal({ isOpen, onClose, onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    title: ''
  });
  const [userTemplates, setUserTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visualEditorContent, setVisualEditorContent] = useState('');

  // Load user templates from localStorage on component mount
  React.useEffect(() => {
    const savedTemplates = localStorage.getItem('userEmailTemplates');
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setUserTemplates(parsedTemplates);
        console.log('Loaded user templates:', parsedTemplates);
      } catch (error) {
        console.error('Error loading user templates:', error);
        setUserTemplates([]);
      }
    }
  }, []);

  // Refresh user templates when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const savedTemplates = localStorage.getItem('userEmailTemplates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          setUserTemplates(parsedTemplates);
          console.log('Refreshed user templates on modal open:', parsedTemplates);
        } catch (error) {
          console.error('Error parsing saved templates:', error);
        }
      }
    }
  }, [isOpen]);

  // Debug custom template changes
  React.useEffect(() => {
    console.log('Custom template updated:', customTemplate);
    if (customTemplate.content !== undefined) {
      console.log('Content type:', typeof customTemplate.content, 'Value:', customTemplate.content);
    }
  }, [customTemplate]);

  // Safe variable replacement function
  const replaceVariables = (content) => {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    try {
      // Ensure content is a string and not null/undefined
      const safeContent = String(content);
      return safeContent
        .replace(/\{\{recipientName\}\}/g, 'John Doe')
        .replace(/\{\{yourName\}\}/g, 'Your Name')
        .replace(/\{\{yourTitle\}\}/g, 'Your Title')
        .replace(/\{\{companyName\}\}/g, 'Your Company');
    } catch (error) {
      console.error('Error replacing variables:', error);
      return String(content || '');
    }
  };

  // Helper function to safely check if content is valid
  const isValidContent = (content) => {
    try {
      return content && typeof content === 'string' && content.trim().length > 0;
    } catch (error) {
      console.error('Error checking content validity:', error);
      return false;
    }
  };

  // Save template to user templates
  const saveToUserTemplates = async () => {
    if (!customTemplate.name || !customTemplate.subject || !isValidContent(customTemplate.content)) {
      alert('Please fill in all required fields before saving');
      return;
    }

    setIsSaving(true);
    try {
      const newTemplate = {
        id: `user_${Date.now()}`,
        name: customTemplate.name.trim(),
        subject: customTemplate.subject.trim(),
        html: customTemplate.content ? String(customTemplate.content).trim() : '',
        category: 'Your Templates',
        description: 'Your custom template',
        variables: ['recipientName', 'yourName', 'yourTitle', 'companyName'],
        isUserTemplate: true,
        createdAt: new Date().toISOString()
      };

      const updatedTemplates = [...userTemplates, newTemplate];
      setUserTemplates(updatedTemplates);
      localStorage.setItem('userEmailTemplates', JSON.stringify(updatedTemplates));
      
      alert('Template saved to Your Templates!');
      console.log('Template saved:', newTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete user template
  const deleteUserTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = userTemplates.filter(template => template.id !== templateId);
      setUserTemplates(updatedTemplates);
      localStorage.setItem('userEmailTemplates', JSON.stringify(updatedTemplates));
      console.log('Template deleted:', templateId);
    }
  };

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') {
      return [...emailTemplates, ...userTemplates];
    } else if (selectedCategory === 'Your Templates') {
      return userTemplates;
    }
    return emailTemplates.filter(template => template.category === selectedCategory);
  }, [selectedCategory, userTemplates]);

  const handleTemplateSelect = (template) => {
    console.log('Template selected:', template);
    
    if (template.isCustom) {
      // For custom template, initialize with default values
      console.log('Initializing custom template');
      setCustomTemplate({
        name: '',
        subject: '',
        content: '',
        title: ''
      });
      setSelectedTemplate(null); // Clear selected template
    } else {
      console.log('Selecting predefined template:', template.name);
      setSelectedTemplate(template);
      setCustomTemplate({ name: '', subject: '', content: '', title: '' }); // Clear custom template
    }
    setShowPreview(true);
  };

  const handleApplyTemplate = () => {
    try {
      if (selectedTemplate) {
        onSelectTemplate(selectedTemplate);
        onClose();
      } else if (customTemplate.name && customTemplate.subject && isValidContent(customTemplate.content)) {
        const customTemplateData = {
          id: 'custom',
          name: customTemplate.name.trim(),
          subject: customTemplate.subject.trim(),
          html: customTemplate.content ? String(customTemplate.content).trim() : '',
          variables: ['recipientName', 'yourName', 'yourTitle', 'companyName']
        };
        onSelectTemplate(customTemplateData);
        onClose();
      } else {
        alert('Please fill in all required fields: Template Name, Subject, and Content');
      }
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Error applying template. Please try again.');
    }
  };

  const handleVisualEditorSave = (data) => {
    console.log('Visual editor save data:', data);
    
    // If a template was saved, refresh the user templates list
    if (data.template) {
      // Reload user templates from localStorage
      const savedTemplates = localStorage.getItem('userEmailTemplates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          setUserTemplates(parsedTemplates);
          console.log('Refreshed user templates:', parsedTemplates);
        } catch (error) {
          console.error('Error parsing saved templates:', error);
        }
      }
    }
    
    setCustomTemplate(prev => ({
      ...prev,
      content: data.html
    }));
    setVisualEditorContent(data.content);
    setShowVisualEditor(false);
    console.log('Updated custom template:', { ...customTemplate, content: data.html });
  };

  const handleVisualEditorClose = () => {
    setShowVisualEditor(false);
    setIsFullscreen(false);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setShowPreview(false);
    setCustomTemplate({ name: '', subject: '', content: '', title: '' });
    setShowVisualEditor(false);
    setIsFullscreen(false);
    onClose();
  };

  if (!isOpen) return null;

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Email Templates</h2>
            <p className="text-blue-100">Choose a template to get started</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar - Template List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Category Filter */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {templateCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {template.category}
                          </span>
                          {template.isCustom && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                              Custom
                            </span>
                          )}
                          {template.isUserTemplate && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                              Your Template
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {template.isUserTemplate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUserTemplate(template.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                            title="Delete template"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Preview */}
          <div className="flex-1 flex flex-col">
            {showPreview ? (
              <>
                {/* Preview Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {selectedTemplate ? selectedTemplate.name : 'Custom Template'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Subject: {selectedTemplate ? selectedTemplate.subject : customTemplate.subject}
                      </p>
                    </div>
                    <button
                      onClick={handleApplyTemplate}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedTemplate || (customTemplate.name && customTemplate.subject && isValidContent(customTemplate.content))
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!selectedTemplate && (!customTemplate.name || !customTemplate.subject || !isValidContent(customTemplate.content))}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Apply Template
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedTemplate ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                      {/* Custom Template Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template Name *
                          </label>
                          <input
                            type="text"
                            value={customTemplate.name}
                            onChange={(e) => setCustomTemplate({...customTemplate, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter template name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject Line *
                          </label>
                          <input
                            type="text"
                            value={customTemplate.subject}
                            onChange={(e) => setCustomTemplate({...customTemplate, subject: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email subject"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Content (HTML) *
                          </label>
                          <textarea
                            value={customTemplate.content}
                            onChange={(e) => setCustomTemplate({...customTemplate, content: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-64"
                            placeholder="Enter your custom HTML content"
                          />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Available Variables:</h4>
                          <p className="text-sm text-blue-700 mb-2">
                            Use these variables in your content and subject:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <code className="bg-blue-100 px-1 rounded">{'{{recipientName}}'}</code>
                              <span className="text-blue-600">→ Recipient's name</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <code className="bg-blue-100 px-1 rounded">{'{{yourName}}'}</code>
                              <span className="text-blue-600">→ Your name</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <code className="bg-blue-100 px-1 rounded">{'{{yourTitle}}'}</code>
                              <span className="text-blue-600">→ Your title</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <code className="bg-blue-100 px-1 rounded">{'{{companyName}}'}</code>
                              <span className="text-blue-600">→ Your company</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">💡 Tips:</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Use HTML tags for formatting (bold, italic, lists)</li>
                            <li>• Variables will be replaced with placeholder text</li>
                            <li>• Preview updates in real-time as you type</li>
                          </ul>
                        </div>
                        
                        {/* Visual Editor and Save Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              console.log('Opening visual editor...');
                              setShowVisualEditor(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                            </svg>
                            Open Visual Editor
                          </button>
                          
                          <button
                            onClick={saveToUserTemplates}
                            disabled={isSaving || !customTemplate.name || !customTemplate.subject || !isValidContent(customTemplate.content)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              isSaving || !customTemplate.name || !customTemplate.subject || !isValidContent(customTemplate.content)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {isSaving ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Saving...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Save to Your Templates
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Live Preview</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
                          {customTemplate.content && typeof customTemplate.content === 'string' && customTemplate.content.trim() ? (
                            <div dangerouslySetInnerHTML={{ 
                              __html: replaceVariables(customTemplate.content)
                            }} />
                          ) : (
                            <div className="text-gray-400 text-center py-8">
                              <div className="text-4xl mb-2">📝</div>
                              <p>Start typing to see preview</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">📧</div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Template</h3>
                  <p className="text-gray-500">Choose a template from the sidebar to see a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Visual Editor Modal */}
      {showVisualEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-2xl w-full ${isFullscreen ? 'h-full' : 'max-w-7xl max-h-[90vh]'}`}>
            <DndProvider backend={HTML5Backend}>
              <VisualEditor
                initialContent={visualEditorContent}
                onSave={handleVisualEditorSave}
                onClose={handleVisualEditorClose}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                templateName={customTemplate.name}
                templateSubject={customTemplate.subject}
              />
            </DndProvider>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
          showVisualEditor: {showVisualEditor ? 'true' : 'false'}
        </div>
      )}
    </div>
    );
  } catch (error) {
    console.error('Error in TemplateModal:', error);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error in Template Modal</h2>
          <p className="text-gray-700 mb-4">There was an error loading the template modal. Please try again.</p>
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
