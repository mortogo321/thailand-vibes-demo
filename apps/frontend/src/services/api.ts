import axios from 'axios';
import type { CreatePortfolioDto, Portfolio, StockQuote, UpdatePortfolioDto } from '../types';

const baseURL = import.meta.env.VITE_API_URL?.trim() || '/api';

const api = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioApi = {
  getAll: () => api.get<Portfolio[]>('/portfolio'),
  getOne: (id: string) => api.get<Portfolio>(`/portfolio/${encodeURIComponent(id)}`),
  create: (data: CreatePortfolioDto) => api.post<Portfolio>('/portfolio', data),
  update: (id: string, data: UpdatePortfolioDto) =>
    api.put<Portfolio>(`/portfolio/${encodeURIComponent(id)}`, data),
  delete: (id: string) => api.delete(`/portfolio/${encodeURIComponent(id)}`),
};

export const stocksApi = {
  getQuote: (symbol: string) => api.get<StockQuote>(`/stocks/${encodeURIComponent(symbol)}/quote`),
  search: (query: string) => api.get('/stocks/search', { params: { q: query.slice(0, 50) } }),
};

export default api;
