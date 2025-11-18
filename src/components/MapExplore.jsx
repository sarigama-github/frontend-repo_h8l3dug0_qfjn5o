import { useEffect, useMemo, useState } from 'react'

// Very lightweight map placeholder using browser geolocation and list + simple dots grid
// In a real app we'd use a proper map provider. For MVP we display nearby events and rough positions.

export default function MapExplore() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [coords, setCoords] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = new URL(baseUrl + '/api/events')
        if (query) url.searchParams.set('q', query)
        if (category) url.searchParams.set('category', category)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setEvents(data)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [baseUrl, query, category])

  const categories = ['','Culture & Arts','Active & Outdoors','Food & Drink','Music & Nightlife','Workshops & Learning']

  const withDistance = useMemo(() => {
    if (!coords) return events
    const R = 6371
    const dist = (a, b) => {
      const dLat = (b.lat - a.lat) * Math.PI/180
      const dLng = (b.lng - a.lng) * Math.PI/180
      const lat1 = a.lat * Math.PI/180
      const lat2 = b.lat * Math.PI/180
      const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2
      return 2*R*Math.asin(Math.sqrt(x))
    }
    return events.map(e => ({...e, distance: dist(coords, {lat: e.location?.lat, lng: e.location?.lng})})).sort((a,b)=> (a.distance||0)-(b.distance||0))
  }, [coords, events])

  return (
    <section id="explore" className="py-12 md:py-16 bg-[#F2E7DF] text-slate-900">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A2342]">Explore nearby</h2>
            <p className="text-slate-700 mt-1">See what's happening around you across Portugal.</p>
          </div>
          <div className="flex gap-2">
            <input className="bg-white border border-slate-300 rounded px-3 py-2" placeholder="Search events" value={query} onChange={e=>setQuery(e.target.value)} />
            <select className="bg-white border border-slate-300 rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}>
              {categories.map(c=> <option key={c} value={c}>{c||'All categories'}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative h-[380px] rounded-xl bg-gradient-to-br from-[#0A2342] to-[#CE5A20] p-1">
              <div className="absolute inset-0 pointer-events-none rounded-xl" />
              <div className="h-full w-full rounded-[10px] bg-white p-4 overflow-hidden">
                {/* Simple dot map visualization */}
                <div className="relative h-full w-full bg-[radial-gradient(circle_at_20%_30%,#FBE7DE,transparent_40%),radial-gradient(circle_at_80%_70%,#E7EEF9,transparent_35%)] rounded-lg">
                  {withDistance.slice(0,50).map((e, idx) => {
                    const x = (e.location?.lng ?? 0) % 1
                    const y = (e.location?.lat ?? 0) % 1
                    const left = Math.abs(x) * 100
                    const top = Math.abs(y) * 100
                    return (
                      <div key={e._id || idx} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
                        <div className="w-3 h-3 bg-[#CE5A20] rounded-full shadow" title={e.title}></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {loading && <p>Loading events…</p>}
            {error && <p className="text-red-600">{String(error)}</p>}
            {!loading && !error && withDistance.slice(0,12).map((e)=> (
              <article key={e._id} className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="text-xs text-slate-500">{new Date(e.start_time).toLocaleString()} • {e.category}</div>
                <h3 className="font-semibold text-[#0A2342]">{e.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{e.description}</p>
                <div className="text-xs text-slate-500 mt-1">{e.location?.city || e.location?.name}</div>
                {typeof e.distance === 'number' && <div className="text-xs text-slate-700">~{e.distance.toFixed(1)} km away</div>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
