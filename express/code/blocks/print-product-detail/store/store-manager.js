import { createZazzlePDPStore } from '../sdk/index.js';
import { getLibs } from '../../../scripts/utils.js';

// Singleton store instance (created once, reused)
let zazzleStore = null;

/**
 * Extract region from ietf locale string (e.g., 'en-US' -> 'us')
 */
function extractRegion(ietf) {
  if (!ietf) return 'us';
  const parts = ietf.split('-');
  if (parts.length < 2) return 'us';
  return parts[1].toLowerCase();
}

/**
 * Extract language from ietf locale string (e.g., 'en-US' -> 'en')
 */
function extractLanguage(ietf) {
  if (!ietf) return 'en';
  const parts = ietf.split('-');
  return parts[0].toLowerCase();
}

/**
 * Get or create the singleton Zazzle PDP store instance
 * @returns {Object} Zazzle PDP store instance
 */
export async function getZazzleStore() {
  if (!zazzleStore) {
    const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
    const config = getConfig();
    const { ietf } = config.locale;
    
    const region = extractRegion(ietf);
    const language = extractLanguage(ietf);
    
    zazzleStore = createZazzlePDPStore({ region, language });
  }
  return zazzleStore;
}
