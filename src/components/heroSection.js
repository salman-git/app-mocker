import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage: 'url(/path/to/background-image.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        AppMocker: Create Stunning Play Store Mockups
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Effortlessly fit your screenshots into phone mockups with minimal user interaction.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/creator"
        sx={{ mt: 4 }}
      >
        Start Mocking Now
      </Button>
    </Box>
  );
};

export default HeroSection;
