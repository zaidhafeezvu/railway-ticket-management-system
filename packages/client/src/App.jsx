import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrains from './pages/SearchTrains';
import BookTicket from './pages/BookTicket';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchTrains />} />
            <Route
              path="/book/:trainId"
              element={
                <PrivateRoute>
                  <BookTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <MyTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket/:ticketId"
              element={
                <PrivateRoute>
                  <TicketDetails />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
