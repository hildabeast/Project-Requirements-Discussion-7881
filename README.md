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

This project is configured for deployment to Netlify.

### Automatic Deployment (Recommended)

1. **Connect your repository to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select this repository
   - Netlify will automatically detect the build settings from `netlify.toml`

2. **Build Settings (Auto-configured):**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node.js version: 18

3. **Environment Variables:**
   - The Supabase credentials are already configured in the build
   - No additional environment variables needed

### Manual Deployment

You can also deploy manually using the Netlify CLI:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Local Development with Netlify

To test the Netlify environment locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run development server with Netlify functions
netlify dev
```

## Build Configuration

- **Output Directory**: `dist/`
- **Base Path**: `./` (relative paths for static hosting)
- **Routing**: Configured with HashRouter for static hosting compatibility
- **Assets**: Optimized and chunked for better performance
- **Redirects**: Configured for SPA routing in `netlify.toml`

## Netlify Features

- **Automatic HTTPS**: SSL certificates are automatically provisioned
- **Global CDN**: Fast content delivery worldwide
- **Branch Deploys**: Automatic preview deployments for pull requests
- **Form Handling**: Built-in form processing (if needed in future)
- **Edge Functions**: Serverless functions at the edge (if needed)

## Built With

- React
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- Netlify

## Repository

This project is available at: https://github.com/yourusername/readysetgoteach-frontend-7881

## Live Demo

Once deployed, your site will be available at: `https://your-site-name.netlify.app`