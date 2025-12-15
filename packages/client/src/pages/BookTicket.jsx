import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User as UserIcon, Users } from 'lucide-react';
import api from '../utils/api';

const BookTicket = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerAge: '',
    passengerGender: 'male',
    classType: '',
    journeyDate: '',
  });

  useEffect(() => {
    fetchTrain();
  }, [trainId]);

  const fetchTrain = async () => {
    try {
      const response = await api.get(`/trains/${trainId}`);
      setTrain(response.data.data);
      if (response.data.data.classes.length > 0) {
        setFormData((prev) => ({ ...prev, classType: response.data.data.classes[0].type }));
      }
    } catch (error) {
      console.error('Error fetching train:', error);
      setError('Failed to load train details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(true);

    try {
      const response = await api.post('/tickets', {
        trainId: train._id,
        ...formData,
        source: train.source,
        destination: train.destination,
      });

      navigate(`/ticket/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Train not found</p>
        </div>
      </div>
    );
  }

  const selectedClass = train.classes.find((c) => c.type === formData.classType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Book Ticket</h1>

        {/* Train Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">{train.trainName}</h2>
          <p className="text-gray-600 mb-4">Train No: {train.trainNumber}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="text-lg font-semibold">{train.source}</p>
              <p className="text-sm text-gray-600">{train.departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="text-lg font-semibold">{train.destination}</p>
              <p className="text-sm text-gray-600">{train.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-6">Passenger Details</h3>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-2">
                Passenger Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="passengerName"
                  name="passengerName"
                  type="text"
                  required
                  value={formData.passengerName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter passenger name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="passengerAge" className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  id="passengerAge"
                  name="passengerAge"
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.passengerAge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Age"
                />
              </div>
              <div>
                <label htmlFor="passengerGender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    id="passengerGender"
                    name="passengerGender"
                    value={formData.passengerGender}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="classType" className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                id="classType"
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {train.classes.map((cls) => (
                  <option key={cls.type} value={cls.type}>
                    {cls.type.toUpperCase()} - ₹{cls.price} ({cls.availableSeats} seats available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="journeyDate" className="block text-sm font-medium text-gray-700 mb-2">
                Journey Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="journeyDate"
                  name="journeyDate"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.journeyDate}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {selectedClass && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">Total Fare</p>
                <p className="text-2xl font-bold text-blue-600">₹{selectedClass.price}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={booking || !selectedClass || selectedClass.availableSeats === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
