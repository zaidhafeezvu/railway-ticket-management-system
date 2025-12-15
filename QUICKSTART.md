# Quick Start Guide

Get the Railway Ticket Management System up and running in 5 minutes!

## Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd railway-ticket-management-system
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all packages (client, server, shared).

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB if not already installed
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Use it in the next step

### 4. Configure Environment Variables

```bash
# Copy example env file
cp packages/server/.env.example packages/server/.env

# Edit the .env file with your settings
nano packages/server/.env
```

Update these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/railway-ticket-system
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

> **Important**: Change JWT_SECRET to a random string in production!

### 5. Seed Sample Data

```bash
cd packages/server
npm run seed
cd ../..
```

This creates 5 sample trains in your database.

### 6. Start the Application

```bash
npm run dev
```

This starts both frontend and backend servers:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## First Steps

### 1. Create an Account
1. Open http://localhost:3000
2. Click "Register"
3. Fill in your details
4. Submit

### 2. Search for Trains
1. Click "Search Trains" in navbar
2. Browse available trains
3. Or filter by source/destination

### 3. Book Your First Ticket
1. Click "Book Now" on any train
2. Fill in passenger details
3. Select class and date
4. Confirm booking

### 4. View Your Tickets
1. Click "My Tickets" in navbar
2. See all your bookings
3. Click any ticket for details
4. Cancel if needed

## Project Structure

```
railway-ticket-management-system/
├── packages/
│   ├── client/          # React frontend
│   ├── server/          # Express backend
│   └── shared/          # Common utilities
├── package.json         # Root package with workspaces
├── README.md           # Full documentation
├── TESTING.md          # Testing guide
├── ARCHITECTURE.md     # System architecture
└── QUICKSTART.md       # This file
```

## Available Scripts

### Run Everything
```bash
npm run dev              # Start both client and server
```

### Run Separately
```bash
npm run client           # Start frontend only
npm run server           # Start backend only
```

### Build for Production
```bash
npm run build            # Build all packages
npm run build:client     # Build frontend only
npm run build:server     # Build backend only
```

### Database
```bash
cd packages/server
npm run seed             # Seed sample data
```

## API Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all trains
curl http://localhost:5000/api/trains

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in packages/server/.env
PORT=5001
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/railway
```

### Dependencies Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules
npm install
```

### Frontend Not Loading
```bash
# Clear browser cache
# Or try incognito mode
# Check browser console for errors
```

## Default Sample Data

After seeding, you'll have these trains:

1. **Rajdhani Express** (12301)
   - New Delhi → Mumbai
   - All classes available

2. **Shatabdi Express** (12302)
   - Chennai → Bangalore
   - AC classes only

3. **Duronto Express** (12303)
   - Kolkata → New Delhi
   - Sleeper and AC classes

4. **Garib Rath** (12304)
   - Jaipur → Mumbai
   - Budget-friendly options

5. **Vande Bharat Express** (12305)
   - New Delhi → Varanasi
   - Premium AC classes

## Key Features

- ✅ User authentication (Register/Login)
- ✅ Train search with filters
- ✅ Real-time seat availability
- ✅ Ticket booking
- ✅ PNR generation
- ✅ Booking management
- ✅ Ticket cancellation
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS v4
- ✅ Icon library (Lucide React)

## Tech Stack Highlights

### Frontend
- React 18
- Vite (Lightning fast!)
- Tailwind CSS v4
- Lucide React icons
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing

## Next Steps

1. ✅ Complete quick start
2. 📖 Read full [README.md](README.md)
3. 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md)
4. 🧪 Follow [TESTING.md](TESTING.md)
5. 🚀 Deploy to production

## Common Tasks

### Add More Trains
Edit `packages/server/scripts/seed.js` and run:
```bash
cd packages/server && npm run seed
```

### Change JWT Expiration
Edit `packages/server/controllers/authController.js`:
```javascript
expiresIn: '30d'  // Change to your preference
```

### Customize UI Colors
Edit `packages/client/src/styles/index.css`:
```css
@import "tailwindcss";

/* Add custom styles here */
```

### Add New Routes
1. Create route in `packages/server/routes/`
2. Create controller in `packages/server/controllers/`
3. Add to `packages/server/server.js`

## Support

Having issues? Check:
- Console logs (browser and terminal)
- MongoDB connection
- Environment variables
- Network requests in browser DevTools

## Contributing

Want to contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)

## What's Next?

Explore advanced features:
- Payment integration
- Email notifications
- Admin dashboard
- Analytics
- Mobile app

Happy coding! 🚂🎫
