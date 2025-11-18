import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/cEecEwR6Ehj4iT8T/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="backdrop-blur-sm bg-slate-900/30 rounded-2xl p-6 md:p-8 border border-white/10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow">
              Discover Portugal
            </h1>
            <p className="mt-3 md:mt-4 text-slate-200 max-w-2xl">
              Blending local community energy with curated culture. Find authentic events from Lisbon to the Azores.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#create" className="inline-flex items-center justify-center rounded-lg bg-[#CE5A20] text-white px-5 py-3 font-semibold shadow hover:opacity-90 transition">Publish an event</a>
              <a href="#explore" className="inline-flex items-center justify-center rounded-lg bg-[#0A2342] text-white px-5 py-3 font-semibold border border-white/10 hover:bg-white/10 transition">Explore nearby</a>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
    </section>
  )
}
