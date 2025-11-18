import { useState } from 'react'

const categories = [
  'Culture & Arts',
  'Active & Outdoors',
  'Food & Drink',
  'Music & Nightlife',
  'Workshops & Learning',
]

export default function PublishEvent() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    start_time: '',
    end_time: '',
    location: { name: '', address: '', city: '', lat: '', lng: '' },
    image_url: '',
    organizer_name: '',
    organizer_email: '',
  })
  const [loading, setLoading] = useState(false)
  const [createdId, setCreatedId] = useState(null)
  const [error, setError] = useState(null)

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1]
      setForm((f) => ({ ...f, location: { ...f.location, [key]: value } }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
        location: {
          ...form.location,
          lat: parseFloat(form.location.lat),
          lng: parseFloat(form.location.lng),
        },
      }
      const res = await fetch(`${baseUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setCreatedId(data._id)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create" className="py-12 md:py-16 bg-[#0A2342] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold">Publish an event</h2>
        <p className="text-slate-300 mt-2">Share your meetup, tasting, workshop, or concert with the community.</p>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
          <select className="bg-white/10 border border-white/10 rounded px-3 py-2" name="category" value={form.category} onChange={onChange}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2 md:col-span-2" name="description" placeholder="Description" value={form.description} onChange={onChange} />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" type="datetime-local" name="start_time" value={form.start_time} onChange={onChange} required />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" type="datetime-local" name="end_time" value={form.end_time} onChange={onChange} />

          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="location.name" placeholder="Venue name" value={form.location.name} onChange={onChange} />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="location.address" placeholder="Address" value={form.location.address} onChange={onChange} />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="location.city" placeholder="City" value={form.location.city} onChange={onChange} />
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="location.lat" placeholder="Latitude" value={form.location.lat} onChange={onChange} required />
            <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="location.lng" placeholder="Longitude" value={form.location.lng} onChange={onChange} required />
          </div>

          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="image_url" placeholder="Image URL" value={form.image_url} onChange={onChange} />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="organizer_name" placeholder="Organizer name" value={form.organizer_name} onChange={onChange} required />
          <input className="bg-white/10 border border-white/10 rounded px-3 py-2" name="organizer_email" placeholder="Organizer email" value={form.organizer_email} onChange={onChange} required />

          <button disabled={loading} className="md:col-span-2 inline-flex justify-center items-center bg-[#CE5A20] hover:opacity-90 rounded px-4 py-2 font-semibold">
            {loading ? 'Publishing…' : 'Publish event'}
          </button>

          {createdId && (
            <p className="md:col-span-2 text-green-300">Event created! ID: {createdId}</p>
          )}
          {error && (
            <p className="md:col-span-2 text-red-300">{error}</p>
          )}
        </form>
      </div>
    </section>
  )
}
