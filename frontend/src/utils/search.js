/**
 * Search utilities for email system
 */

/**
 * Search emails by query string
 * @param {Array} emails - Array of email objects
 * @param {string} query - Search query
 * @returns {Array} - Filtered emails
 */
export const searchEmails = (emails, query) => {
  if (!query || !query.trim()) return emails;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return emails.filter(email => {
    const searchableText = [
      email.subject || '',
      email.message || '',
      email.from || '',
      email.to || '',
      email.cc || '',
      email.bcc || ''
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => 
      searchableText.includes(term)
    );
  });
};

/**
 * Filter emails by various criteria
 * @param {Array} emails - Array of email objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered emails
 */
export const filterEmails = (emails, filters) => {
  if (!filters || Object.keys(filters).length === 0) return emails;
  
  return emails.filter(email => {
    // Date range filter
    if (filters.dateRange) {
      const emailDate = new Date(email.sentAt || email.date);
      const { start, end } = filters.dateRange;
      
      if (start && emailDate < new Date(start)) return false;
      if (end && emailDate > new Date(end)) return false;
    }
    
    // Has attachments filter
    if (filters.hasAttachments && (!email.attachments || email.attachments.length === 0)) {
      return false;
    }
    
    // Sender filter
    if (filters.sender && !email.from?.toLowerCase().includes(filters.sender.toLowerCase())) {
      return false;
    }
    
    // Recipient filter
    if (filters.recipient && !email.to?.toLowerCase().includes(filters.recipient.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && email.priority !== filters.priority) {
      return false;
    }
    
    // Read status filter
    if (filters.isRead !== undefined && email.isRead !== filters.isRead) {
      return false;
    }
    
    // Starred filter
    if (filters.isStarred !== undefined && email.isStarred !== filters.isStarred) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sort emails by various criteria
 * @param {Array} emails - Array of email objects
 * @param {string} sortBy - Sort criteria
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Array} - Sorted emails
 */
export const sortEmails = (emails, sortBy = 'date', sortOrder = 'desc') => {
  const sorted = [...emails].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.sentAt || a.date || 0);
        bValue = new Date(b.sentAt || b.date || 0);
        break;
      case 'subject':
        aValue = (a.subject || '').toLowerCase();
        bValue = (b.subject || '').toLowerCase();
        break;
      case 'sender':
        aValue = (a.from || '').toLowerCase();
        bValue = (b.from || '').toLowerCase();
        break;
      case 'recipient':
        aValue = (a.to || '').toLowerCase();
        bValue = (b.to || '').toLowerCase();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1, normal: 0 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Get unique values for filter options
 * @param {Array} emails - Array of email objects
 * @returns {Object} - Unique values for filtering
 */
export const getFilterOptions = (emails) => {
  const senders = [...new Set(emails.map(email => email.from).filter(Boolean))];
  const recipients = [...new Set(emails.map(email => email.to).filter(Boolean))];
  const priorities = [...new Set(emails.map(email => email.priority).filter(Boolean))];
  
  return {
    senders: senders.sort(),
    recipients: recipients.sort(),
    priorities: priorities.sort()
  };
};

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - HTML with highlighted terms
 */
export const highlightSearchTerms = (text, query) => {
  if (!query || !text) return text;
  
  const terms = query.trim().split(/\s+/);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};
