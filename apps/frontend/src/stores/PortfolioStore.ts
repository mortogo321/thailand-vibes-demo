import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { portfolioApi } from '../services/api';
import type { CreatePortfolioDto, Portfolio, UpdatePortfolioDto } from '../types';

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    if (typeof data?.message === 'string' && data.message.length > 0) {
      return data.message;
    }
  }
  return fallback;
}

class PortfolioStore {
  portfolios: Portfolio[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPortfolios() {
    this.loading = true;
    this.error = null;
    try {
      const response = await portfolioApi.getAll();
      runInAction(() => {
        this.portfolios = response.data;
        this.loading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.error = apiErrorMessage(error, 'Failed to fetch portfolios');
        this.loading = false;
      });
    }
  }

  async addPortfolio(data: CreatePortfolioDto) {
    this.loading = true;
    this.error = null;
    try {
      const response = await portfolioApi.create(data);
      runInAction(() => {
        this.portfolios.unshift(response.data);
        this.loading = false;
      });
      return response.data;
    } catch (error: unknown) {
      runInAction(() => {
        this.error = apiErrorMessage(error, 'Failed to add portfolio');
        this.loading = false;
      });
      throw error;
    }
  }

  async updatePortfolio(id: string, data: UpdatePortfolioDto) {
    this.loading = true;
    this.error = null;
    try {
      const response = await portfolioApi.update(id, data);
      runInAction(() => {
        const index = this.portfolios.findIndex((p) => p._id === id);
        if (index !== -1) {
          const updated = response.data;
          if (updated !== undefined) {
            this.portfolios[index] = updated;
          }
        }
        this.loading = false;
      });
      return response.data;
    } catch (error: unknown) {
      runInAction(() => {
        this.error = apiErrorMessage(error, 'Failed to update portfolio');
        this.loading = false;
      });
      throw error;
    }
  }

  async deletePortfolio(id: string) {
    this.loading = true;
    this.error = null;
    try {
      await portfolioApi.delete(id);
      runInAction(() => {
        this.portfolios = this.portfolios.filter((p) => p._id !== id);
        this.loading = false;
      });
    } catch (error: unknown) {
      runInAction(() => {
        this.error = apiErrorMessage(error, 'Failed to delete portfolio');
        this.loading = false;
      });
      throw error;
    }
  }

  getPortfolioBySymbol(symbol: string): Portfolio | undefined {
    return this.portfolios.find((p) => p.symbol.toUpperCase() === symbol.toUpperCase());
  }
}

export const portfolioStore = new PortfolioStore();
