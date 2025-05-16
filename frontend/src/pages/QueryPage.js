import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// Visualization components
import QueryResultTable from '../components/visualizations/QueryResultTable';
import BarChartViz from '../components/visualizations/BarChartViz';
import LineChartViz from '../components/visualizations/LineChartViz';
import PieChartViz from '../components/visualizations/PieChartViz';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  // Fetch available databases
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await axios.get('/api/database/list');
        setDatabases(response.data.data);
        
        // Select the first database by default
        if (response.data.data.length > 0 && !selectedDatabase) {
          setSelectedDatabase(response.data.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching databases:', error);
        setError('Failed to load databases. Please try again later.');
      }
    };

    fetchDatabases();
  }, [selectedDatabase]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    
    if (!query || !selectedDatabase) {
      setError('Please enter a query and select a database.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/query', {
        query,
        databaseId: selectedDatabase
      });
      
      const result = response.data.data;
      setQueryResult(result);
      
      // Add to query history
      setQueryHistory(prevHistory => [
        { 
          id: Date.now(),
          query,
          result
        },
        ...prevHistory
      ]);
    } catch (error) {
      console.error('Error executing query:', error);
      setError(error.response?.data?.message || 'Failed to execute query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatabaseChange = (e) => {
    setSelectedDatabase(e.target.value);
  };

  const renderVisualization = (visualization) => {
    switch (visualization.type) {
      case 'table':
        return (
          <QueryResultTable 
            key={`table-${visualization.title}`}
            columns={visualization.columns} 
            data={visualization.data} 
            title={visualization.title}
          />
        );
      case 'bar':
        return (
          <BarChartViz 
            key={`bar-${visualization.title}`}
            data={visualization.data} 
            xAxis={visualization.xAxis}
            yAxis={visualization.yAxis}
            title={visualization.title}
          />
        );
      case 'line':
        return (
          <LineChartViz 
            key={`line-${visualization.title}`}
            data={visualization.data} 
            xAxis={visualization.xAxis}
            yAxis={visualization.yAxis}
            title={visualization.title}
          />
        );
      case 'pie':
        return (
          <PieChartViz 
            key={`pie-${visualization.title}`}
            data={visualization.data} 
            labelKey={visualization.labelKey}
            valueKey={visualization.valueKey}
            title={visualization.title}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Query Your Database
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleQuerySubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="database-select-label">Database</InputLabel>
            <Select
              labelId="database-select-label"
              id="database-select"
              value={selectedDatabase}
              label="Database"
              onChange={handleDatabaseChange}
            >
              {databases.map((db) => (
                <MenuItem key={db.id} value={db.id}>
                  {db.name} ({db.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Ask a question about your data"
            placeholder="e.g., What are the top 5 most ordered products?"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={isLoading || !query || !selectedDatabase}
          >
            {isLoading ? 'Processing...' : 'Ask Question'}
          </Button>
        </form>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {queryResult && (
        <Box className="query-result-container">
          <Card>
            <CardHeader 
              title="Answer" 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                py: 1
              }}
            />
            <CardContent>
              <ReactMarkdown>{queryResult.explanation}</ReactMarkdown>
            </CardContent>
          </Card>
          
          <Box className="visualization-container">
            {queryResult.visualizations && queryResult.visualizations.map((viz) => renderVisualization(viz))}
          </Box>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>SQL Query</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper elevation={0} className="sql-code">
                <pre>{queryResult.sqlQuery}</pre>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      
      {queryHistory.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Recent Queries
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {queryHistory.map((historyItem) => (
            <Accordion key={historyItem.id} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${historyItem.id}-content`}
                id={`panel-${historyItem.id}-header`}
              >
                <Typography>{historyItem.query}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ReactMarkdown>{historyItem.result.explanation}</ReactMarkdown>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default QueryPage; 