import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';

const DatabasesPage = () => {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDBType, setSelectedDBType] = useState('sqlite');
  const [newDatabaseForm, setNewDatabaseForm] = useState({
    name: '',
    type: 'sqlite',
    host: '',
    port: '',
    database: '',
    user: '',
    password: '',
    filename: ''
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [selectedDBSchema, setSelectedDBSchema] = useState(null);
  const [openSchemaDialog, setOpenSchemaDialog] = useState(false);

  // Fetch databases on component mount
  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/database/list');
      setDatabases(response.data.data);
    } catch (error) {
      console.error('Error fetching databases:', error);
      setError('Failed to load databases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setTestResult(null);
    setNewDatabaseForm({
      name: '',
      type: 'sqlite',
      host: '',
      port: '',
      database: '',
      user: '',
      password: '',
      filename: ''
    });
    setSelectedDBType('sqlite');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTestResult(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDatabaseForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'type') {
      setSelectedDBType(value);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const response = await axios.post('/api/database/test-connection', newDatabaseForm);
      setTestResult({
        success: response.data.data.success,
        message: response.data.data.success ? 'Connection successful!' : response.data.data.error
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestResult({
        success: false,
        message: error.response?.data?.message || 'Connection failed. Please check your inputs and try again.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async () => {
    // This would be implemented for a real application
    // For now, we'll just close the dialog and refresh
    handleCloseDialog();
    fetchDatabases();
  };

  const handleViewSchema = async (databaseId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/database/schema/${databaseId}`);
      setSelectedDBSchema(response.data.data);
      setOpenSchemaDialog(true);
    } catch (error) {
      console.error('Error fetching schema:', error);
      setError('Failed to load database schema.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSchemaDialog = () => {
    setOpenSchemaDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Database Connections
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Database
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Database</TableCell>
                <TableCell sx={{ color: 'white' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : databases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      No databases configured yet. Click "Add Database" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                databases.map((db) => (
                  <TableRow key={db.id}>
                    <TableCell>{db.name}</TableCell>
                    <TableCell>{db.type}</TableCell>
                    <TableCell>{db.id}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        aria-label="view schema"
                        onClick={() => handleViewSchema(db.id)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        aria-label="delete"
                        // For a real app, this would delete the database
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Add Database Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Database Connection</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Connection Name"
                fullWidth
                value={newDatabaseForm.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="db-type-label">Database Type</InputLabel>
                <Select
                  labelId="db-type-label"
                  name="type"
                  value={newDatabaseForm.type}
                  label="Database Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="sqlite">SQLite</MenuItem>
                  <MenuItem value="postgres">PostgreSQL</MenuItem>
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="mssql">Microsoft SQL Server</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Conditional fields based on database type */}
            {selectedDBType === 'sqlite' ? (
              <Grid item xs={12}>
                <TextField
                  name="filename"
                  label="Database File Path"
                  fullWidth
                  value={newDatabaseForm.filename}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={8}>
                  <TextField
                    name="host"
                    label="Host"
                    fullWidth
                    value={newDatabaseForm.host}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="port"
                    label="Port"
                    fullWidth
                    value={newDatabaseForm.port}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="database"
                    label="Database Name"
                    fullWidth
                    value={newDatabaseForm.database}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="user"
                    label="Username"
                    fullWidth
                    value={newDatabaseForm.user}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={newDatabaseForm.password}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
          
          {testResult && (
            <Alert 
              severity={testResult.success ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {testResult.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleTestConnection}
            color="secondary"
            startIcon={testingConnection ? <CircularProgress size={20} /> : <RefreshIcon />}
            disabled={testingConnection}
          >
            Test Connection
          </Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={testingConnection || !newDatabaseForm.name}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Schema Dialog */}
      <Dialog open={openSchemaDialog} onClose={handleCloseSchemaDialog} maxWidth="md" fullWidth>
        <DialogTitle>Database Schema</DialogTitle>
        <DialogContent>
          {selectedDBSchema ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Table</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Column</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nullable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDBSchema.map((table) => (
                    table.columns.map((column, colIndex) => (
                      <TableRow key={`${table.table}-${column.name}`}>
                        {colIndex === 0 ? (
                          <TableCell 
                            rowSpan={table.columns.length}
                            sx={{ 
                              fontWeight: 'bold',
                              bgcolor: 'primary.light',
                              color: 'white'
                            }}
                          >
                            {table.table}
                          </TableCell>
                        ) : null}
                        <TableCell>{column.name}</TableCell>
                        <TableCell>{column.type}</TableCell>
                        <TableCell>{column.nullable ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSchemaDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DatabasesPage; 