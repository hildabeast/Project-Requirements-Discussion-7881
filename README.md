# ReadySetGoTeach Frontend

A teaching platform that enables educators to deliver interactive lessons with dual-screen capabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

This project is deployed on Netlify at: https://readysetgoteach.netlify.app/

### Netlify Configuration

The project includes a `netlify.toml` file with:
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node.js version: 18
- SPA redirects for React Router
- Security headers and caching

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy using Netlify CLI
npx netlify-cli deploy --prod --dir=dist
```

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Supabase** - Backend database
- **Netlify** - Hosting platform

## 📱 Features

- Interactive lesson delivery
- Dual-screen presentation mode
- Student content visibility controls
- Professional curriculum design
- Responsive design
- Real-time resource embedding

## 🔧 Development

The app runs on `http://localhost:3000` in development mode.

Build artifacts are generated in the `dist/` directory.

## 🔒 Environment

Supabase credentials are configured for the production environment.