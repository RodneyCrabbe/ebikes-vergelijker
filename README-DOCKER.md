# E-Bike Vergelijker - Docker Setup

This setup provides a persistent authentication system using Docker containers for all Supabase services.

## 🚀 Quick Start

### Option 1: Using Docker (Recommended for Production)

1. **Start all services:**
   ```bash
   # Windows
   start-docker.bat
   
   # Linux/Mac
   chmod +x start-docker.sh
   ./start-docker.sh
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Database Studio: http://localhost:54323
   - Mail Interface: http://localhost:54330

### Option 2: Using Supabase CLI (Development)

1. **Start Supabase:**
   ```bash
   npx supabase start
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

## 🔧 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | Vue.js application |
| Kong Gateway | 54321 | API Gateway |
| Database | 54322 | PostgreSQL database |
| Studio | 54323 | Database management UI |
| Auth | 54325 | Authentication service |
| REST API | 54326 | PostgREST API |
| Realtime | 54327 | WebSocket service |
| Storage | 54328 | File storage |
| ImgProxy | 54329 | Image processing |
| Mail | 54330 | Email testing |

## 📊 Database

The database includes the following tables:
- `profiles` - User profiles
- `saved_comparisons` - User's saved e-bike comparisons
- `saved_ebikes` - User's favorite e-bikes
- `appointments` - Test ride appointments
- `reviews` - E-bike reviews
- `leads` - Lead tracking

## 🔐 Authentication

- **Registration**: Users can register with email/password
- **Login**: Users can login with their credentials
- **Profile Creation**: Automatically created on registration
- **Session Management**: Persistent sessions with JWT tokens

## 🧪 Testing

Run the authentication test:
```bash
node test-auth-puppeteer.cjs
```

This will:
1. Register a new user
2. Test login functionality
3. Verify profile creation
4. Take screenshots for debugging

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up -d
```

## 🔄 Data Persistence

- Database data is stored in Docker volumes
- User accounts persist between restarts
- All authentication data is preserved

## 🛠️ Troubleshooting

1. **Port conflicts**: Make sure ports 5173, 54321-54331 are available
2. **Database issues**: Check if PostgreSQL container is running
3. **Authentication errors**: Verify Kong gateway is accessible
4. **Frontend not loading**: Check if Vite dev server is running

## 📝 Environment Variables

The following environment variables are configured:
- `VITE_SUPABASE_URL=http://127.0.0.1:54321`
- `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🎯 Features

- ✅ User registration and login
- ✅ Profile management
- ✅ E-bike comparison saving
- ✅ Cookie consent management
- ✅ Responsive design
- ✅ Persistent data storage
- ✅ Email verification (optional)
- ✅ Password reset (optional)

## 📞 Support

If you encounter any issues:
1. Check the Docker logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Test authentication: `node test-auth-puppeteer.cjs`
4. Check the browser console for errors
