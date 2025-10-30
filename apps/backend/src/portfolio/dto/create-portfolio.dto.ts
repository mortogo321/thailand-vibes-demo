import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  symbol: string;

  @IsString()
  companyName: string;

  @IsNumber()
  @Min(0)
  shares: number;

  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
