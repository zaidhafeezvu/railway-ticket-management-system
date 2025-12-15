import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket as TicketIcon } from 'lucide-react';
import api from '../utils/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No tickets booked yet</p>
            <Link
              to="/search"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search Trains
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/ticket/${ticket._id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {ticket.train?.trainName || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ticket.train?.trainNumber || 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === 'booked'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {ticket.source} → {ticket.destination}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {new Date(ticket.journeyDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <TicketIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">PNR: {ticket.pnr}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {ticket.passengerName} • {ticket.classType.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-blue-600">₹{ticket.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
