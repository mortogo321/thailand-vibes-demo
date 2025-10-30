# Stock Management Application

A full-stack web application for managing stock portfolios with real-time stock quotes.

## Tech Stack

- **Backend**: NestJS + MongoDB
- **Frontend**: React + MobX + Ant Design
- **API**: Financial Modeling Prep

## Project Structure

```
stock-management/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # React web application
└── packages/             # Shared packages (if needed)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher) - `npm install -g pnpm`
- MongoDB (running locally or connection string)
- Financial Modeling Prep API key

### Installation

```bash
# Install dependencies (pnpm will handle workspaces automatically)
pnpm install
```

### Configuration

1. Create `.env` file in `apps/backend/`:
```
MONGODB_URI=mongodb://localhost:27017/stock-management
FMP_API_KEY=your_api_key_here
PORT=3001
```

### Running the Application

```bash
# Run both backend and frontend
pnpm dev

# Or run separately
pnpm backend:dev
pnpm frontend:dev
```

### Code Quality

```bash
# Run Biome linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## Features

- ✅ Portfolio management (add, edit, delete stocks)
- ✅ Real-time stock quotes
- ✅ Navigate between portfolio and stock detail pages
- ✅ Responsive UI with Ant Design
- ✅ State management with MobX

## API Endpoints

- `GET /api/portfolio` - Get user's portfolio
- `POST /api/portfolio` - Add stock to portfolio
- `PUT /api/portfolio/:id` - Update stock in portfolio
- `DELETE /api/portfolio/:id` - Remove stock from portfolio
- `GET /api/stocks/:symbol/quote` - Get real-time stock quote
