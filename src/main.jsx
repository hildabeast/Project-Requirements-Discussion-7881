import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// CRITICAL: Import CSS files explicitly
import './index.css';
import './App.css';

// Add error boundary to catch and report runtime errors
const renderApp = () => {
  try {
    // Remove loading state once app is ready
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Clear any existing content
      while (rootElement.firstChild) {
        rootElement.removeChild(rootElement.firstChild);
      }
      
      // Render the app
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
      
      // Log success for debugging
      console.log('Application rendered successfully');
    }
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

// Add DOMContentLoaded event to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}