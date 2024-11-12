import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { Smartphone, AutoAwesome, Speed, SyncAlt } from '@mui/icons-material';

const features = [
  { icon: <Smartphone />, title: 'Responsive Mockups', description: 'Generate high-quality phone mockups that look great on all devices.' },
  { icon: <AutoAwesome />, title: 'Automatic Fit', description: 'AppMocker auto-adjusts screenshots for a seamless fit.' },
  { icon: <Speed />, title: 'Quick & Easy', description: 'Create mockups in seconds with minimal setup.' },
  { icon: <SyncAlt />, title: 'Flexible Output', description: 'Download and share mockups in various formats - coming soon' },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Key Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Box color="primary.main">{feature.icon}</Box>
              <Typography variant="h6" gutterBottom>{feature.title}</Typography>
              <Typography variant="body2" color="textSecondary">{feature.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
