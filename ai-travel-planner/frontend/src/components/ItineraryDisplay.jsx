import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Clock, Lightbulb, ArrowRight } from 'lucide-react';

const ItineraryDisplay = ({ trip }) => {
    if (!trip) return null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    Your Trip to {trip.destination}
                </h2>
                <p className="text-gray-500">AI-generated itinerary tailored just for you</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Itinerary Section */}
                <div className="lg:col-span-2 space-y-6">
                    {trip.itinerary && trip.itinerary.map((day, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-white/50"
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                                    {day.day}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Day {day.day}</h3>
                                    <p className="text-sm text-gray-500">Explore & Discover</p>
                                </div>
                            </div>

                            <div className="space-y-4 ml-2 border-l-2 border-indigo-100 pl-6">
                                {day.activities && day.activities.map((activity, actIndex) => (
                                    <motion.div
                                        key={actIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (index * 0.1) + (actIndex * 0.05) }}
                                        className="relative"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute -left-[31px] top-2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white" />

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="w-4 h-4 text-indigo-500" />
                                                        <span className="text-sm font-medium text-indigo-600">
                                                            {activity.time || 'Flexible Time'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 font-medium">
                                                        {typeof activity === 'string' ? activity : activity.activity}
                                                    </p>
                                                </div>
                                                {activity.cost && (
                                                    <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                                        ${activity.cost}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl shadow-indigo-500/30 p-6 text-white sticky top-8"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Trip Summary
                        </h3>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Destination</p>
                                    <p className="font-semibold">{trip.destination}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Duration</p>
                                    <p className="font-semibold">{trip.days || trip.itinerary?.length} Days</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Estimated Cost</p>
                                    <p className="font-semibold text-xl">${trip.total_estimated_cost || trip.budget || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tips Card */}
                    {trip.tips && trip.tips.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                                Pro Tips
                            </h3>
                            <ul className="space-y-3">
                                {trip.tips.map((tip, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-gray-600">
                                        <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ItineraryDisplay;
