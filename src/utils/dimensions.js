import { Dimensions } from 'react-native';

/**
 * Base design dimensions (iPhone standard - most common mobile size)
 */
export const BASE_WIDTH = 375;
export const BASE_HEIGHT = 667;

/**
 * Safely get window dimensions
 * Returns default values if Dimensions is not ready
 * NEVER throws an error - always returns valid dimensions
 */
export function getSafeWindowDimensions() {
  try {
    const window = Dimensions.get('window');
    if (window && typeof window.width === 'number' && typeof window.height === 'number') {
      return {
        width: window.width,
        height: window.height
      };
    }
  } catch (error) {
    console.warn('Error getting dimensions:', error);
  }
  // Safe defaults
  return {
    width: BASE_WIDTH,
    height: BASE_HEIGHT
  };
}

/**
 * Responsive scaling function based on screen width
 * Scales proportionally from base width (375px)
 * @param {number} size - Original size in pixels
 * @param {number} baseWidth - Base width for scaling (default: 375)
 * @param {number} maxScale - Maximum scale factor (default: 1.5 for tablets)
 * @returns {number} Scaled size
 */
export function scaleSize(size, baseWidth = BASE_WIDTH, maxScale = 1.5) {
  try {
    const dimensions = getSafeWindowDimensions();
    const width = dimensions?.width || baseWidth;
    const scale = width / baseWidth;
    const scaledSize = size * Math.min(scale, maxScale);
    return Math.round(scaledSize);
  } catch (error) {
    return size;
  }
}

/**
 * Responsive scaling function based on screen height
 * @param {number} size - Original size in pixels
 * @param {number} baseHeight - Base height for scaling (default: 667)
 * @param {number} maxScale - Maximum scale factor (default: 1.5)
 * @returns {number} Scaled size
 */
export function scaleSizeVertical(size, baseHeight = BASE_HEIGHT, maxScale = 1.5) {
  try {
    const dimensions = getSafeWindowDimensions();
    const height = dimensions?.height || baseHeight;
    const scale = height / baseHeight;
    const scaledSize = size * Math.min(scale, maxScale);
    return Math.round(scaledSize);
  } catch (error) {
    return size;
  }
}

/**
 * Get responsive font size
 * Scales fonts proportionally but with limits for readability
 * @param {number} fontSize - Base font size
 * @param {number} minSize - Minimum font size (default: 10)
 * @param {number} maxSize - Maximum font size (default: 40)
 * @returns {number} Scaled font size
 */
export function scaleFont(fontSize, minSize = 10, maxSize = 40) {
  const scaled = scaleSize(fontSize);
  return Math.max(minSize, Math.min(scaled, maxSize));
}

/**
 * Get percentage of screen width
 * @param {number} percentage - Percentage (0-100)
 * @returns {number} Width in pixels
 */
export function widthPercentage(percentage) {
  const dimensions = getSafeWindowDimensions();
  return (dimensions.width * percentage) / 100;
}

/**
 * Get percentage of screen height
 * @param {number} percentage - Percentage (0-100)
 * @returns {number} Height in pixels
 */
export function heightPercentage(percentage) {
  const dimensions = getSafeWindowDimensions();
  return (dimensions.height * percentage) / 100;
}

/**
 * Check if device is a tablet
 * @returns {boolean} True if device width >= 768px
 */
export function isTablet() {
  const dimensions = getSafeWindowDimensions();
  return dimensions.width >= 768;
}

/**
 * Check if device is small (width < 375px)
 * @returns {boolean} True if device width < 375px
 */
export function isSmallDevice() {
  const dimensions = getSafeWindowDimensions();
  return dimensions.width < 375;
}

