import React from 'react';

const ItineraryDisplay = ({ trip }) => {
    if (!trip) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-blue-800">Trip to {trip.destination}</h2>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <p className="text-gray-600">Duration: <span className="font-semibold">{trip.total_days} days</span></p>
                <p className="text-gray-600">Total Budget: <span className="font-semibold">${trip.total_budget}</span></p>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 border-b-2 border-blue-500 inline-block">Cost Breakdown</h3>
                <ul className="list-disc pl-5 bg-gray-50 p-4 rounded-lg">
                    {Object.entries(trip.cost_breakdown).map(([category, amount]) => (
                        <li key={category} className="text-gray-700 flex justify-between">
                            <span className="capitalize">{category}</span>
                            <span className="font-bold">${amount}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4 text-center">Day-by-Day Itinerary</h3>
                {trip.itinerary.map((day) => (
                    <div key={day.day} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-blue-500 text-white p-3 font-bold">
                            Day {day.day}
                        </div>
                        <div className="p-4">
                            <ul className="list-disc pl-5 space-y-2 mb-3">
                                {day.activities.map((activity, index) => (
                                    <li key={index} className="text-gray-700">{activity}</li>
                                ))}
                            </ul>
                            <p className="text-right text-sm text-gray-500 font-semibold">
                                Est. Cost: ${day.estimated_cost}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItineraryDisplay;
