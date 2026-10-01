import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { stocksApi } from '../services/api';
import type { StockQuote } from '../types';

class StockStore {
  quotes: Map<string, StockQuote> = new Map();
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchQuote(symbol: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await stocksApi.getQuote(symbol);
      runInAction(() => {
        this.quotes.set(symbol.toUpperCase(), response.data);
        this.loading = false;
      });
      return response.data;
    } catch (error: unknown) {
      runInAction(() => {
        if (axios.isAxiosError(error)) {
          const data = error.response?.data as { message?: unknown } | undefined;
          this.error =
            typeof data?.message === 'string' && data.message.length > 0
              ? data.message
              : 'Failed to fetch stock quote';
        } else {
          this.error = 'Failed to fetch stock quote';
        }
        this.loading = false;
      });
      throw error;
    }
  }

  getQuote(symbol: string): StockQuote | undefined {
    return this.quotes.get(symbol.toUpperCase());
  }

  clearError() {
    this.error = null;
  }
}

export const stockStore = new StockStore();
