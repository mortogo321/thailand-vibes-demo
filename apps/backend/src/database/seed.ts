import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface SeedStock {
  symbol: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: Date;
  notes: string;
}

const samplePortfolio: SeedStock[] = [
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 50,
    purchasePrice: 150.25,
    purchaseDate: new Date('2024-01-15'),
    notes: 'Long-term hold - solid fundamentals',
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 30,
    purchasePrice: 380.50,
    purchaseDate: new Date('2024-02-20'),
    notes: 'Cloud computing leader',
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    shares: 25,
    purchasePrice: 140.75,
    purchaseDate: new Date('2024-03-10'),
    notes: 'AI and search dominance',
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    shares: 15,
    purchasePrice: 245.00,
    purchaseDate: new Date('2024-01-05'),
    notes: 'EV market leader',
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    shares: 20,
    purchasePrice: 495.30,
    purchaseDate: new Date('2024-02-01'),
    notes: 'AI chip manufacturer',
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    shares: 40,
    purchasePrice: 175.20,
    purchaseDate: new Date('2024-03-15'),
    notes: 'E-commerce and cloud giant',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-management';
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Import Portfolio model
    const { default: mongoose } = await import('mongoose');
    const PortfolioSchema = new mongoose.Schema({
      symbol: { type: String, required: true, uppercase: true },
      companyName: { type: String, required: true },
      shares: { type: Number, required: true, min: 0 },
      purchasePrice: { type: Number, required: true, min: 0 },
      purchaseDate: Date,
      notes: String,
    }, { timestamps: true });

    const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

    // Clear existing data
    const deleteResult = await Portfolio.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing records\n`);

    // Insert sample data
    const result = await Portfolio.insertMany(samplePortfolio);
    console.log(`✅ Successfully seeded ${result.length} portfolio entries:\n`);

    result.forEach((item: any) => {
      console.log(`   📊 ${item.symbol} - ${item.companyName}`);
      console.log(`      Shares: ${item.shares} @ $${item.purchasePrice.toFixed(2)}`);
      console.log(`      Total Value: $${(item.shares * item.purchasePrice).toFixed(2)}`);
      console.log('');
    });

    const totalValue = result.reduce((sum: number, item: any) =>
      sum + (item.shares * item.purchasePrice), 0
    );

    console.log(`💰 Total Portfolio Value: $${totalValue.toFixed(2)}\n`);
    console.log('✨ Seeding completed successfully!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seed();
