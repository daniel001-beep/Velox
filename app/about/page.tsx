import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] py-12 md:py-24">
    <div className="container max-w-7xl mx-auto space-y-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Hey There, We're <span className="text-blue-500">RedStore</span>
          </h1>
          <p className="text-lg text-gray-300">
            Basically, we're just a bunch of fitness fanatics who got tired of overpriced workout gear. So we decided to make our own - and share it with everyone who loves breaking a sweat without breaking the bank.
          </p>
          <p className="text-lg text-gray-300">
            We're not about fancy marketing or celebrity endorsements. We're about real people, real workouts, and clothes that can actually keep up with you. Whether you're hitting the gym, going for a run, or just lounging in comfort, we've got you covered.
          </p>
          <div className="pt-4">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Check Out Our Stuff <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Fitness Team"
            className="w-full rounded-2xl shadow-2xl object-cover h-[400px] hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="text-center space-y-12">
        <h2 className="text-3xl font-bold text-white relative inline-block">
          What We're About
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-tshirt text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Comfy Clothes</h3>
            <p className="text-gray-400">
              We make gear that feels as good as it looks. No scratchy fabrics or weird fits - just clothes you'll actually want to wear.
            </p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-wallet text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Fair Prices</h3>
            <p className="text-gray-400">
              Quality workout gear shouldn't cost a fortune. We keep our prices reasonable because we believe everyone deserves good gear.
            </p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-600/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Real Community</h3>
            <p className="text-gray-400">
              We're building a space where fitness lovers can connect, share tips, and support each other's journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 pb-16">
        <div className="md:w-1/2 w-full">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Workout Gear"
            className="w-full rounded-2xl shadow-2xl object-cover h-[400px] hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Gear Speaks for Itself</h2>
          <p className="text-lg text-gray-300">
            We test every product ourselves - because if we wouldn't wear it during our own workouts, why would we expect you to? From intense gym sessions to casual weekend wear, our clothes are designed to perform when you need them to.
          </p>
          <div className="pt-4">
            <Link href="/contact" className="btn-secondary inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition">
              Say Hello <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
