import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, Ticket as TicketIcon, Clock, XCircle } from 'lucide-react';
import api from '../utils/api';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      setTicket(response.data.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    setCancelling(true);
    try {
      await api.put(`/tickets/${ticketId}/cancel`);
      fetchTicket(); // Refresh ticket data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel ticket');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Ticket Details</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {ticket.train?.trainName || 'N/A'}
                </h2>
                <p className="text-blue-100">
                  Train No: {ticket.train?.trainNumber || 'N/A'}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  ticket.status === 'booked'
                    ? 'bg-green-500 text-white'
                    : ticket.status === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* PNR */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">PNR Number</p>
              <p className="text-2xl font-bold text-gray-800">{ticket.pnr}</p>
            </div>

            {/* Journey Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Journey Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-semibold text-gray-800">{ticket.source}</p>
                    <p className="text-sm text-gray-600">
                      {ticket.train?.departureTime || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-semibold text-gray-800">{ticket.destination}</p>
                    <p className="text-sm text-gray-600">
                      {ticket.train?.arrivalTime || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">
                  Journey Date: {new Date(ticket.journeyDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Passenger Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {ticket.passengerName}, {ticket.passengerAge} years,{' '}
                    {ticket.passengerGender}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TicketIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Class: {ticket.classType.toUpperCase()} | Seat: {ticket.seatNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Fare Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Fare Details</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Fare</span>
                  <span className="text-2xl font-bold text-blue-600">₹{ticket.price}</span>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                Booked on: {new Date(ticket.bookingDate).toLocaleDateString('en-IN')}
              </span>
            </div>

            {/* Actions */}
            {ticket.status === 'booked' && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelTicket}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:bg-gray-300"
                >
                  <XCircle className="h-5 w-5" />
                  <span>{cancelling ? 'Cancelling...' : 'Cancel Ticket'}</span>
                </button>
              </div>
            )}

            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Back to My Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
