import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // URL relative, sera proxifiée par Vite
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour voir les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('Requête envoyée:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour voir les réponses
api.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;