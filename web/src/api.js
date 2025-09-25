import axios from 'axios';

const apiClient = axios.create({
  // This is the base URL of your backend server
  baseURL: 'http://localhost:3001/api',
});

export default apiClient;