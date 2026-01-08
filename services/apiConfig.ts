export const PRODUCTION_BACKEND_URL = 'https://datasense-ai-l07q.onrender.com';
export const LOCAL_BACKEND_URL = 'http://localhost:3001';

export const getBackendUrl = () => {
    // Priority: 
    // 1. Environment variable VITE_API_URL
    // 2. Localhost if in development mode
    // 3. Production URL
    const envUrl = import.meta.env['VITE_API_URL'];
    if (envUrl) return envUrl;

    if (import.meta.env.DEV) {
        return LOCAL_BACKEND_URL;
    }

    return PRODUCTION_BACKEND_URL;
};
