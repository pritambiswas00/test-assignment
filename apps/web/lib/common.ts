export const formatEndpointError = (endpoint: string, message: string) =>
  `Request failed for ${endpoint}: ${message}`