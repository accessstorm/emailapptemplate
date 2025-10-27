/**
 * Offline storage utilities for email system
 */

const STORAGE_KEYS = {
  DRAFTS: 'offlineDrafts',
  CLIENTS: 'offlineClients',
  SENT_EMAILS: 'offlineSentEmails',
  SETTINGS: 'emailSettings'
};

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @returns {boolean} - Success status
 */
export const saveToOfflineStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save to offline storage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Loaded data or default value
 */
export const loadFromOfflineStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Failed to load from offline storage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Save draft offline
 * @param {Object} draft - Draft object
 * @returns {boolean} - Success status
 */
export const saveDraftOffline = (draft) => {
  const offlineDrafts = loadFromOfflineStorage(STORAGE_KEYS.DRAFTS, []);
  const updatedDrafts = [...offlineDrafts.filter(d => d.id !== draft.id), {
    ...draft,
    offline: true,
    timestamp: Date.now()
  }];
  return saveToOfflineStorage(STORAGE_KEYS.DRAFTS, updatedDrafts);
};

/**
 * Load offline drafts
 * @returns {Array} - Array of offline drafts
 */
export const loadOfflineDrafts = () => {
  return loadFromOfflineStorage(STORAGE_KEYS.DRAFTS, []);
};

/**
 * Save client offline
 * @param {Object} client - Client object
 * @returns {boolean} - Success status
 */
export const saveClientOffline = (client) => {
  const offlineClients = loadFromOfflineStorage(STORAGE_KEYS.CLIENTS, []);
  const updatedClients = [...offlineClients.filter(c => c.id !== client.id), {
    ...client,
    offline: true,
    timestamp: Date.now()
  }];
  return saveToOfflineStorage(STORAGE_KEYS.CLIENTS, updatedClients);
};

/**
 * Load offline clients
 * @returns {Array} - Array of offline clients
 */
export const loadOfflineClients = () => {
  return loadFromOfflineStorage(STORAGE_KEYS.CLIENTS, []);
};

/**
 * Save sent email offline
 * @param {Object} email - Email object
 * @returns {boolean} - Success status
 */
export const saveSentEmailOffline = (email) => {
  const offlineSentEmails = loadFromOfflineStorage(STORAGE_KEYS.SENT_EMAILS, []);
  const updatedEmails = [...offlineSentEmails, {
    ...email,
    offline: true,
    timestamp: Date.now()
  }];
  return saveToOfflineStorage(STORAGE_KEYS.SENT_EMAILS, updatedEmails);
};

/**
 * Load offline sent emails
 * @returns {Array} - Array of offline sent emails
 */
export const loadOfflineSentEmails = () => {
  return loadFromOfflineStorage(STORAGE_KEYS.SENT_EMAILS, []);
};

/**
 * Clear offline data
 * @param {string} key - Storage key to clear
 * @returns {boolean} - Success status
 */
export const clearOfflineData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to clear offline storage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all offline data
 * @returns {boolean} - Success status
 */
export const clearAllOfflineData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear all offline storage:', error);
    return false;
  }
};

/**
 * Get offline data size
 * @returns {Object} - Size information for each storage key
 */
export const getOfflineDataSize = () => {
  const sizes = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const data = localStorage.getItem(key);
    sizes[name] = data ? new Blob([data]).size : 0;
  });
  return sizes;
};

/**
 * Check if browser supports localStorage
 * @returns {boolean} - Support status
 */
export const isOfflineStorageSupported = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sync offline data with server
 * @param {Function} syncFunction - Function to sync data
 * @returns {Promise<boolean>} - Success status
 */
export const syncOfflineData = async (syncFunction) => {
  if (!navigator.onLine) {
    console.log('Offline - skipping sync');
    return false;
  }

  try {
    await syncFunction();
    return true;
  } catch (error) {
    console.error('Failed to sync offline data:', error);
    return false;
  }
};
