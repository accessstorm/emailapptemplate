import React, { useState } from 'react';

// Simple test component for custom template functionality
export default function TemplateTest() {
  const [testContent, setTestContent] = useState(`
    <h2>Test Email</h2>
    <p>Dear {{recipientName}},</p>
    <p>I'm {{yourName}}, {{yourTitle}} at {{companyName}}.</p>
    <p>This is a test email with variables.</p>
  `);

  const replaceVariables = (content) => {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    try {
      return content
        .replace(/\{\{recipientName\}\}/g, 'John Doe')
        .replace(/\{\{yourName\}\}/g, 'Your Name')
        .replace(/\{\{yourTitle\}\}/g, 'Your Title')
        .replace(/\{\{companyName\}\}/g, 'Your Company');
    } catch (error) {
      console.error('Error replacing variables:', error);
      return content;
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Template Test</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">HTML Content:</label>
          <textarea
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Enter HTML with variables..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Preview:</label>
          <div className="border rounded p-2 h-32 overflow-y-auto bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: replaceVariables(testContent) }} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-blue-50 rounded">
        <p className="text-sm text-blue-800">
          <strong>Variables:</strong> {{recipientName}}, {{yourName}}, {{yourTitle}}, {{companyName}}
        </p>
      </div>
    </div>
  );
}
