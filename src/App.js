import React, { useEffect, useState } from 'react';
import CanvasComponent from './components/canvasComponent';
import LoadingScreen from './pages/loadingScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { blueGrey, deepOrange } from '@mui/material/colors';
import WebFont from 'webfontloader';

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
    }, 4000);
    return () => clearTimeout(timer)
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? <LoadingScreen /> : <CanvasComponent />}
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
