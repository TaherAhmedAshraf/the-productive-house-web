export default function Hero() {
  return (
    <section className="relative bg-[#efe1d9] py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1d2a48] mb-6 leading-tight">
            Transform Your Productivity
          </h1>
          <p className="text-lg lg:text-xl text-[#696969] mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our range of beautifully designed planners and productivity tools
            to help you achieve your goals and stay organized.
          </p>
          <button className="bg-[#1d2a48] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#56cfe1] transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
