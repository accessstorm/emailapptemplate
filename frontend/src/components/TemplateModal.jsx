import React, { useState, useMemo } from 'react';
import { emailTemplates, templateCategories } from '../data/emailTemplates';

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

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') {
      return emailTemplates;
    }
    return emailTemplates.filter(template => template.category === selectedCategory);
  }, [selectedCategory]);

  const handleTemplateSelect = (template) => {
    if (template.isCustom) {
      setCustomTemplate({
        name: template.name,
        subject: template.subject,
        content: template.html,
        title: template.html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1] || 'Custom Email'
      });
    } else {
      setSelectedTemplate(template);
    }
    setShowPreview(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    } else if (customTemplate.name) {
      const customTemplateData = {
        id: 'custom',
        name: customTemplate.name,
        subject: customTemplate.subject,
        html: customTemplate.content,
        variables: ['recipientName', 'yourName', 'yourTitle', 'companyName']
      };
      onSelectTemplate(customTemplateData);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setShowPreview(false);
    setCustomTemplate({ name: '', subject: '', content: '', title: '' });
    onClose();
  };

  if (!isOpen) return null;

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
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
                      className="btn-primary flex items-center gap-2"
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Template Name
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
                          Subject Line
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
                          Email Content (HTML)
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
                        <p className="text-sm text-blue-700">
                          Use <code className="bg-blue-100 px-1 rounded">{{recipientName}}</code>, 
                          <code className="bg-blue-100 px-1 rounded">{{yourName}}</code>, 
                          <code className="bg-blue-100 px-1 rounded">{{yourTitle}}</code>, 
                          <code className="bg-blue-100 px-1 rounded">{{companyName}}</code> in your content
                        </p>
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
    </div>
  );
}
