import axios from 'axios';
import { API_CONFIG } from './apiConfig.js';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      withCredentials: true,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        throw error;
      }
    );
  }

  get(url, config) {
    return this.api.get(url, config);
  }

  post(url, data, config) {
    return this.api.post(url, data, config);
  }

  put(url, data, config) {
    return this.api.put(url, data, config);
  }

  delete(url, config) {
    return this.api.delete(url, config);
  }
}

export default new ApiService();
