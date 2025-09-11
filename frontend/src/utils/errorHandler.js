import { toast } from '../hooks/use-toast';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  SERVER: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error messages
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.AUTHENTICATION]: 'Authentication failed. Please login again.',
  [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

// Determine error type from axios error
export const getErrorType = (error) => {
  if (!error.response) {
    // Network error or request timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return ERROR_TYPES.TIMEOUT;
    }
    return ERROR_TYPES.NETWORK;
  }

  const status = error.response.status;
  
  switch (status) {
    case 400:
      return ERROR_TYPES.VALIDATION;
    case 401:
      return ERROR_TYPES.AUTHENTICATION;
    case 403:
      return ERROR_TYPES.AUTHORIZATION;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
};

// Get user-friendly error message
export const getErrorMessage = (error, customMessage = null) => {
  if (customMessage) return customMessage;
  
  // Check if error has a custom message from backend
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType];
};

// Main error handler function
export const handleError = (error, options = {}) => {
  const {
    title = 'Error',
    customMessage = null,
    showToast = true,
    onRetry = null,
    context = 'general'
  } = options;

  const errorType = getErrorType(error);
  const message = getErrorMessage(error, customMessage);

  // Log error for debugging
  console.error(`[${context.toUpperCase()}] ${errorType}:`, {
    message,
    error: error.response?.data || error.message,
    status: error.response?.status,
    url: error.config?.url
  });

  // Show toast notification
  if (showToast) {
    const toastConfig = {
      title,
      description: message,
      variant: 'destructive'
    };

    // Add retry action if provided
    if (onRetry && (errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.TIMEOUT)) {
      toastConfig.action = {
        altText: 'Retry',
        onClick: onRetry
      };
    }

    toast(toastConfig);
  }

  return {
    type: errorType,
    message,
    status: error.response?.status,
    shouldRetry: errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.TIMEOUT
  };
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const errorType = getErrorType(error);
      if (errorType !== ERROR_TYPES.NETWORK && errorType !== ERROR_TYPES.TIMEOUT) {
        throw error; // Don't retry non-network errors
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Validation error handler
export const handleValidationErrors = (errors, setFieldErrors) => {
  if (Array.isArray(errors)) {
    const fieldErrors = {};
    errors.forEach(error => {
      if (error.field) {
        fieldErrors[error.field] = error.message;
      }
    });
    setFieldErrors(fieldErrors);
  } else if (typeof errors === 'object') {
    setFieldErrors(errors);
  }
};

// Success handler
export const handleSuccess = (message, options = {}) => {
  const {
    title = 'Success',
    showToast = true,
    duration = 3000
  } = options;

  if (showToast) {
    toast({
      title,
      description: message,
      variant: 'default',
      duration
    });
  }
};

// Loading state manager
export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = new Set();
  }

  setLoading(key, isLoading) {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners();
  }

  isLoading(key) {
    return this.loadingStates.get(key) || false;
  }

  isAnyLoading() {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.loadingStates));
  }

  clear() {
    this.loadingStates.clear();
    this.notifyListeners();
  }
}

// Global loading manager instance
export const globalLoadingManager = new LoadingManager();

// Hook for using loading manager
export const useLoadingManager = () => {
  const [loadingStates, setLoadingStates] = React.useState(new Map());

  React.useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setLoadingStates);
    return unsubscribe;
  }, []);

  return {
    setLoading: globalLoadingManager.setLoading.bind(globalLoadingManager),
    isLoading: globalLoadingManager.isLoading.bind(globalLoadingManager),
    isAnyLoading: globalLoadingManager.isAnyLoading.bind(globalLoadingManager),
    loadingStates
  };
};

// API wrapper with error handling
export const apiCall = async (apiFunction, options = {}) => {
  const {
    loadingKey = null,
    retries = 0,
    onSuccess = null,
    onError = null,
    context = 'api'
  } = options;

  try {
    if (loadingKey) {
      globalLoadingManager.setLoading(loadingKey, true);
    }

    let result;
    if (retries > 0) {
      result = await retryWithBackoff(apiFunction, retries);
    } else {
      result = await apiFunction();
    }

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    const errorInfo = handleError(error, {
      showToast: !onError, // Don't show toast if custom error handler provided
      context
    });

    if (onError) {
      onError(error, errorInfo);
    }

    throw error;
  } finally {
    if (loadingKey) {
      globalLoadingManager.setLoading(loadingKey, false);
    }
  }
};

export default {
  handleError,
  handleSuccess,
  handleValidationErrors,
  retryWithBackoff,
  apiCall,
  LoadingManager,
  globalLoadingManager,
  ERROR_TYPES,
  getErrorType,
  getErrorMessage
};