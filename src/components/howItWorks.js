import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const steps = [
  { title: 'Upload Screenshots', description: 'Simply upload your app screenshots to get started.' },
  { title: 'Select Mockup', description: 'Choose from a variety of device mockups.' },
  { title: 'Auto Fit', description: 'Let AppMocker do the work by automatically fitting your screenshot.' },
  { title: 'Download & Share', description: 'Download your mockups and share them instantly.' },
];

const HowItWorks = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
      <Typography variant="h4" align="center" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>{step.title}</Typography>
              <Typography variant="body2" color="textSecondary">{step.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;
