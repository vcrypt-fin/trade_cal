export const setCookie = (name: string, value: string, days = 7) => {
  const domain = window.location.hostname === 'localhost' 
    ? 'localhost'
    : '.trademind.pro';
    
  const secure = window.location.protocol === 'https:';
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

  // Split cookie if value is too large (>4096 bytes)
  const maxChunkSize = 4000; // Leave some room for the cookie name and other attributes
  const valueChunks = value.match(new RegExp(`.{1,${maxChunkSize}}`, 'g')) || [];
  
  valueChunks.forEach((chunk, index) => {
    const chunkName = index === 0 ? name : `${name}_${index}`;
    document.cookie = `${chunkName}=${chunk}; expires=${date.toUTCString()}; path=/; domain=${domain}${secure ? '; secure' : ''}; samesite=lax`;
  });

  // Store the number of chunks
  if (valueChunks.length > 1) {
    document.cookie = `${name}_chunks=${valueChunks.length}; expires=${date.toUTCString()}; path=/; domain=${domain}${secure ? '; secure' : ''}; samesite=lax`;
  }
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  const nameEQ = name + "=";
  
  // First check if we have chunks
  const chunksMatch = cookies.find(c => c.trim().startsWith(`${name}_chunks=`));
  if (chunksMatch) {
    const chunks = parseInt(chunksMatch.split('=')[1]);
    let value = '';
    
    // Get the main cookie
    const mainCookie = cookies.find(c => c.trim().startsWith(nameEQ));
    if (mainCookie) {
      value += mainCookie.substring(mainCookie.indexOf('=') + 1);
    }
    
    // Get all chunks
    for (let i = 1; i < chunks; i++) {
      const chunk = cookies.find(c => c.trim().startsWith(`${name}_${i}=`));
      if (chunk) {
        value += chunk.substring(chunk.indexOf('=') + 1);
      }
    }
    
    return value;
  }
  
  // No chunks, just get the single cookie
  const cookie = cookies.find(c => c.trim().startsWith(nameEQ));
  return cookie ? cookie.substring(cookie.indexOf('=') + 1) : null;
};

export const deleteCookie = (name: string) => {
  const domain = window.location.hostname === 'localhost' 
    ? 'localhost'
    : '.trademind.pro';
    
  // Delete main cookie
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  
  // Check for chunks
  const cookies = document.cookie.split(';');
  const chunksMatch = cookies.find(c => c.trim().startsWith(`${name}_chunks=`));
  if (chunksMatch) {
    const chunks = parseInt(chunksMatch.split('=')[1]);
    
    // Delete all chunks
    for (let i = 1; i < chunks; i++) {
      document.cookie = `${name}_${i}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    }
    
    // Delete chunks counter
    document.cookie = `${name}_chunks=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  }
}; 