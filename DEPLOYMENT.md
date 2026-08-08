# Deployment Guide for Hostinger

## Prerequisites
- Hostinger VPS with Node.js support
- Domain configured (e.g., indoamericanconnect.com)
- SSH access to the server

## Steps

1. **Clone the repository on the server:**
   ```bash
   git clone <your-repo-url> indo-american-connect
   cd indo-american-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the root directory
   - Fill in the actual values:
     ```
     VITE_API_BASE_URL=https://yourdomain.com
     VITE_SUPABASE_URL=https://fkxgbxhnhjjivufjyzuq.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_key
     ```
   - Copy to backend `.env`:
     ```
     PORT=3002
     NODE_ENV=production
     ```

4. **Build the frontend:**
   ```bash
   npm run build
   ```

5. **Set up PM2 for process management:**
   - Install PM2 globally:
     ```bash
     npm install -g pm2
     ```
   - Start the backend:
     ```bash
     cd backend
     pm2 start ecosystem.config.js
     ```
     Or if no config,:
     ```bash
     pm2 start server.js --name "indo-backend"
     ```

6. **Configure Nginx (if using Hostinger's control panel):**
   - Point domain to the VPS
   - Set up reverse proxy to port 3002

7. **SSL Certificate:**
   - Hostinger provides free SSL via Let's Encrypt
   - Enable it in the control panel

8. **Database:**
   - SQLite database will be created automatically on first run
   - Ensure write permissions for the database.db file

## Monitoring
- Use PM2 logs: `pm2 logs indo-backend`
- Restart: `pm2 restart indo-backend`

## Security Considerations
- Ensure all environment variables are set securely, especially JWT_SECRET and ADMIN_PASSWORD_HASH
- Use HTTPS in production with a valid SSL certificate
- Regularly update dependencies to patch security vulnerabilities
- Monitor server logs for suspicious activity
- Implement firewall rules to restrict access to necessary ports only
- Use strong, hashed passwords for admin accounts
- Enable rate limiting and secure headers as configured in the application

## Backup
- Regularly backup the `database.db` file
- Backup uploaded files in `public/uploads/`
- Store backups securely and test restoration procedures