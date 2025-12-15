# Railway Ticket Management System

A full-stack MERN (MongoDB, Express, React, Node.js) railway ticket booking system with monorepo architecture.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **React Router** - Routing
- **Axios** - HTTP client

## 📁 Project Structure

```
railway-ticket-management-system/
├── packages/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── context/
│   │   │   ├── utils/
│   │   │   └── styles/
│   │   └── package.json
│   ├── server/          # Express backend
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── package.json
│   └── shared/          # Shared utilities
└── package.json
```

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd railway-ticket-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in `packages/server/`:
   ```bash
   cp packages/server/.env.example packages/server/.env
   ```
   
   Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/railway-ticket-system
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For Linux/Mac
   sudo systemctl start mongod
   
   # For Windows
   net start MongoDB
   ```

5. **Run the application**
   
   Development mode (runs both client and server):
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Features

### User Features
- **User Authentication**: Register and login with JWT-based authentication
- **Search Trains**: Search trains by source and destination stations
- **Book Tickets**: Book train tickets with passenger details
- **View Tickets**: View all booked tickets
- **Cancel Tickets**: Cancel booked tickets
- **Ticket Details**: View detailed ticket information with PNR

### Admin Features (Future Enhancement)
- Manage trains (add, update, delete)
- View all bookings
- Generate reports

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Trains
- `GET /api/trains` - Get all trains (with optional filters)
- `GET /api/trains/:id` - Get single train
- `POST /api/trains` - Create train (Admin)
- `PUT /api/trains/:id` - Update train (Admin)
- `DELETE /api/trains/:id` - Delete train (Admin)

### Tickets
- `GET /api/tickets` - Get user tickets (Protected)
- `POST /api/tickets` - Book ticket (Protected)
- `GET /api/tickets/:id` - Get single ticket (Protected)
- `PUT /api/tickets/:id/cancel` - Cancel ticket (Protected)
- `GET /api/tickets/all` - Get all tickets (Admin)

## 🗄️ Database Schema

### User Model
- name, email, password, role, phone, createdAt

### Train Model
- trainNumber, trainName, source, destination
- departureTime, arrivalTime
- classes (array): type, availableSeats, totalSeats, price
- days, active, createdAt

### Ticket Model
- user (ref), train (ref), pnr
- passengerName, passengerAge, passengerGender
- classType, seatNumber
- bookingDate, journeyDate
- source, destination, price, status

## 🎨 UI Components

- **Navbar** - Navigation with authentication state
- **TrainCard** - Train information display
- **PrivateRoute** - Protected route wrapper
- **Home** - Landing page
- **Login/Register** - Authentication pages
- **SearchTrains** - Train search interface
- **BookTicket** - Ticket booking form
- **MyTickets** - User's ticket list
- **TicketDetails** - Detailed ticket view

## 🚦 Available Scripts

```bash
# Install all dependencies
npm run install:all

# Run both client and server
npm run dev

# Run only server
npm run server

# Run only client
npm run client

# Build all packages
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Token sent with API requests via Authorization header
5. Server validates token for protected routes

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation
- CORS enabled
- Environment variables for sensitive data

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🔮 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Train schedule management
- [ ] Seat selection UI
- [ ] Admin dashboard
- [ ] Real-time seat availability
- [ ] Booking history reports
- [ ] Multiple payment options
- [ ] PDF ticket generation
- [ ] SMS notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- MERN Stack
- Tailwind CSS
- Lucide Icons