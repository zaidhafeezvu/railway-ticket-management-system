# System Architecture

## Overview

The Railway Ticket Management System is built using a monorepo architecture with three main packages:
- **Client**: React-based frontend application
- **Server**: Express.js backend API
- **Shared**: Common utilities and types

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         MONOREPO                             │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │     CLIENT     │  │     SERVER     │  │    SHARED    │  │
│  │   (React +     │  │   (Express +   │  │  (Common     │  │
│  │  Tailwind v4)  │  │    MongoDB)    │  │  Utilities)  │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│         ▲                     ▲                              │
│         │                     │                              │
│         └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
                        ▼
                ┌───────────────┐
                │   MongoDB     │
                │   Database    │
                └───────────────┘
```

## Technology Stack

### Frontend (Client Package)
- **React 18**: UI library for building user interfaces
- **Vite**: Fast build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Context API**: State management

### Backend (Server Package)
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Shared Package
- Common types and constants
- Shared validation logic
- Reusable utilities

## Data Flow

```
┌──────────┐      HTTP Request       ┌──────────┐
│          │ ──────────────────────▶ │          │
│  Client  │                         │  Server  │
│  (React) │ ◀────────────────────── │ (Express)│
│          │      HTTP Response      │          │
└──────────┘                         └────┬─────┘
                                          │
                                          │ Mongoose
                                          │
                                     ┌────▼─────┐
                                     │ MongoDB  │
                                     │ Database │
                                     └──────────┘
```

## Frontend Architecture

```
src/
├── main.jsx              # Application entry point
├── App.jsx               # Root component with routing
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar
│   ├── PrivateRoute.jsx # Protected route wrapper
│   └── TrainCard.jsx    # Train display card
├── pages/                # Page components
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── SearchTrains.jsx # Train search page
│   ├── BookTicket.jsx   # Booking form page
│   ├── MyTickets.jsx    # User's tickets list
│   └── TicketDetails.jsx # Ticket detail view
├── context/              # React Context providers
│   └── AuthContext.jsx  # Authentication context
├── utils/                # Utility functions
│   └── api.js           # Axios instance with interceptors
└── styles/               # Global styles
    └── index.css        # Tailwind CSS imports
```

## Backend Architecture

```
server/
├── server.js            # Application entry point
├── config/              # Configuration files
│   └── db.js           # MongoDB connection
├── models/              # Mongoose models
│   ├── User.js         # User schema
│   ├── Train.js        # Train schema
│   └── Ticket.js       # Ticket schema
├── controllers/         # Request handlers
│   ├── authController.js    # Auth logic
│   ├── trainController.js   # Train logic
│   └── ticketController.js  # Ticket logic
├── routes/              # Express routes
│   ├── auth.js         # Auth endpoints
│   ├── trains.js       # Train endpoints
│   └── tickets.js      # Ticket endpoints
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication
│   └── error.js        # Error handling
└── scripts/             # Utility scripts
    └── seed.js         # Database seeding
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  phone: String,
  createdAt: Date
}
```

### Train Collection
```javascript
{
  _id: ObjectId,
  trainNumber: String (unique),
  trainName: String,
  source: String,
  destination: String,
  departureTime: String,
  arrivalTime: String,
  classes: [{
    type: String (enum: ['sleeper', '3ac', '2ac', '1ac', 'general']),
    availableSeats: Number,
    totalSeats: Number,
    price: Number
  }],
  days: [String],
  active: Boolean,
  createdAt: Date
}
```

### Ticket Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  train: ObjectId (ref: 'Train'),
  pnr: String (unique),
  passengerName: String,
  passengerAge: Number,
  passengerGender: String (enum: ['male', 'female', 'other']),
  classType: String,
  seatNumber: String,
  bookingDate: Date,
  journeyDate: Date,
  source: String,
  destination: String,
  price: Number,
  status: String (enum: ['booked', 'cancelled', 'completed']),
  createdAt: Date
}
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Train Routes
- `GET /api/trains` - Get all trains (with filters)
- `GET /api/trains/:id` - Get single train
- `POST /api/trains` - Create train (Admin)
- `PUT /api/trains/:id` - Update train (Admin)
- `DELETE /api/trains/:id` - Delete train (Admin)

### Ticket Routes
- `GET /api/tickets` - Get user's tickets (Protected)
- `POST /api/tickets` - Book ticket (Protected)
- `GET /api/tickets/:id` - Get single ticket (Protected)
- `PUT /api/tickets/:id/cancel` - Cancel ticket (Protected)
- `GET /api/tickets/all` - Get all tickets (Admin)

## Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token in localStorage
   ↓
5. Client includes token in Authorization header
   ↓
6. Server validates token for protected routes
   ↓
7. Server processes request if valid
```

## State Management

### Client-Side State
- **AuthContext**: User authentication state
  - user: Current user object
  - loading: Authentication loading state
  - login(): Login function
  - register(): Registration function
  - logout(): Logout function

### Server-Side State
- **Database**: Persistent data storage
- **JWT**: Stateless authentication tokens

## Security Measures

1. **Password Security**
   - Passwords hashed with bcryptjs
   - Salt rounds: 10

2. **Authentication**
   - JWT tokens with expiration
   - Token validation middleware
   - Protected routes

3. **Authorization**
   - Role-based access control (user/admin)
   - Route-level permissions

4. **Data Validation**
   - Mongoose schema validation
   - Express validator middleware
   - Client-side form validation

5. **CORS**
   - Configured for cross-origin requests
   - Secure headers

## Performance Optimizations

1. **Frontend**
   - React lazy loading (can be added)
   - Component memoization opportunities
   - Vite's fast build and HMR

2. **Backend**
   - MongoDB indexes on frequently queried fields
   - Efficient query patterns with Mongoose
   - Connection pooling

3. **Database**
   - Indexed fields: email (User), trainNumber (Train), pnr (Ticket)
   - Proper use of populate for references

## Deployment Architecture

```
┌────────────────┐
│   Netlify/     │ ◀── Static React Build
│   Vercel       │
└────────────────┘
        │
        │ API Calls
        ▼
┌────────────────┐
│    Heroku/     │ ◀── Express Server
│    Railway     │
└────────────────┘
        │
        │ MongoDB Connection
        ▼
┌────────────────┐
│  MongoDB       │ ◀── Database
│  Atlas         │
└────────────────┘
```

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design allows multiple server instances
   - Session data stored in JWT, not server memory

2. **Database Scaling**
   - MongoDB Atlas provides automatic scaling
   - Sharding can be implemented for large datasets

3. **Caching**
   - Redis can be added for frequently accessed data
   - Client-side caching with React Query (future enhancement)

4. **Load Balancing**
   - Multiple server instances behind load balancer
   - Database read replicas for read-heavy operations

## Development Workflow

```
Developer
    │
    ├── Edit Code
    │
    ├── Local Testing
    │   ├── Frontend: http://localhost:3000
    │   └── Backend: http://localhost:5000
    │
    ├── Git Commit
    │
    └── Git Push
        │
        ▼
    CI/CD Pipeline (future)
        │
        ├── Run Tests
        ├── Build
        └── Deploy
```

## Monitoring & Logging

### Current
- Console logging in development
- Error middleware captures exceptions

### Future Enhancements
- Winston/Morgan for structured logging
- Sentry for error tracking
- Application performance monitoring (APM)
- Database query monitoring

## Future Enhancements

1. **Features**
   - Payment gateway integration
   - Email/SMS notifications
   - PDF ticket generation
   - Real-time seat updates (WebSocket)
   - Multi-language support

2. **Technical**
   - TypeScript migration
   - Unit and integration tests
   - Docker containerization
   - Kubernetes orchestration
   - GraphQL API option
   - Server-side rendering (Next.js)

3. **Performance**
   - Redis caching layer
   - CDN for static assets
   - Image optimization
   - Code splitting
   - Service workers for PWA

4. **Security**
   - Rate limiting
   - Input sanitization
   - CSRF protection
   - SQL injection prevention
   - XSS protection enhancements
