/**
 * Email template system
 */

export const emailTemplates = {
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{companyName}}!',
    message: `Hi {{clientName}},

Welcome to {{companyName}}! We're excited to have you on board.

Here are some important details to get you started:
- Your account is now active
- You can reach us at {{contactEmail}} for any questions
- Visit our website at {{websiteUrl}} for more information

Best regards,
{{senderName}}`,
    variables: ['clientName', 'companyName', 'contactEmail', 'websiteUrl', 'senderName'],
    category: 'onboarding'
  },
  
  followUp: {
    id: 'followUp',
    name: 'Follow Up',
    subject: 'Follow up on {{topic}}',
    message: `Hi {{clientName}},

I wanted to follow up on our conversation about {{topic}}.

{{customMessage}}

Please let me know if you have any questions or if there's anything else I can help you with.

Best regards,
{{senderName}}`,
    variables: ['clientName', 'topic', 'customMessage', 'senderName'],
    category: 'follow-up'
  },
  
  meetingRequest: {
    id: 'meetingRequest',
    name: 'Meeting Request',
    subject: 'Meeting Request - {{meetingTopic}}',
    message: `Hi {{clientName}},

I hope this email finds you well. I would like to schedule a meeting to discuss {{meetingTopic}}.

Proposed times:
- {{timeOption1}}
- {{timeOption2}}
- {{timeOption3}}

Please let me know which time works best for you, or suggest an alternative time.

Meeting details:
- Duration: {{duration}}
- Location: {{location}}
- Agenda: {{agenda}}

Looking forward to hearing from you.

Best regards,
{{senderName}}`,
    variables: ['clientName', 'meetingTopic', 'timeOption1', 'timeOption2', 'timeOption3', 'duration', 'location', 'agenda', 'senderName'],
    category: 'meeting'
  },
  
  invoiceReminder: {
    id: 'invoiceReminder',
    name: 'Invoice Reminder',
    subject: 'Payment Reminder - Invoice #{{invoiceNumber}}',
    message: `Hi {{clientName}},

This is a friendly reminder that payment for Invoice #{{invoiceNumber}} is due on {{dueDate}}.

Invoice Details:
- Amount: {{amount}}
- Due Date: {{dueDate}}
- Invoice Number: {{invoiceNumber}}

You can make payment by:
- Bank transfer to {{bankDetails}}
- Online payment at {{paymentLink}}
- Check to {{companyAddress}}

If you have already made payment, please disregard this email.

Thank you for your business!

Best regards,
{{senderName}}`,
    variables: ['clientName', 'invoiceNumber', 'dueDate', 'amount', 'bankDetails', 'paymentLink', 'companyAddress', 'senderName'],
    category: 'billing'
  },
  
  thankYou: {
    id: 'thankYou',
    name: 'Thank You',
    subject: 'Thank you for {{action}}',
    message: `Hi {{clientName}},

Thank you for {{action}}. We really appreciate your {{appreciationReason}}.

{{customMessage}}

If you have any questions or need further assistance, please don't hesitate to contact us.

Best regards,
{{senderName}}`,
    variables: ['clientName', 'action', 'appreciationReason', 'customMessage', 'senderName'],
    category: 'appreciation'
  },
  
  projectUpdate: {
    id: 'projectUpdate',
    name: 'Project Update',
    subject: 'Project Update - {{projectName}}',
    message: `Hi {{clientName}},

Here's an update on the {{projectName}} project:

Current Status: {{currentStatus}}
Progress: {{progressPercentage}}%

Recent Accomplishments:
{{accomplishments}}

Next Steps:
{{nextSteps}}

Timeline: {{timeline}}

If you have any questions or concerns, please let me know.

Best regards,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'currentStatus', 'progressPercentage', 'accomplishments', 'nextSteps', 'timeline', 'senderName'],
    category: 'project'
  }
};

/**
 * Apply template with variables
 * @param {string} templateId - Template ID
 * @param {Object} variables - Variables to replace
 * @returns {Object} - Email object with subject and message
 */
export const applyTemplate = (templateId, variables = {}) => {
  const template = emailTemplates[templateId];
  if (!template) {
    throw new Error(`Template with ID "${templateId}" not found`);
  }

  let subject = template.subject;
  let message = template.message;

  // Replace variables in subject and message
  template.variables.forEach(variable => {
    const placeholder = `{{${variable}}}`;
    const value = variables[variable] || '';
    
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    message = message.replace(new RegExp(placeholder, 'g'), value);
  });

  return {
    subject: subject.trim(),
    message: message.trim(),
    templateId,
    variables
  };
};

/**
 * Get templates by category
 * @param {string} category - Template category
 * @returns {Array} - Templates in the category
 */
export const getTemplatesByCategory = (category) => {
  return Object.values(emailTemplates).filter(template => template.category === category);
};

/**
 * Get all template categories
 * @returns {Array} - Unique categories
 */
export const getTemplateCategories = () => {
  const categories = [...new Set(Object.values(emailTemplates).map(template => template.category))];
  return categories.sort();
};

/**
 * Validate template variables
 * @param {string} templateId - Template ID
 * @param {Object} variables - Variables to validate
 * @returns {Object} - Validation result
 */
export const validateTemplateVariables = (templateId, variables) => {
  const template = emailTemplates[templateId];
  if (!template) {
    return { isValid: false, errors: ['Template not found'] };
  }

  const errors = [];
  const missingVariables = [];

  template.variables.forEach(variable => {
    if (!variables[variable] || variables[variable].trim() === '') {
      missingVariables.push(variable);
    }
  });

  if (missingVariables.length > 0) {
    errors.push(`Missing required variables: ${missingVariables.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingVariables
  };
};

/**
 * Get template preview with sample data
 * @param {string} templateId - Template ID
 * @returns {Object} - Preview with sample data
 */
export const getTemplatePreview = (templateId) => {
  const template = emailTemplates[templateId];
  if (!template) {
    return null;
  }

  const sampleVariables = {};
  template.variables.forEach(variable => {
    sampleVariables[variable] = `[${variable}]`;
  });

  return applyTemplate(templateId, sampleVariables);
};
