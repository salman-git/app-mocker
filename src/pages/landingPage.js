import React from 'react';
import { Container } from '@mui/material';
import HeroSection from '../components/heroSection';
import FeaturesSection from '../components/featuresSection';
import HowItWorks from '../components/howItWorks';
import Footer from '../components/footer';

function LandingPage() {
  return (
    <Container maxWidth="lg">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </Container>
  );
}

export default LandingPage;
