import Hero from './components/Hero'
import PublishEvent from './components/PublishEvent'
import MapExplore from './components/MapExplore'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Hero />
      <main>
        <PublishEvent />
        <MapExplore />
      </main>
      <footer className="bg-slate-950 border-t border-white/10 text-slate-300 py-6 text-center">
        <p>
          Built for locals, expats, and curious travelers — blending community and culture across Portugal.
        </p>
      </footer>
    </div>
  )
}

export default App
