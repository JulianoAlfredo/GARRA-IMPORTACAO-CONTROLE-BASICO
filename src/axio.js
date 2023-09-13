import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Substitua 'localhost' pelo endereço do seu servidor se necessário
});

export default api;