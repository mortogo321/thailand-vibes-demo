import axios from 'axios';
import type { Portfolio, CreatePortfolioDto, UpdatePortfolioDto, StockQuote } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioApi = {
  getAll: () => api.get<Portfolio[]>('/portfolio'),
  getOne: (id: string) => api.get<Portfolio>(`/portfolio/${id}`),
  create: (data: CreatePortfolioDto) => api.post<Portfolio>('/portfolio', data),
  update: (id: string, data: UpdatePortfolioDto) =>
    api.put<Portfolio>(`/portfolio/${id}`, data),
  delete: (id: string) => api.delete(`/portfolio/${id}`),
};

export const stocksApi = {
  getQuote: (symbol: string) => api.get<StockQuote>(`/stocks/${symbol}/quote`),
  search: (query: string) => api.get(`/stocks/search?q=${query}`),
};

export default api;
