# Testing Guide

This guide explains how to test the Railway Ticket Management System.

## Prerequisites

Before testing, ensure:
1. Node.js (v16+) is installed
2. MongoDB is running locally or accessible via connection string
3. All dependencies are installed: `npm install`

## Setup for Testing

### 1. Install Dependencies

```bash
# From root directory
npm install

# This installs dependencies for all workspaces
```

### 2. Configure Environment

Create `.env` file in `packages/server/`:

```bash
cp packages/server/.env.example packages/server/.env
```

Edit the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/railway-ticket-system
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Start MongoDB

Ensure MongoDB is running:
```bash
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed Sample Data

Populate the database with sample train data:

```bash
cd packages/server
npm run seed
```

This will create 5 sample trains with different routes and classes.

## Running the Application

### Option 1: Run Both Client and Server Together

```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3000

### Option 2: Run Separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## Manual Testing Scenarios

### 1. User Registration

1. Navigate to http://localhost:3000
2. Click "Register" button
3. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Password: password123
4. Submit the form
5. Verify redirect to search page
6. Check token is stored in localStorage

**Expected Result**: User is registered and logged in automatically

### 2. User Login

1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Sign in"
4. Verify redirect to search page

**Expected Result**: User is logged in successfully

### 3. Search Trains

1. Go to http://localhost:3000/search
2. Leave search fields empty and click "Search"
3. Verify all trains are displayed
4. Try searching with:
   - Source: "New Delhi"
   - Click "Search"
5. Verify only trains from New Delhi are shown

**Expected Result**: Train search works with and without filters

### 4. Book a Ticket

1. From search results, click "Book Now" on any train
2. Verify you're redirected to booking page
3. Fill in passenger details:
   - Passenger Name: John Doe
   - Age: 30
   - Gender: Male
   - Class: Select any available class
   - Journey Date: Select a future date
4. Click "Confirm Booking"
5. Verify redirect to ticket details page
6. Check PNR is generated

**Expected Result**: Ticket is booked successfully

### 5. View My Tickets

1. Click "My Tickets" in navbar
2. Verify the booked ticket appears in the list
3. Check ticket shows:
   - Train name and number
   - Route (source → destination)
   - Journey date
   - PNR number
   - Status (BOOKED)
4. Click on the ticket card

**Expected Result**: All tickets are listed correctly

### 6. View Ticket Details

1. From My Tickets, click on any ticket
2. Verify complete ticket information is displayed:
   - PNR number
   - Train details
   - Journey details
   - Passenger information
   - Fare details
   - Booking date
3. Verify "Cancel Ticket" button is visible for booked tickets

**Expected Result**: Complete ticket details are shown

### 7. Cancel a Ticket

1. Open a booked ticket's details page
2. Click "Cancel Ticket" button
3. Confirm cancellation in the popup
4. Verify:
   - Status changes to "CANCELLED"
   - Cancel button is no longer visible
   - Seat is restored (check by trying to book again)

**Expected Result**: Ticket is cancelled successfully

### 8. Test Authentication

1. Logout from the application
2. Try to access http://localhost:3000/my-tickets directly
3. Verify redirect to login page
4. Login and verify redirect back to intended page

**Expected Result**: Private routes are protected

## API Testing with cURL/Postman

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from response for subsequent requests.

### Get All Trains

```bash
curl http://localhost:5000/api/trains
```

### Search Trains

```bash
curl "http://localhost:5000/api/trains?source=New%20Delhi&destination=Mumbai"
```

### Book Ticket (Authenticated)

```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "trainId": "TRAIN_ID_FROM_SEARCH",
    "passengerName": "John Doe",
    "passengerAge": 30,
    "passengerGender": "male",
    "classType": "3ac",
    "journeyDate": "2024-12-25",
    "source": "New Delhi",
    "destination": "Mumbai"
  }'
```

### Get My Tickets (Authenticated)

```bash
curl http://localhost:5000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Cancel Ticket (Authenticated)

```bash
curl -X PUT http://localhost:5000/api/tickets/TICKET_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### 1. MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**: 
- Ensure MongoDB is running
- Check connection string in .env file
- Try connecting to MongoDB Atlas if local connection fails

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Kill the process using the port
- Or change PORT in .env file

### 3. Module Not Found Error

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd packages/server
npm install
```

### 4. Tailwind CSS Not Working

**Solution**:
```bash
cd packages/client
npm install
```

### 5. CORS Error

**Error**: CORS policy blocking requests

**Solution**: Already configured in server.js, but ensure both servers are running

## Verification Checklist

After testing, verify:

- [ ] User can register successfully
- [ ] User can login successfully
- [ ] User can logout successfully
- [ ] All trains are displayed on search page
- [ ] Train search filters work correctly
- [ ] User can book a ticket
- [ ] Booked tickets appear in "My Tickets"
- [ ] Ticket details show complete information
- [ ] User can cancel a booked ticket
- [ ] Cancelled tickets show correct status
- [ ] Private routes are protected
- [ ] Authentication persists across page reloads
- [ ] Responsive design works on mobile
- [ ] Icons from lucide-react are displayed
- [ ] Tailwind CSS v4 styles are applied

## Performance Testing

### Load Testing

Test with multiple concurrent users:
1. Use tools like Apache Bench or Artillery
2. Test booking multiple tickets simultaneously
3. Verify seat availability is managed correctly

### Database Performance

1. Add more train data (100+ trains)
2. Test search performance
3. Add indexes if needed:
   ```javascript
   trainSchema.index({ source: 1, destination: 1 });
   ```

## Security Testing

- [ ] Passwords are hashed (check in MongoDB)
- [ ] JWT tokens expire correctly
- [ ] Protected routes reject invalid tokens
- [ ] SQL/NoSQL injection is prevented (Mongoose handles this)
- [ ] XSS protection (React handles this)
- [ ] CORS is configured properly

## Next Steps

After successful testing:
1. Deploy to production environment
2. Set up monitoring and logging
3. Configure production database
4. Enable HTTPS
5. Add rate limiting
6. Set up automated tests
7. Configure CI/CD pipeline

## Support

For issues or questions:
- Check the main README.md
- Review API documentation
- Check console logs for errors
- Verify environment variables are set correctly
