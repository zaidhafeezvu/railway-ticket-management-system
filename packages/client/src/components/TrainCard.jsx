import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrainCard = ({ train }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{train.trainName}</h3>
          <p className="text-gray-600">Train No: {train.trainNumber}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            train.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {train.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{train.source}</span>
          <span>→</span>
          <span className="font-medium">{train.destination}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-700">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>
            {train.departureTime} - {train.arrivalTime}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {train.classes.map((cls, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded">
              <div className="text-sm font-medium text-gray-700">{cls.type.toUpperCase()}</div>
              <div className="text-xs text-gray-600">
                {cls.availableSeats}/{cls.totalSeats} seats
              </div>
              <div className="text-sm font-bold text-blue-600">₹{cls.price}</div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to={`/book/${train._id}`}
        className="mt-4 w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Book Now
      </Link>
    </div>
  );
};

export default TrainCard;
