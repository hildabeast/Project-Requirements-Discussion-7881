import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Import CSS with explicit path to ensure it's included in the build
import './index.css';

// Add error boundary to catch and report runtime errors
const renderApp = () => {
  try {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error rendering application:', error);
    // Render fallback UI if the app fails to load
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h2>Something went wrong</h2>
          <p>The application failed to load. Please try refreshing the page.</p>
          <p style="color: #666; font-size: 0.8em;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
};

renderApp();