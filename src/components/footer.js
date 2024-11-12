import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        py: 4,
        textAlign: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        mt: 8,
      }}
    >
      <Typography variant="h6" gutterBottom>Ready to Start?</Typography>
      <Button variant="contained" color="secondary" href="/creator">
        Create Your First Mockup
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        © {new Date().getFullYear()} AppMocker. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
