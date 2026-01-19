import React, { useState } from 'react';

const TripForm = ({ onSubmit, isLoading }) => {
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ destination, days: parseInt(days), budget: parseInt(budget) });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Plan Your Trip</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Destination</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., Paris"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Number of Days</label>
                <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., 3"
                    required
                    min="1"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Total Budget ($)</label>
                <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., 1000"
                    required
                    min="1"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Planning...' : 'Generate Itinerary'}
            </button>
        </form>
    );
};

export default TripForm;
