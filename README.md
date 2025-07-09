# ReadySetGoTeach Frontend

A teaching platform that enables educators to deliver interactive lessons with dual-screen capabilities.

## Features

- Professionally designed curriculum with clear objectives and activities
- Interactive teaching with dual-screen presentation mode
- Student-centered with differentiated content visibility
- Intuitive interface for easy navigation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for automatic deployment to Hostinger using GitHub Actions.

### Setup:

1. **GitHub Repository**: Push your code to the `main` branch
2. **Hostinger Configuration**: Point your Hostinger hosting to pull from the `deploy` branch
3. **Automatic Deployment**: Every push to `main` triggers a build and deployment to the `deploy` branch

### Manual Deployment:

```bash
# Build and deploy manually
npm run deploy
```

### Hostinger Setup:

1. In your Hostinger control panel, go to Git deployment
2. Connect your GitHub repository
3. Set the branch to `deploy`
4. Set the public folder to the root (`/`) since the build outputs directly to the deploy branch
5. Enable automatic deployment

## Build Configuration

- **Output Directory**: `dist/`
- **Base Path**: `./` (relative paths for static hosting)
- **Routing**: Configured with HashRouter for static hosting compatibility
- **Assets**: Optimized and chunked for better performance

## Built With

- React
- Vite
- Tailwind CSS
- Framer Motion
- Supabase

## Repository

This project is available at: https://github.com/yourusername/readysetgoteach-frontend-7881