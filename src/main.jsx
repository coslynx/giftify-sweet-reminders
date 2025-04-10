import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App.jsx';
import theme from './config/chakraTheme.js'; // Assuming this exports a valid theme
import { AuthProvider } from './contexts/AuthContext.jsx'; // Assuming this exports AuthProvider
import './styles/global.css'; // Import global styles for side effects

// Find the root DOM element
const rootElement = document.getElementById('root');

// Ensure the root element exists before attempting to render
if (!rootElement) {
  throw new Error("Root element #root not found in the DOM. Ensure it exists in public/index.html.");
}

// Create a React root attached to the DOM element
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);