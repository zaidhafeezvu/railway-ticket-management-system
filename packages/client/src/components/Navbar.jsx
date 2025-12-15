import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, User, LogOut, Ticket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Train className="h-6 w-6" />
            <span>Railway Ticket System</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/search" className="hover:text-blue-200 transition">
              Search Trains
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-tickets"
                  className="flex items-center space-x-1 hover:text-blue-200 transition"
                >
                  <Ticket className="h-5 w-5" />
                  <span>My Tickets</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 hover:text-blue-200 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
