export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('hms_token');
  const baseUrl = import.meta.env.VITE_BACKEND_URL || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const fullUrl = `${baseUrl}${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // If token is expired or invalid, clear it and redirect to login
  if (response.status === 401 || response.status === 403) {
    // Only auto-logout if we actually sent a token (avoids loops on login page)
    if (token && !path.startsWith('/auth')) {
      console.warn(`[apiFetch] Token rejected (${response.status}) for ${fullUrl}. Clearing session.`);
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
      return response;
    }
  }

  return response;
};

export const getErrorMessage = (errorText: string): string => {
  if (!errorText) return '';
  try {
    const json = JSON.parse(errorText);
    if (json && typeof json === 'object') {
      return json.message || json.error || errorText;
    }
  } catch (e) {
    // Return original text if not JSON
  }
  return errorText;
};

