import React from 'react';
import { Center, Spinner, useTheme } from '@chakra-ui/react';

/**
 * Renders a centered Chakra UI Spinner. Accepts props to customize the spinner's appearance and layout container.
 *
 * @param {string} [props.size='xl'] - Chakra UI Spinner size.
 * @param {string} [props.thickness='4px'] - Chakra UI Spinner thickness.
 * @param {string} [props.speed='0.65s'] - Chakra UI Spinner animation speed.
 * @param {string} [props.color] - Chakra UI Spinner color. Defaults to theme's brand color or 'pink.500'.
 * @param {object} [props.rest] - Additional props passed to the containing Chakra UI Center component.
 * @returns {JSX.Element} The loading spinner component.
 */
const LoadingSpinner = ({
  size = 'xl',
  thickness = '4px',
  speed = '0.65s',
  color,
  ...rest // Capture remaining props for the Center component
}) => {
  const theme = useTheme(); // Access the theme object

  // Determine the spinner color using the provided prop, theme brand color, or fallback
  const spinnerColor = color ?? theme.colors?.brand?.[500] ?? 'pink.500';

  return (
    <Center {...rest}> {/* Spread layout props onto the Center component */}
      <Spinner
        size={size}
        thickness={thickness}
        speed={speed}
        color={spinnerColor}
        emptyColor="gray.200" // Explicitly set the track color
        label="Loading..." // Accessibility label for screen readers
      />
    </Center>
  );
};

export default LoadingSpinner;