# Azure App Service Deployment Guide

## Prerequisites

1. Azure App Service with Node.js 20.x runtime
2. GitHub repository with proper secrets configured
3. MongoDB Atlas database

## Environment Variables

Make sure these environment variables are set in your Azure App Service:

```bash
WEBSITE_NODE_DEFAULT_VERSION=20.x
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://akayastha2:Kathmandu12345@mycluster.jxvkltu.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster
JWT_SECRET=secret
```

## Deployment Steps

1. **Push to main branch** - This triggers the GitHub Actions workflow
2. **Monitor the workflow** - Check for any build or deployment errors
3. **Verify deployment** - The workflow includes verification steps

## Troubleshooting

### Common Issues

1. **Internal Server Error (500)**
   - Check if all environment variables are set
   - Verify MongoDB connection
   - Check Azure App Service logs

2. **Build Failures**
   - Ensure Node.js 20.x is specified
   - Check for missing dependencies
   - Verify React build process

3. **Deployment Package Issues**
   - The workflow includes verification steps
   - Check if all required files are present
   - Verify package.json structure

### Manual Verification

You can manually verify the deployment by:

1. **Checking the health endpoint**: `https://your-app.azurewebsites.net/health`
2. **Checking Azure App Service logs** in the Azure portal
3. **Testing the API endpoints** directly

### Local Testing

To test locally before deployment:

```bash
# Install dependencies
npm install --legacy-peer-deps
cd client && npm install --legacy-peer-deps && cd ..

# Build frontend
cd client && npm run build && cd ..

# Start server
npm start
```

## File Structure

The deployment package should contain:

```
deploy-folder/
├── server.js
├── startup.js
├── package.json
├── web.config
├── config/
├── models/
├── routes/
├── validation/
├── uploads/
├── build/
└── node_modules/
```

## Support

If you continue to experience issues:

1. Check the GitHub Actions logs for detailed error messages
2. Review Azure App Service application logs
3. Verify all environment variables are correctly set
4. Ensure MongoDB Atlas is accessible from Azure