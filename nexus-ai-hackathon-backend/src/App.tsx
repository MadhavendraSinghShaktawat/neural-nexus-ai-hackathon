import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MoodTracker from './components/MoodTracker';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MoodTracker />
    </ThemeProvider>
  );
}

export default App; 