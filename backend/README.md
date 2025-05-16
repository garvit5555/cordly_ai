# Cordly AI - Backend

The Node.js backend for Cordly AI, a conversational interface for SQL databases.

## Features

- Natural language to SQL query conversion using Google Gemini AI
- Multi-database support (SQLite, PostgreSQL, MySQL, etc.)
- Schema extraction and analysis
- Query execution and result formatting
- Automatic visualization suggestions

## Tech Stack

- Node.js with Express
- Google Gemini AI API for natural language processing
- PostgreSQL and SQLite database connectors
- Joi for request validation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Gemini API key
- SQL database (optional, sample SQLite DB is created automatically)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables by creating a `.env` file:
   ```
   PORT=5000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `src/index.js` - Main entry point and Express server
- `src/routes/` - API route definitions
- `src/services/` - Business logic and database operations
- `src/middlewares/` - Express middlewares
- `data/` - Sample database and storage

## API Endpoints

### Query Endpoints

- `POST /api/query` - Process a natural language query
  - Request body: `{ query: "string", databaseId: "string" }`
  - Response: Query results, SQL, explanation, and visualization suggestions

- `GET /api/query/history` - Get history of previous queries

### Database Endpoints

- `GET /api/database/list` - Get list of available databases
- `GET /api/database/schema/:databaseId` - Get schema for a specific database
- `POST /api/database/test-connection` - Test a database connection
  - Request body: Database connection parameters

## Database Configuration

The application supports multiple database types:

### SQLite

```json
{
  "id": "sample",
  "name": "Sample Database",
  "type": "sqlite",
  "filename": "/path/to/database.db"
}
```

### PostgreSQL

```json
{
  "id": "postgres-db",
  "name": "PostgreSQL Database",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "database": "mydatabase",
  "user": "postgres",
  "password": "password"
}
```

## Environment Variables

- `PORT` - Port number for the server (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `GEMINI_API_KEY` - Your Google Gemini API key 