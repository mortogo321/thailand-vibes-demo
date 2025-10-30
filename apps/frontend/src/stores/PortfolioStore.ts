import { makeAutoObservable, runInAction } from 'mobx';
import { portfolioApi } from '../services/api';
import type { Portfolio, CreatePortfolioDto, UpdatePortfolioDto } from '../types';

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
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to fetch portfolios';
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
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to add portfolio';
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
        const index = this.portfolios.findIndex(p => p._id === id);
        if (index !== -1) {
          this.portfolios[index] = response.data;
        }
        this.loading = false;
      });
      return response.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to update portfolio';
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
        this.portfolios = this.portfolios.filter(p => p._id !== id);
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to delete portfolio';
        this.loading = false;
      });
      throw error;
    }
  }

  getPortfolioBySymbol(symbol: string): Portfolio | undefined {
    return this.portfolios.find(
      p => p.symbol.toUpperCase() === symbol.toUpperCase()
    );
  }
}

export const portfolioStore = new PortfolioStore();
