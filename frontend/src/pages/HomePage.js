import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { QuestionAnswer as QueryIcon, Storage as DatabaseIcon, BarChart as ChartIcon } from '@mui/icons-material';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: 8, 
          pb: 6,
          background: 'linear-gradient(to right, #2962ff, #1565c0)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            fontWeight="bold"
            gutterBottom
          >
            Cordly AI
          </Typography>
          <Typography variant="h5" paragraph>
            Ask complex business questions in natural language and get insightful answers from your SQL database
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/query"
              startIcon={<QueryIcon />}
              sx={{ mr: 2 }}
            >
              Start Querying
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/databases"
              startIcon={<DatabaseIcon />}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
              }}
            >
              Manage Databases
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #eaeaea',
                borderRadius: 2
              }}
            >
              <QueryIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Natural Language Queries
              </Typography>
              <Typography>
                Ask complex business questions in plain English and get accurate SQL queries generated automatically.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #eaeaea',
                borderRadius: 2
              }}
            >
              <Box 
                component={ChartIcon}
                color="primary"
                sx={{ 
                  fontSize: 60,
                  mb: 2
                }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Automatic Visualizations
              </Typography>
              <Typography>
                Get relevant charts and tables automatically generated based on your query results.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #eaeaea',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 2,
                fontSize: 30
              }}>
                💡
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Insightful Explanations
              </Typography>
              <Typography>
                Get clear natural language explanations of your results with key insights highlighted.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 