# Cordly AI

A natural language SQL query interface that allows users to interact with a SQLite database using plain English queries.

## Features

- Natural language to SQL query conversion using GROQ AI
- SQLite database integration
- RESTful API endpoints
- Sample data for electronics products and customer records
- Error handling and query validation

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
cd cordly_ai/backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
PORT=3000
GROQ_API_KEY=your_groq_api_key
```

## Usage

1. Start the server:
```bash
npm start
```

2. The API will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/query` - Submit a natural language query
- `GET /api/database/tables` - Get list of database tables
- `GET /api/database/schema` - Get database schema

## Project Structure

```
backend/
├── src/
│   ├── index.js           # Application entry point
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── middlewares/       # Express middlewares
├── .env                   # Environment variables
└── package.json          # Project dependencies
```

## License

MIT 