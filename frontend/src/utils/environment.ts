export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return import.meta.env.PROD 
      ? 'https://tradecal.netlify.app'
      : window.location.origin;
  }
  // Fallback
  return 'http://localhost:5173';
}; 