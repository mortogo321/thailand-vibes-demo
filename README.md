# Stock Management Application

A full-stack web application for managing stock portfolios with real-time stock quotes.

## Tech Stack

- **Backend**: NestJS + MongoDB
- **Frontend**: React + MobX + Ant Design
- **API**: Financial Modeling Prep
- **Monorepo**: pnpm workspaces
- **Code Quality**: Biome

## Project Structure

```
stock-management/
├── apps/
│   ├── backend/               # NestJS API server
│   │   ├── src/
│   │   │   ├── portfolio/     # Portfolio CRUD module
│   │   │   ├── stocks/        # Stock API integration
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   └── .env               # Backend configuration (create this)
│   │
│   └── frontend/              # React web application
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── pages/         # Page components
│       │   ├── stores/        # MobX state stores
│       │   ├── services/      # API service layer
│       │   ├── types/         # TypeScript type definitions
│       │   └── App.tsx
│       ├── package.json
│       └── vite.config.ts
│
├── .vscode/                   # VS Code workspace settings
├── package.json               # Root workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace config
├── biome.json                 # Code quality configuration
└── setup.sh                   # Automated setup script
```

## Getting Started

### Quick Setup (Recommended)

Run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Check for pnpm installation
- Check MongoDB status
- Install all dependencies
- Create `.env` file from template

### Manual Setup

#### 1. Prerequisites

Install the following:
- **Node.js** v18+ - [Download](https://nodejs.org/)
- **pnpm** v8+ - Install with: `npm install -g pnpm`
- **MongoDB** - [Installation Guide](https://www.mongodb.com/docs/manual/installation/)

#### 2. Get API Key

1. Visit [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)
2. Sign up for a free account
3. Copy your API key from the dashboard

#### 3. Install Dependencies

```bash
pnpm install
```

#### 4. Configure Backend

Create `.env` file in `apps/backend/`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/stock-management
FMP_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
```

#### 5. Start MongoDB

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

**Or run manually:**
```bash
mongod --dbpath /path/to/data/directory
```

### Running the Application

```bash
# Run both backend and frontend (recommended)
pnpm dev

# Or run separately:
# Terminal 1 - Backend
pnpm backend:dev

# Terminal 2 - Frontend
pnpm frontend:dev
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

### Code Quality

```bash
# Check code quality with Biome
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format all code
pnpm format
```

### Building for Production

```bash
# Build both applications
pnpm build

# Or build individually
pnpm build:backend
pnpm build:frontend
```

## Features

### Portfolio Management
- ✅ Add stocks to portfolio with purchase details
- ✅ Edit existing portfolio entries
- ✅ Delete stocks from portfolio
- ✅ View total portfolio value and stock count
- ✅ Track purchase price, shares, and purchase date
- ✅ Add notes to portfolio entries

### Stock Information
- ✅ Real-time stock quotes from Financial Modeling Prep
- ✅ Current price, change, and percentage change
- ✅ Day high/low, 52-week high/low
- ✅ Market cap, P/E ratio, EPS
- ✅ Trading volume and averages
- ✅ 50-day and 200-day moving averages

### User Experience
- ✅ Seamless navigation between portfolio and stock pages
- ✅ Responsive design with Ant Design
- ✅ Loading states and error handling
- ✅ Real-time data refresh capability
- ✅ Form validation for data entry
- ✅ Clean, professional UI

### Technical Features
- ✅ MobX state management for reactive updates
- ✅ MongoDB for persistent storage
- ✅ RESTful API architecture
- ✅ TypeScript throughout for type safety
- ✅ Code quality enforcement with Biome
- ✅ Modular, maintainable codebase

## API Endpoints

### Portfolio Management
- `GET /api/portfolio` - Get all portfolio entries
- `GET /api/portfolio/:id` - Get specific portfolio entry
- `POST /api/portfolio` - Add stock to portfolio
- `PUT /api/portfolio/:id` - Update portfolio entry
- `DELETE /api/portfolio/:id` - Remove stock from portfolio

### Stock Data
- `GET /api/stocks/:symbol/quote` - Get real-time stock quote
- `GET /api/stocks/search?q=query` - Search for stocks

## Development

### VS Code Setup

The project includes VS Code configuration for optimal developer experience:

**Recommended Extensions:**
- Biome - Code formatting and linting
- MongoDB for VS Code - Database management

**Auto-formatting:**
- Code automatically formats on save using Biome
- Import statements are automatically organized

### Project Scripts

```bash
# Root level commands
pnpm dev              # Start both backend and frontend
pnpm build            # Build both applications
pnpm lint             # Check code quality
pnpm lint:fix         # Fix code quality issues
pnpm format           # Format all code

# Backend specific
pnpm backend:dev      # Start backend in watch mode
pnpm build:backend    # Build backend

# Frontend specific
pnpm frontend:dev     # Start frontend dev server
pnpm build:frontend   # Build frontend for production
```

### Architecture

**Backend (NestJS):**
- **Module-based architecture** for better organization
- **DTOs** for request/response validation
- **Mongoose schemas** for MongoDB models
- **Service layer** for business logic
- **Controller layer** for HTTP endpoints
- **Dependency injection** throughout

**Frontend (React + MobX):**
- **Component-based architecture** for reusability
- **MobX stores** for state management
- **Service layer** for API communication
- **Type definitions** for type safety
- **Ant Design** for consistent UI
- **React Router** for navigation

## Troubleshooting

### MongoDB Connection Error

**Error:** "MongoDB connection error"

**Solutions:**
1. Ensure MongoDB is running: `pgrep mongod`
2. Check your connection string in `.env`
3. Try using `127.0.0.1` instead of `localhost`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/stock-management
   ```

### Port Already in Use

**Error:** "Port 3001 (or 5173) already in use"

**Solutions:**
1. Find and kill the process:
   ```bash
   # For backend (port 3001)
   lsof -ti:3001 | xargs kill -9

   # For frontend (port 5173)
   lsof -ti:5173 | xargs kill -9
   ```
2. Or change the port in configuration files

### API Key Issues

**Error:** "Invalid API key" or "API rate limit exceeded"

**Solutions:**
1. Verify your API key at [FMP Dashboard](https://site.financialmodelingprep.com/developer/docs)
2. Free tier has rate limits (250 requests/day)
3. Ensure no extra spaces in `.env` file
4. Check the API key format: should be a long alphanumeric string

### pnpm Command Not Found

**Error:** "pnpm: command not found"

**Solution:**
```bash
npm install -g pnpm
```

### Dependencies Not Installing

**Error:** Various npm/pnpm errors

**Solutions:**
1. Clear cache:
   ```bash
   pnpm store prune
   rm -rf node_modules
   rm pnpm-lock.yaml
   ```
2. Reinstall:
   ```bash
   pnpm install
   ```

## Best Practices Implemented

### Code Quality
- **TypeScript strict mode** for type safety
- **Biome** for consistent code formatting
- **DTOs** for input validation
- **Error handling** throughout application
- **Separation of concerns** in architecture

### Performance
- **Efficient state management** with MobX
- **Optimized re-renders** with React
- **Database indexing** for faster queries
- **Request caching** where appropriate
- **Lazy loading** for routes

### Security
- **Input validation** on all endpoints
- **CORS configuration** for API access
- **Environment variables** for sensitive data
- **No hardcoded secrets**

### Maintainability
- **Modular architecture** for easy updates
- **Clear naming conventions**
- **Comprehensive comments** where needed
- **Reusable components**
- **DRY principle** throughout

## Future Enhancements

Potential features to add:
- [ ] User authentication and authorization
- [ ] Historical stock price charts
- [ ] Portfolio performance analytics
- [ ] Stock alerts and notifications
- [ ] Multiple portfolio support
- [ ] Import/export portfolio data
- [ ] Automated testing (unit, integration, e2e)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production deployment guide

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in the terminal
3. Verify all prerequisites are installed correctly
4. Check MongoDB and API key configuration
