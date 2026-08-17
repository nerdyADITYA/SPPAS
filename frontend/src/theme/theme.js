import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F35B25', // Vibrant Orange
      light: '#ff8d58',
      dark: '#b83400',
      contrastText: '#FDFCFC',
    },
    secondary: {
      main: '#2A3356', // Deep Navy Blue
      light: '#585f83',
      dark: '#000b2d',
    },
    background: {
      default: '#101424', // Deep Space Dark Navy
      paper: '#2A3356',   // Deep Navy Blue base
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#06b6d4',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#FDFCFC', // Clean Off-White
      secondary: '#E8E2E2', // Soft Slate Gray
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(243, 91, 37, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(42, 51, 86, 0.45)', // Glassmorphic translucent Navy
          backdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(243, 91, 37, 0.15)', // Light orange border
          borderRadius: 14,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'rgba(243, 91, 37, 0.45)',
            boxShadow: '0 12px 40px 0 rgba(243, 91, 37, 0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
