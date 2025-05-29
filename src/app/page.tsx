import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const homeNavLinks = [
    { href: '/articles', text: 'All Articles' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header navLinks={homeNavLinks} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Find Tattoo Removal Services Near You</h2>
          <p className="text-lg text-gray-600 mb-8">
            Enter your location to discover the best tattoo removal specialists in your area.
          </p>
          
          {/* Location Input Placeholder */}
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Your Location (e.g., City, Zip Code)</label>
            <input 
              type="text" 
              name="location" 
              id="location" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your city or zip code"
            />
            <button 
              type="submit" 
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search Nearby
            </button>
          </div>
        </section>

        {/* Articles Section Placeholder */}
        <section className="py-12">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Learn More About Tattoo Removal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Article Cards - these would be dynamically generated */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Understanding Laser Tattoo Removal</h4>
              <p className="text-gray-600 mb-4">Discover how laser technology safely removes unwanted tattoos.</p>
              <a href="/articles/understanding-laser-tattoo-removal" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Aftercare Tips for Best Results</h4>
              <p className="text-gray-600 mb-4">Proper aftercare is crucial for healing and achieving optimal results.</p>
              <a href="/articles/aftercare-tips" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Choosing the Right Clinic</h4>
              <p className="text-gray-600 mb-4">What to look for when selecting a tattoo removal specialist.</p>
              <a href="/articles/choosing-a-clinic" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/articles" className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 font-medium">
              View All Articles
            </a>
          </div>
        </section>
      </main>

      <Footer showDisclaimer={true} />
    </div>
  );
}
