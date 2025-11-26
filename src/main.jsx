import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from './Context/AuthContext';

// ✅ React Query import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ Create QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ Wrap AuthProvider + App with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
