import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'https://backend-minimarket-b8b9.onrender.com/api/';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default instance;
