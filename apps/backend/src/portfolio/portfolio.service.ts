import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types } from 'mongoose';
import type { CreatePortfolioDto } from './dto/create-portfolio.dto';
import type { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio, type PortfolioDocument } from './schemas/portfolio.schema';

function assertObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid portfolio id: ${id}`);
  }
}

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const createdPortfolio = new this.portfolioModel({
      ...createPortfolioDto,
      symbol: createPortfolioDto.symbol.toUpperCase(),
    });
    return createdPortfolio.save();
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Portfolio> {
    assertObjectId(id);
    const portfolio = await this.portfolioModel.findById(id).exec();
    if (!portfolio) {
      throw new NotFoundException(`Portfolio item with ID ${id} not found`);
    }
    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto): Promise<Portfolio> {
    assertObjectId(id);
    const updatedData = { ...updatePortfolioDto };
    if (updatedData.symbol) {
      updatedData.symbol = updatedData.symbol.toUpperCase();
    }

    const portfolio = await this.portfolioModel
      .findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
      .exec();

    if (!portfolio) {
      throw new NotFoundException(`Portfolio item with ID ${id} not found`);
    }
    return portfolio;
  }

  async remove(id: string): Promise<void> {
    assertObjectId(id);
    const result = await this.portfolioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Portfolio item with ID ${id} not found`);
    }
  }
}
