# GitHub Pages Deployment Guide

## ✅ Configuration Complete

Your project has been configured for GitHub Pages deployment. The following changes have been made:

1. ✅ Updated `vite.config.js` with base path `/Smart-Waste-Management/`
2. ✅ Changed to `HashRouter` for GitHub Pages compatibility
3. ✅ Created GitHub Actions workflow (`.github/workflows/deploy.yml`)
4. ✅ Added `404.html` for SPA routing support
5. ✅ Created README.md with project information

## 🚀 Enable GitHub Pages

Follow these steps to enable GitHub Pages:

### Step 1: Go to Repository Settings
1. Navigate to: https://github.com/masummgr01/Smart-Waste-Management/settings/pages
2. Or go to your repository → **Settings** → **Pages** (in the left sidebar)

### Step 2: Configure Source
1. Under **"Build and deployment"** section
2. Find **"Source"** dropdown
3. Select **"GitHub Actions"** (not "Deploy from a branch")
4. Click **Save**

### Step 3: Wait for Deployment
1. The GitHub Actions workflow will automatically trigger
2. Go to **Actions** tab in your repository to see the deployment progress
3. Once complete, your site will be available at:
   **https://masummgr01.github.io/Smart-Waste-Management/**

## 📝 Important Notes

### URL Structure
- Your app uses **HashRouter**, so URLs will look like:
  - `https://masummgr01.github.io/Smart-Waste-Management/#/login`
  - `https://masummgr01.github.io/Smart-Waste-Management/#/user/dashboard`
- This is normal and required for GitHub Pages to work correctly

### Backend API
- The frontend is configured to use environment variables for the API URL
- For production, you'll need to:
  1. Deploy your backend to a service like Heroku, Railway, or Render
  2. Update the `VITE_API_BASE_URL` environment variable in GitHub Actions
  3. Or update `frontend/src/utils/constants.js` with your production API URL

### Environment Variables (Optional)
To set environment variables for the build:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   - `VITE_API_BASE_URL`: Your production backend URL (e.g., `https://your-backend.herokuapp.com/api/v1`)
   - `VITE_SOCKET_URL`: Your production WebSocket URL (e.g., `https://your-backend.herokuapp.com`)

## 🔄 Automatic Deployment

Every time you push to the `main` branch, GitHub Actions will:
1. Install dependencies
2. Build the frontend
3. Deploy to GitHub Pages

You can also manually trigger deployment from the **Actions** tab.

## 🐛 Troubleshooting

### 404 Error
- Make sure GitHub Actions is selected as the source (not a branch)
- Check the Actions tab for any build errors
- Wait a few minutes after enabling - first deployment can take 5-10 minutes

### Build Fails
- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Routes Not Working
- HashRouter is already configured - URLs should have `#` in them
- If using direct links, make sure they include the hash: `/#/login`

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

