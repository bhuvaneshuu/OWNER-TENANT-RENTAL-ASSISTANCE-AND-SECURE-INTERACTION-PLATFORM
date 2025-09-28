# Frontend Deployment Guide (Netlify)

## Quick Setup for Netlify

### 1. Environment Variables
Create a `.env` file in the `client` directory with:
```env
VITE_APP_API_URL=https://your-backend-url.onrender.com/api
VITE_APP_API_HOST=https://your-backend-url.onrender.com
VITE_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

### 2. Netlify Configuration
The `netlify.toml` file is already configured for:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects for SPA routing

### 3. Deployment Steps
1. Push your code to GitHub
2. Connect repository to Netlify
3. Set build directory to `client`
4. Add environment variables in Netlify dashboard
5. Deploy

### 4. Environment Variables in Netlify
Go to Site settings > Environment variables and add:
- `VITE_APP_API_URL`
- `VITE_APP_API_HOST` 
- `VITE_APP_SOCKET_URL`

## Build Commands
- **Development**: `npm run start`
- **Production Build**: `npm run build`
- **Preview**: `npm run preview`

## Important Notes
- Make sure your backend is deployed first
- Update backend CORS settings with your Netlify URL
- Test the connection between frontend and backend

