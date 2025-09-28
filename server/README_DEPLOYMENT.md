# Backend Deployment Guide (Render)

## Quick Setup for Render

### 1. Environment Variables
Create a `.env` file in the `server` directory with:
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-super-secret-jwt-key
JWT_LIFETIME=7d
CLIENT_URL=https://your-frontend-url.netlify.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Render Configuration
The `render.yaml` file is already configured for:
- Build command: `npm install`
- Start command: `npm start`
- Environment variables template

### 3. Deployment Steps
1. Push your code to GitHub
2. Connect repository to Render
3. Select "Web Service"
4. Set root directory to `server`
5. Add all environment variables
6. Deploy

### 4. Required Services Setup

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to `MONGO_URI`

#### Cloudinary
1. Create account at [Cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to environment variables

#### Email Service (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Use App Password in `EMAIL_PASS`

### 5. Important Notes
- Render free tier has sleep mode (cold starts)
- Update `CLIENT_URL` after frontend deployment
- Monitor logs for any issues
- Ensure all environment variables are set

## API Endpoints
Your backend will be available at: `https://your-app-name.onrender.com/api`

## Health Check
Test your deployment: `https://your-app-name.onrender.com/api/auth/health`

