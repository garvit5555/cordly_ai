# Cordly AI - Frontend

The React.js frontend for Cordly AI, a conversational interface for SQL databases.

## Features

- Modern, responsive UI built with Material UI
- Interactive visualizations with Recharts
- Natural language query interface
- Support for tables, bar charts, line charts, and pie charts
- Responsive design that works on desktop and mobile

## Tech Stack

- React.js (Create React App)
- Material UI for components
- Recharts for visualizations
- React Router for navigation
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `src/components/` - Reusable UI components
- `src/components/visualizations/` - Chart and table components
- `src/pages/` - Page components for routes
- `src/services/` - API services and data processing
- `src/hooks/` - Custom React hooks

## Key Components

### Pages

- **HomePage** - Landing page with features overview
- **QueryPage** - Main interface for asking questions
- **DatabasesPage** - Page for managing database connections

### Visualization Components

- **QueryResultTable** - Displays data in tabular format
- **BarChartViz** - Bar chart visualization
- **LineChartViz** - Line chart for time series data
- **PieChartViz** - Pie chart for distribution data

## Environment Variables

The frontend uses the following environment variables that can be set in `.env` file:

- `REACT_APP_API_URL` - Backend API URL (default: proxied to localhost:5000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 