/**
 * @param {string} name
 * @returns {boolean}
 */
export const excludeTest = (name) => false;

/**
 * @param {string} name
 * @returns {boolean}
 */
export const includeTest = (name) => name === "regex";

/**
 * @param {string} name
 * @returns {boolean}
 */
export const excludeEngine = (name) => false;

/**
 * @param {string} name
 * @returns {boolean}
 */
export const includeEngine = (name) => true;
