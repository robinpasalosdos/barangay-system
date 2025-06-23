// Utility to convert object keys to snake_case
export const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

// Utility to convert object keys to camelCase
export const toCamelCase = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
}; 