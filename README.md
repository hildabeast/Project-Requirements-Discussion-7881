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

### CI/CD Features:

- **Automatic package-lock.json maintenance**: The workflow automatically commits any changes to package-lock.json
- **Deterministic builds**: Ensures consistent dependencies across all environments
- **Monthly dependency refresh**: Scheduled workflow updates dependencies on the 1st of each month
- **Manual deployment**: Trigger deployments manually via GitHub Actions UI

### Available Workflows:

1. **Deploy to Hostinger** (`.github/workflows/deploy.yml`):
   - Triggers on push to `main` branch
   - Installs dependencies, builds project, and deploys to `deploy` branch
   - Automatically commits package-lock.json changes

2. **Update Package Lock** (`.github/workflows/update-package-lock.yml`):
   - Runs monthly on the 1st
   - Can be triggered manually
   - Updates dependencies and commits package-lock.json changes

3. **Manual Deploy** (`.github/workflows/manual-deploy.yml`):
   - Trigger via GitHub Actions UI
   - Choose environment (production/staging)
   - Immediate deployment without waiting for push

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

### Troubleshooting:

- **Build fails**: Check that all dependencies are properly installed and package-lock.json is up to date
- **Deployment fails**: Verify the `deploy` branch exists and Hostinger is configured correctly
- **Missing files**: Ensure all source files are committed to the `main` branch

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