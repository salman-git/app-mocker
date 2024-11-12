import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from './pages/loadingScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { blueGrey, deepOrange } from '@mui/material/colors';
import WebFont from 'webfontloader';
import LandingPage from './pages/landingPage';
import CreatorPage from './pages/creatorPage'

let theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[500],
    },
    secondary: {
      main: deepOrange[500],
    },
    canvasBackground: blueGrey[900]
  },
});
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Creepster:200,400,700', 'Roboto:400,700', "Montaga:400", "Itim:400", "Oswald:200,300", "Lato:100,400,700", "Montserrat:100,200,700"]  // Load the weights you need
      },
      active: () => {
      },
    });
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000);
    return () => clearTimeout(timer)
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loading ? <LoadingScreen /> : <LandingPage />}
          ></Route>
          <Route path="creator" element={<CreatorPage/>}></Route>
        </Routes>
      </BrowserRouter>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
