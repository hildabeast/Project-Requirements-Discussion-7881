import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// CRITICAL: Import CSS files explicitly
import './index.css';
import './App.css';

// Enhanced app rendering with better error handling
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    // Clear loading content
    rootElement.innerHTML = '';
    
    // Add class to indicate app is loaded
    document.body.classList.add('app-loaded');
    
    // Create and render the app
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Log success for debugging
    console.log('✅ ReadySetGoTeach application loaded successfully');
    
  } catch (error) {
    console.error('❌ Error rendering application:', error);
    
    // Render enhanced fallback UI
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9fafb;
        ">
          <div style="
            max-width: 500px;
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          ">
            <div style="
              width: 64px;
              height: 64px;
              background: #fee2e2;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem;
              font-size: 24px;
            ">⚠️</div>
            <h2 style="
              color: #111827;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1rem;
            ">Application Error</h2>
            <p style="
              color: #6b7280;
              margin-bottom: 1.5rem;
              line-height: 1.6;
            ">ReadySetGoTeach failed to load. Please try refreshing the page or contact support if the problem persists.</p>
            <button onclick="window.location.reload()" style="
              background: #2563eb;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              font-size: 0.875rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
              Refresh Page
            </button>
            <details style="
              margin-top: 1.5rem;
              text-align: left;
              font-size: 0.75rem;
              color: #9ca3af;
            ">
              <summary style="cursor: pointer; margin-bottom: 0.5rem;">Technical Details</summary>
              <pre style="
                background: #f3f4f6;
                padding: 0.75rem;
                border-radius: 4px;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-all;
              ">${error.message}</pre>
            </details>
          </div>
        </div>
      `;
    }
  }
};

// Ensure DOM is ready before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Add global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Add global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});