import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, Compass, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop", alt: "Swiss Alps" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop", alt: "Tropical Paradise" },
  { url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop", alt: "Alpine Lakes" },
  { url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop", alt: "Cinque Terre" },
  { url: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop", alt: "Thailand Temples" },
  { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop", alt: "Lisbon Streets" },
  { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", alt: "Rice Terraces" },
  { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop", alt: "Parisian Dreams" },
  { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop", alt: "Kyoto Gardens" }, // Replaced Rome with Kyoto for variety
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop", alt: "Island Getaway" }
];

function App() {
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: '',
    travelStyle: '',
  });

  // State for API interaction
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Slideshow state
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Planning trip:', formData);
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      // Use environment variable or fallback to local
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/generate-trip';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          days: parseInt(formData.days),
          budget: parseInt(formData.budget),
          travel_style: formData.travelStyle, // Note: Backend expects travel_style (snake_case)
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data);
    } catch (err: any) {
      console.error("Error fetching itinerary:", err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text(`Trip to ${itinerary.destination}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Details logic
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Duration: ${itinerary.total_days} Days`, 20, yPos);
    doc.text(`Total Budget: $${itinerary.total_budget}`, pageWidth - 20, yPos, { align: 'right' });
    yPos += 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;

    // Itinerary
    itinerary.itinerary?.forEach((day: any) => {
      // Check for page break
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day}`, 20, yPos);
      yPos += 7;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);

      day.activities?.forEach((activity: string) => {
        doc.text(`• ${activity}`, 25, yPos);
        yPos += 6;
      });

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(5, 150, 105); // Emerald color
      doc.text(`Est. Cost: $${day.estimated_cost}`, 25, yPos);
      yPos += 15;
    });

    doc.save(`Trip_Plan_${itinerary.destination.replace(/\s+/g, '_')}.pdf`);
  };

  const travelStyles = [
    { id: 'luxury', label: 'Luxury', emoji: '✨' },
    { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
    { id: 'relaxation', label: 'Relaxation', emoji: '🌴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TravelAI
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-4">
              {/* Interactive Hero Slideshow */}
              <div className="relative w-full max-w-2xl mx-auto mb-8 group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
                  {HERO_IMAGES.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover transform transition-transform duration-[10000ms] scale-100 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white text-left transform transition-all duration-700 delay-300">
                        <p className="text-lg font-medium tracking-wide text-indigo-400 mb-1">Discover</p>
                        <h3 className="text-3xl font-bold leading-tight">{img.alt}</h3>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {HERO_IMAGES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImage
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/80'
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-indigo-100/50 shadow-sm mb-4">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">AI-Powered Travel Planning</span>
              </div>

              <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Your next adventure,
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  intelligently planned
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                Tell us where you want to go, and our AI will craft a personalized itinerary tailored to your preferences
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/5 border border-white/50 p-8 transition-all duration-500 hover:shadow-3xl hover:shadow-slate-900/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div className="group">
                  <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-2 transition-colors">
                    Where to?
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'destination' ? 'text-indigo-600' : 'text-slate-400'
                      }`} />
                    <input
                      type="text"
                      id="destination"
                      placeholder="Tokyo, Paris, New York..."
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      onFocus={() => setFocusedField('destination')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-slate-200/80 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Days and Budget Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Number of Days */}
                  <div className="group">
                    <label htmlFor="days" className="block text-sm font-medium text-slate-700 mb-2">
                      Duration
                    </label>
                    <div className="relative">
                      <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'days' ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                      <input
                        type="number"
                        id="days"
                        placeholder="7"
                        min="1"
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        onFocus={() => setFocusedField('days')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-slate-200/80 rounded-2xl focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="group">
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                      Budget
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'budget' ? 'text-teal-600' : 'text-slate-400'
                        }`} />
                      <input
                        type="number"
                        id="budget"
                        placeholder="2500"
                        min="0"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        onFocus={() => setFocusedField('budget')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-slate-200/80 rounded-2xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Travel Style */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Travel Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelStyle: style.id })}
                        className={`px-5 py-4 rounded-xl font-medium transition-all duration-200 ${formData.travelStyle === style.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                          : 'bg-white/80 text-slate-700 border-2 border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:scale-[1.01] active:scale-100'
                          }`}
                      >
                        <span className="mr-2">{style.emoji}</span>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 px-8 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      Plan My Perfect Trip
                      <Sparkles className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-slate-200/50 flex items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse delay-300"></div>
                  <span>Personalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-700"></div>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {itinerary && (
              <div className="mt-12 space-y-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Your {itinerary.destination} Itinerary</h2>

                {itinerary.image_url && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 aspect-video relative group">
                    <img
                      src={itinerary.image_url}
                      alt={itinerary.destination}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-lg font-medium opacity-90">Exploring</p>
                      <h3 className="text-3xl font-bold">{itinerary.destination}</h3>
                    </div>
                  </div>
                )}

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-indigo-100 gap-4">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Total Cost</p>
                      <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">${itinerary.total_budget}</p>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>

                    <div className="text-center md:text-right">
                      <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Duration</p>
                      <p className="text-2xl font-bold text-slate-800">{itinerary.total_days} Days</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {itinerary.itinerary?.map((day: any, idx: number) => (
                      <div key={idx} className="relative pl-8 border-l-2 border-indigo-200 hover:border-indigo-400 transition-colors">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-400"></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Day {day.day}</h3>
                        <ul className="space-y-2">
                          {day.activities?.map((activity: string, actIdx: number) => (
                            <li key={actIdx} className="text-slate-600 flex items-start gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm font-medium text-emerald-600">Est. Cost: ${day.estimated_cost}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Powered by advanced AI to create experiences as unique as you are
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
