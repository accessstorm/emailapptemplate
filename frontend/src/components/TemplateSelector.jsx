import React, { useState } from 'react';
import { emailTemplates, applyTemplate, getTemplateCategories, getTemplatePreview } from '../utils/emailTemplates';

export default function TemplateSelector({ 
  onTemplateSelect, 
  onClose, 
  isOpen = false 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['all', ...getTemplateCategories()];
  const templates = selectedCategory === 'all' 
    ? Object.values(emailTemplates)
    : Object.values(emailTemplates).filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setShowPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Templates</h3>
                <p className="text-sm text-blue-100">Choose a template to get started</p>
              </div>
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
        </div>

        <div className="flex h-96">
          {/* Sidebar - Categories and Templates */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Category Filter */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Categories</h4>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Templates</h4>
              <div className="space-y-2">
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-800 mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {template.subject}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {template.variables.length} variables
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Preview */}
          <div className="flex-1 flex flex-col">
            {selectedTemplate ? (
              <>
                {/* Template Info */}
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {selectedTemplate.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedTemplate.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Category: {selectedTemplate.category}</span>
                    <span>Variables: {selectedTemplate.variables.length}</span>
                  </div>
                </div>

                {/* Preview */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Subject Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                        {getTemplatePreview(selectedTemplate.id).subject}
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message Preview
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {getTemplatePreview(selectedTemplate.id).message}
                      </div>
                    </div>

                    {/* Variables */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required Variables
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.variables.map(variable => (
                          <span
                            key={variable}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleApplyTemplate}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                    >
                      Use This Template
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Select a template to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
