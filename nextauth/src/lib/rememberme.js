import CryptoJS from 'crypto-js';

// Use a secure, environment-specific secret key
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || 'the-secret-to-remember-me';

/**
 * Encrypt data for local storage
 * @param data - The data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt data from local storage
 * @param encryptedData - The encrypted data string
 * @returns Decrypted data or null
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Save encrypted credentials to local storage
 * @param email - User's email
 * @param password - User's password
 */
export const saveRememberedCredentials = (email, password) => {
  try {
    const encryptedCredentials = encryptData({ email, password });
    localStorage.setItem('rememberedCredentials', encryptedCredentials);
  } catch (error) {
    console.error('Error saving remembered credentials:', error);
  }
};

/**
 * Remove remembered credentials from local storage
 */
export const clearRememberedCredentials = () => {
  try {
    localStorage.removeItem('rememberedCredentials');
  } catch (error) {
    console.error('Error clearing remembered credentials:', error);
  }
};

/**
 * Retrieve decrypted credentials from local storage
 * @returns Decrypted credentials or null
 */
export const getRememberedCredentials = () => {
  try {
    const encryptedCredentials = localStorage.getItem('rememberedCredentials');
    if (encryptedCredentials) {
      return decryptData(encryptedCredentials);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving remembered credentials:', error);
    return null;
  }
};