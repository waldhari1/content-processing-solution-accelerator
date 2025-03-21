// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import useAuth from '../msal-auth/useAuth';  // Importing your custom useAuth hook

const api = process.env.REACT_APP_API_BASE_URL; // base API URL

interface RequestOptions {
  method: string;
  headers: { [key: string]: string };
  body?: string | FormData | null;
}

interface ApiResponse {
  [key: string]: any;
}

// Custom hook to fetch API with authentication
const useApi = () => {
  const { getToken } = useAuth();  // Call useAuth hook to get the token
  const [token, setToken] = useState<string | null>(null);

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();  // Fetch the token asynchronously
      //setToken(fetchedToken || null);  // Save the token to state
    };

    fetchToken();
  }, [getToken]);

  // Function to make API requests with JWT token
  const fetchWithAuth = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body: any = null
  ): Promise<ApiResponse | null> => {
    if (!token) {
      throw new Error("Token is not available");
    }

    const headers: { [key: string]: string } = {
      'Authorization': `Bearer ${token}`,  // Add token to Authorization header
      'Accept': 'application/json',  // Add Accept header
      'Content-Type': 'application/json',  // Default to application/json
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*'
    };

    if (body instanceof FormData) {
      delete headers['Content-Type'];  // Don't set Content-Type if the body is FormData
    }

    const options: RequestOptions = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);  // Add body for POST/PUT
    }

    try {
      const response = await fetch(`${api}${url}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
      }

      const isJson = response.headers.get('content-type')?.includes('application/json');
      return isJson ? await response.json() : null;
    } catch (error) {
      console.error('API Error:', (error as Error).message);
      throw error;
    }
  };

  // Function to make API requests without authentication (for login)
  const fetchWithoutAuth = async (
    url: string,
    method: 'POST' = 'POST',
    body: any = null
  ): Promise<ApiResponse | null> => {
    const headers: { [key: string]: string } = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const options: RequestOptions = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);  // Add the body for POST
    }

    try {
      const response = await fetch(`${api}${url}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const isJson = response.headers.get('content-type')?.includes('application/json');
      return isJson ? await response.json() : null;
    } catch (error) {
      console.error('Login Error:', (error as Error).message);
      throw error;
    }
  };

  return {
    get: (url: string): Promise<ApiResponse | null> => fetchWithAuth(url, 'GET'),
    post: (url: string, body: any): Promise<ApiResponse | null> => fetchWithAuth(url, 'POST', body),
    put: (url: string, body: any): Promise<ApiResponse | null> => fetchWithAuth(url, 'PUT', body),
    delete: (url: string): Promise<ApiResponse | null> => fetchWithAuth(url, 'DELETE'),
    upload: (url: string, formData: FormData): Promise<ApiResponse | null> => fetchWithAuth(url, 'POST', formData),
    login: (url: string, body: any): Promise<ApiResponse | null> => fetchWithoutAuth(url, 'POST', body),  // For login without auth
  };
};

export default useApi;
