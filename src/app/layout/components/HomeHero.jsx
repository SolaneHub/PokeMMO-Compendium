function HomeHero() {
  return (
    <section className="relative w-full flex-shrink-0 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1e2025] to-[#15161a] p-8 shadow-2xl md:p-12">
      <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative z-10">
        <h1 className="mb-4 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Welcome, Trainer.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
          The ultimate companion for your PokéMMO journey. Master the Elite
          Four, breed competitive Pokémon, and conquer late-game content with
          data-driven strategies.
        </p>
      </div>
    </section>
  );
}

export default HomeHero;
