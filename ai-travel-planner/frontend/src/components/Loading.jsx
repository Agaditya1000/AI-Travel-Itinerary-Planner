import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Loading = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center p-16 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Animated Orb */}
            <div className="relative mb-8">
                <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 rounded-full shadow-2xl shadow-indigo-500/50"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                />
                <motion.div
                    className="absolute inset-0 w-20 h-20 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-xl opacity-50"
                    animate={{
                        scale: [1.2, 1.4, 1.2],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-bold text-gray-800">
                        Creating Your Perfect Trip
                    </h3>
                </div>
                <p className="text-gray-500 max-w-xs">
                    Our AI is finding the best spots, calculating costs, and crafting your personalized itinerary...
                </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Loading;
