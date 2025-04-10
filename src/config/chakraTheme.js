import { extendTheme } from '@chakra-ui/react';

// Define the theme configuration object
const themeConfig = {
  colors: {
    brand: {
      500: '#FF69B4', // Placeholder brand color - adjust as needed
    },
  },
  fonts: {
    body: "'Inter', system-ui, sans-serif", // Default body font
    heading: "'Playfair Display', serif", // Default heading font
  },
};

// Create the theme object by extending the default theme
export const theme = extendTheme(themeConfig);