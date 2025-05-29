export const environment = {
  production: true,
  apiUrl: (window as any)['env']?.API_URL || 'http://localhost:4000/api/auth/',
  myCheck: 'ad929e8f-8874-447e-8dc1-f0a2de6efc13'
};