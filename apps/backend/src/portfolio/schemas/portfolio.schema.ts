import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, uppercase: true, trim: true, maxlength: 10 })
  symbol!: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  companyName!: string;

  @Prop({ required: true, min: 0 })
  shares!: number;

  @Prop({ required: true, min: 0 })
  purchasePrice!: number;

  @Prop()
  purchaseDate?: Date;

  @Prop({ maxlength: 2000 })
  notes?: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

// Create index for faster queries
PortfolioSchema.index({ symbol: 1 });
