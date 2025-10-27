/**
 * Email validation utility
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate multiple email addresses (comma-separated)
 * @param {string} emails - Comma-separated email addresses
 * @returns {Object} - Validation result with isValid and invalidEmails
 */
export const validateMultipleEmails = (emails) => {
  if (!emails || typeof emails !== 'string') {
    return { isValid: true, invalidEmails: [] };
  }

  const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
  const invalidEmails = emailList.filter(email => !validateEmail(email));

  return {
    isValid: invalidEmails.length === 0,
    invalidEmails,
    validEmails: emailList.filter(email => validateEmail(email))
  };
};

/**
 * File size validation
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in MB
 * @returns {boolean} - Whether the file size is valid
 */
export const validateFileSize = (file, maxSizeInMB = 10) => {
  if (!file || !file.size) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * File type validation
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - Whether the file type is valid
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file || !file.type) return true; // Allow if no type specified
  if (allowedTypes.length === 0) return true; // Allow all if no restrictions
  return allowedTypes.includes(file.type);
};

/**
 * Validate email form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors object
 */
export const validateEmailForm = (formData) => {
  const errors = {};

  // Validate 'to' field
  if (!formData.to || !formData.to.trim()) {
    errors.to = 'Recipient email is required';
  } else {
    const toValidation = validateMultipleEmails(formData.to);
    if (!toValidation.isValid) {
      errors.to = `Invalid email addresses: ${toValidation.invalidEmails.join(', ')}`;
    }
  }

  // Validate 'cc' field (optional)
  if (formData.cc && formData.cc.trim()) {
    const ccValidation = validateMultipleEmails(formData.cc);
    if (!ccValidation.isValid) {
      errors.cc = `Invalid CC email addresses: ${ccValidation.invalidEmails.join(', ')}`;
    }
  }

  // Validate 'bcc' field (optional)
  if (formData.bcc && formData.bcc.trim()) {
    const bccValidation = validateMultipleEmails(formData.bcc);
    if (!bccValidation.isValid) {
      errors.bcc = `Invalid BCC email addresses: ${bccValidation.invalidEmails.join(', ')}`;
    }
  }

  // Validate subject
  if (!formData.subject || !formData.subject.trim()) {
    errors.subject = 'Subject is required';
  } else if (formData.subject.length > 200) {
    errors.subject = 'Subject must be less than 200 characters';
  }

  // Validate message
  if (!formData.message || !formData.message.trim()) {
    errors.message = 'Message content is required';
  }

  // Validate attachments
  if (formData.attachments && formData.attachments.length > 0) {
    const invalidFiles = formData.attachments.filter(file => 
      !validateFileSize(file, 10) || !validateFileType(file)
    );

    if (invalidFiles.length > 0) {
      errors.attachments = 'Some files are too large (>10MB) or have invalid types';
    }

    if (formData.attachments.length > 10) {
      errors.attachments = 'Maximum 10 attachments allowed';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Basic HTML sanitization - remove potentially dangerous tags
  const dangerousTags = ['script', 'object', 'embed', 'iframe', 'form', 'input'];
  let sanitized = html;
  
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized;
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
