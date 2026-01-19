import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Generating your itinerary...</p>
        </div>
    );
};

export default Loading;
