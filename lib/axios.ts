import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.143:5001/v1/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach tokens
api.interceptors.request.use(
  (config) => {
    // If the request is for the admin panel, we can attach the admin token
    // For simplicity, we check if there's an admin token and the route implies admin action.
    // A safer way is to let the frontend define which token to use, but since we store them distinctly:
    
    // We can look at the URL to decide which token to use, or just pass it in the thunk.
    // For this implementation, we will always attach `admin_token` if the request is an admin route,
    // otherwise we attach the normal `token`.
    
    // Check if window is defined (to avoid SSR errors)
    if (typeof window !== 'undefined') {
      const url = config.url || '';
      
      let token = null;
      // If the URL explicitly contains 'imadmin' or we are in an admin context
      if (window.location.pathname.startsWith('/imadmin')) {
        token = localStorage.getItem('admin_token');
      } else {
        token = localStorage.getItem('token');
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
