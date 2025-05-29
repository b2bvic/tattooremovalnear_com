import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const homeNavLinks = [
    { href: '/articles', text: 'All Articles' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <Header navLinks={homeNavLinks} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
            Find Tattoo Removal <span className="text-purple-400">Services Near You</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 mx-auto max-w-2xl">
            Enter your location to discover the best tattoo removal specialists in your area.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto bg-white/10 backdrop-blur rounded-xl shadow-lg p-6 border border-purple-900">
            <input
              type="text"
              name="location"
              id="location"
              className="w-full md:w-72 px-4 py-2 rounded-lg border border-purple-700 bg-[#181622] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your city or zip code"
            />
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition shadow-lg"
            >
              Search Nearby
            </button>
          </form>
        </section>

        {/* Articles Section */}
        <section className="py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white/90">
            Learn More About Tattoo Removal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article Card 1 */}
            <div className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-6 flex flex-col hover:scale-[1.025] hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-purple-200 mb-2">Understanding Laser Tattoo Removal</h3>
              <p className="text-gray-300 mb-4">Discover how laser technology safely removes unwanted tattoos.</p>
              <Link href="/articles/understanding-laser-tattoo-removal" className="text-purple-400 hover:underline font-medium mt-auto">Read More &rarr;</Link>
            </div>
            {/* Article Card 2 */}
            <div className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-6 flex flex-col hover:scale-[1.025] hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-purple-200 mb-2">Aftercare Tips for Best Results</h3>
              <p className="text-gray-300 mb-4">Proper aftercare is crucial for healing and achieving optimal results.</p>
              <Link href="/articles/aftercare-tips-for-best-results" className="text-purple-400 hover:underline font-medium mt-auto">Read More &rarr;</Link>
            </div>
            {/* Article Card 3 */}
            <div className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-6 flex flex-col hover:scale-[1.025] hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-purple-200 mb-2">Choosing the Right Clinic</h3>
              <p className="text-gray-300 mb-4">What to look for when selecting a tattoo removal specialist.</p>
              <Link href="/articles/choosing-a-clinic" className="text-purple-400 hover:underline font-medium mt-auto">Read More &rarr;</Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/articles" className="inline-block px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg transition">
              View All Articles
            </Link>
          </div>
        </section>
      </main>
      <Footer showDisclaimer={true} />
    </div>
  );
}
