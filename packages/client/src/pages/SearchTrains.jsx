import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../utils/api';
import TrainCard from '../components/TrainCard';

const SearchTrains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
  });

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async (source = '', destination = '') => {
    setLoading(true);
    try {
      const params = {};
      if (source) params.source = source;
      if (destination) params.destination = destination;
      
      const response = await api.get('/trains', { params });
      setTrains(response.data.data);
    } catch (error) {
      console.error('Error fetching trains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrains(searchParams.source, searchParams.destination);
  };

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Search Trains</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <input
                id="source"
                name="source"
                type="text"
                value={searchParams.source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Source Station"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={searchParams.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Destination Station"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : trains.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No trains found. Try searching with different stations.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trains.map((train) => (
              <TrainCard key={train._id} train={train} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrains;
