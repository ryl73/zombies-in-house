import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import bgHalloween from '../assets/bg-halloween.png'

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#823329',
      light: '#a55c52',
      dark: '#5a1f1e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#e3336d',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0B1727',
      paper: '#1D333B',
    },
    text: {
      primary: '#F7F4F3',
      secondary: '#D3E4DC',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Rubik Wet Paint", Rubik, sans-serif',
      fontWeight: 700,
      fontSize: '96px',
      textTransform: 'uppercase',
      textShadow: '2px 2px 4px rgba(11, 23, 39, 0.5)',
      color: '#F7F4F3',
      '@media (max-width: 768px)': {
        fontSize: '64px',
      },
      '@media (max-width: 480px)': {
        fontSize: '48px',
      },
    },
    h2: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '2.5rem',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '1.5rem',
      marginBottom: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.25rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        ':root': {
          '--text-white': '#fff',
        },
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: '#f7f4f3 !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        '.MuiTextField-root input:-webkit-autofill, .MuiTextField-root input:-webkit-autofill:hover, .MuiTextField-root input:-webkit-autofill:focus, .MuiTextField-root input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: ' #f7f4f3 !important',
            borderRadius: '4px',
          },
        body: {
          fontFamily: 'Rubik, sans-serif',
          fontSize: '18px',
          lineHeight: '24px',
          backgroundColor: '#0B1727',
          color: '#F7F4F3',
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      },
      colorPrimary: {
        backgroundColor: '#0B1727',
      },
    },
    MuiToolbar: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '8px 16px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        margin: '4px',
        '&:hover': {
          transform: 'translateY(-1px)',
          backgroundColor: '#355155',
        },
      },
      contained: {
        boxShadow: '0 2px 6px rgba(11, 23, 39, 0.3)',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(11, 23, 39, 0.4)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #823329 30%, #6a2921 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #6a2921 30%, #4a1c1c 90%)',
        },
      },
      text: {
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
      sizeLarge: {
        height: 48,
        padding: '0 30px',
        fontSize: '1.1rem',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: '#1D333B',
        borderRadius: 8,
        overflow: 'hidden',
      },
    },
    MuiCardContent: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#1D333B',
          color: '#F7F4F3',
          '& fieldset': {
            borderColor: '#355155',
          },
          '&:hover fieldset': {
            borderColor: '#CBAC51',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#823329',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#D3E4DC',
        },
      },
    },
    MuiLink: {
      root: {
        color: '#823329',
        fontWeight: 500,
        '&:hover': {
          color: '#5a1f1e',
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#355155',
      },
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true,
    },
    MuiAppBar: {
      elevation: 4,
    },
    MuiButton: {
      disableElevation: true,
    },
    MuiCard: {
      elevation: 2,
    },
  },
})

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#823329',
      light: '#a55c52',
      dark: '#5a1f1e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#e3336d',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f4f3',
      paper: '#ffffff',
    },
    text: {
      primary: '#0B1727',
      secondary: '#0B1727',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Rubik Wet Paint", Rubik, sans-serif',
      fontWeight: 700,
      fontSize: '96px',
      textTransform: 'uppercase',
      textShadow: '2px 2px 4px rgba(11, 23, 39, 0.5)',
      color: '#F7F4F3',
      '@media (max-width: 768px)': {
        fontSize: '64px',
      },
      '@media (max-width: 480px)': {
        fontSize: '48px',
      },
    },
    h2: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#0B1727',
      fontSize: '2.5rem',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#0B1727',
      fontSize: '1.5rem',
      marginBottom: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.25rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        ':root': {
          '--text-white': '#fff',
        },
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: '#0B1727 !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        '.MuiTextField-root input:-webkit-autofill, .MuiTextField-root input:-webkit-autofill:hover, .MuiTextField-root input:-webkit-autofill:focus, .MuiTextField-root input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: ' #0B1727 !important',
            borderRadius: '4px',
          },
        body: {
          fontFamily: 'Rubik, sans-serif',
          fontSize: '18px',
          lineHeight: '24px',
          backgroundColor: '#F7F4F3',
          backgroundImage: 'none !important',
          color: '#0B1727',
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      },
      colorPrimary: {
        backgroundColor: '#ffffff',
      },
    },
    MuiToolbar: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '8px 16px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        margin: '4px',
        '&:hover': {
          transform: 'translateY(-1px)',
          backgroundColor: '#355155',
        },
      },
      contained: {
        boxShadow: '0 2px 6px rgba(11, 23, 39, 0.3)',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(11, 23, 39, 0.4)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #823329 30%, #6a2921 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #6a2921 30%, #4a1c1c 90%)',
        },
      },
      text: {
        color: '#0b1727',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.1)',
        },
      },
      sizeLarge: {
        height: 48,
        padding: '0 30px',
        fontSize: '1.1rem',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: '#1D333B',
        borderRadius: 8,
        overflow: 'hidden',
      },
    },
    MuiCardContent: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#F7F4F3',
          color: '#1D333B',
          '& fieldset': {
            borderColor: '#355155',
          },
          '&:hover fieldset': {
            borderColor: '#CBAC51',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#823329',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#1D333B',
        },
      },
    },
    MuiLink: {
      root: {
        color: '#823329',
        fontWeight: 500,
        '&:hover': {
          color: '#5a1f1e',
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#355155',
      },
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true,
    },
    MuiAppBar: {
      elevation: 4,
    },
    MuiCard: {
      elevation: 2,
    },
  },
})

const halloweenTheme = createTheme({
  palette: {
    primary: {
      main: '#823329',
      light: '#a55c52',
      dark: '#5a1f1e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#e3336d',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0B1727',
      paper: '#1D333B',
    },
    text: {
      primary: '#F7F4F3',
      secondary: '#D3E4DC',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Rubik Wet Paint", Rubik, sans-serif',
      fontWeight: 700,
      fontSize: '96px',
      textTransform: 'uppercase',
      textShadow: '2px 2px 4px rgba(11, 23, 39, 0.5)',
      color: '#F7F4F3',
      '@media (max-width: 768px)': {
        fontSize: '64px',
      },
      '@media (max-width: 480px)': {
        fontSize: '48px',
      },
    },
    h2: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '2.5rem',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 600,
      color: '#F7F4F3',
      fontSize: '1.5rem',
      marginBottom: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '1.25rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        ':root': {
          '--text-white': '#fff',
        },
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: '#f7f4f3 !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        '.MuiTextField-root input:-webkit-autofill, .MuiTextField-root input:-webkit-autofill:hover, .MuiTextField-root input:-webkit-autofill:focus, .MuiTextField-root input:-webkit-autofill:active':
          {
            WebkitBoxShadow: '0 0 0 30px transparent inset !important',
            WebkitTextFillColor: ' #f7f4f3 !important',
            borderRadius: '4px',
          },
        body: {
          fontFamily: 'Rubik, sans-serif',
          fontSize: '18px',
          lineHeight: '24px',
          backgroundColor: '#0B1727',
          backgroundImage: `url(${bgHalloween})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          color: '#F7F4F3',
        },
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      },
      colorPrimary: {
        backgroundColor: '#0B1727',
      },
    },
    MuiToolbar: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '8px 16px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        margin: '4px',
        '&:hover': {
          transform: 'translateY(-1px)',
          backgroundColor: '#355155',
        },
      },
      contained: {
        boxShadow: '0 2px 6px rgba(11, 23, 39, 0.3)',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(11, 23, 39, 0.4)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #823329 30%, #6a2921 90%)',
        '&:hover': {
          background: 'linear-gradient(45deg, #6a2921 30%, #4a1c1c 90%)',
        },
      },
      text: {
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
      sizeLarge: {
        height: 48,
        padding: '0 30px',
        fontSize: '1.1rem',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: '#1D333B',
        borderRadius: 8,
        overflow: 'hidden',
      },
    },
    MuiCardContent: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#1D333B',
          color: '#F7F4F3',
          '& fieldset': {
            borderColor: '#355155',
          },
          '&:hover fieldset': {
            borderColor: '#CBAC51',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#823329',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#D3E4DC',
        },
      },
    },
    MuiLink: {
      root: {
        color: '#823329',
        fontWeight: 500,
        '&:hover': {
          color: '#5a1f1e',
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#355155',
      },
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true,
    },
    MuiAppBar: {
      elevation: 4,
    },
    MuiButton: {
      disableElevation: true,
    },
    MuiCard: {
      elevation: 2,
    },
  },
})

export { darkTheme, lightTheme, halloweenTheme }
