import React, { useState } from 'react';
import axios from 'axios';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Loading from './components/Loading';

function App() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTrip = async (tripData) => {
    setLoading(true);
    setError(null);
    setTrip(null);
    try {
      // Using localhost:8000 as per FastAPI default. In production this would be env var.
      // Vite proxy can also be used, but absolute URL for simplicity here.
      const response = await axios.post('http://localhost:8000/generate-trip', tripData);
      setTrip(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate itinerary. Please try again. ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">AI Travel Planner</h1>
        <p className="text-gray-600 mt-2 text-lg">Your budget-friendly intelligent travel companion</p>
      </header>

      <main className="container mx-auto">
        {!trip && !loading && (
          <TripForm onSubmit={handleCreateTrip} isLoading={loading} />
        )}

        {loading && <Loading />}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="mt-2 text-sm underline"
              onClick={() => setError(null)}
            >
              Try Again
            </button>
          </div>
        )}

        {trip && !loading && (
          <>
            <ItineraryDisplay trip={trip} />
            <div className="text-center mt-8">
              <button
                onClick={() => setTrip(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Plan Another Trip
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
