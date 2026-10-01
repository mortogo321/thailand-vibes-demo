import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { PortfolioService } from './portfolio.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelMock = (overrides: Record<string, Mock> = {}): any => ({
  find: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
  ...overrides,
});

describe('PortfolioService', () => {
  const validId = '507f1f77bcf86cd799439011';

  it('creates with uppercased symbol', async () => {
    const save = vi.fn().mockResolvedValue({ symbol: 'AAPL' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/complexity/useArrowFunction: mock must stay constructable for `new`
    const ModelMock: any = vi.fn(function (dto: unknown) {
      return { save, dto };
    });
    const service = new PortfolioService(ModelMock);
    const result = await service.create({
      symbol: 'aapl',
      companyName: 'Apple',
      shares: 1,
      purchasePrice: 10,
    });
    expect(ModelMock).toHaveBeenCalledWith(expect.objectContaining({ symbol: 'AAPL' }));
    expect(save).toHaveBeenCalled();
    expect(result).toEqual({ symbol: 'AAPL' });
  });

  it('rejects invalid ObjectId', async () => {
    const service = new PortfolioService(modelMock());
    await expect(service.findOne('not-an-id')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.update('not-an-id', { shares: 2 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.remove('not-an-id')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws NotFound when document missing', async () => {
    const model = modelMock({
      findById: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
      findByIdAndDelete: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
    });
    const service = new PortfolioService(model);
    await expect(service.findOne(validId)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(validId)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findAll sorts by createdAt desc', async () => {
    const exec = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ exec });
    const model = modelMock({ find: vi.fn().mockReturnValue({ sort }) });
    const service = new PortfolioService(model);
    await service.findAll();
    expect(model.find).toHaveBeenCalled();
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});
