import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="#">
            Cordly AI
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Terms
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Privacy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 