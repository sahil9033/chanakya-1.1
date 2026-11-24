'use client'

import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import SignInGate from '../components/SignInGate'
import { Chakra, IconArrowRight, IconBolt } from '../components/Icons'
import { findCities, type City } from '../../lib/astrology/cities'

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
}

// North Indian layout: house number at each grid cell. Center 2x2 is empty.
const GRID_HOUSES = [
  [12, 1, 2, 3],
  [11, 0, 0, 4],
  [10, 0, 0, 5],
  [9, 8, 7, 6],
]

interface PlanetRow {
  key: string; name: string; rashi: string; rashiNumber: number;
  degreeInRashi: number; nakshatra: string; pada: number; house: number;
  houseLord: string; dignity: string; retrograde: boolean; combust: boolean;
}
interface ChartPayload {
  lagna: { rashi: string; rashiDevanagari: string; rashiNumber: number; degreeInRashi: number; longitude: number }
  planets: PlanetRow[]
  houses: Array<{ number: number; rashiNumber: number; rashi: string; lord: string; planets: string[] }>
  nakshatra: { name: string; devanagari: string; number: number; pada: number; lord: string }
  aspects: Array<{ from: string; to: string; type: string; houses: number }>
  dashas: {
    mahadashas: Array<{ lord: string; start: string; end: string }>
    current: {
      mahadasha: string; antardasha: string; mahadashaStart: string; mahadashaEnd: string;
      antardashaStart: string; antardashaEnd: string; remainingMahadashaYears: number;
    } | null
    upcoming: Array<{ mahadasha: string; antardasha: string; start: string; end: string }>
  }
  transits: {
    current: Array<{ planet: string; rashi: string; rashiNumber: number; degreeInRashi: number; retrograde: boolean }>
    houses: Array<{ planet: string; rashi: string; house: number }>
  }
  yogas: Array<{ name: string; description: string; strength: string }>
  ayanamsa: number
  birthDetails: { place: string; dateOfBirth: string; timeOfBirth: string }
}

function degreeString(d: number) {
  const deg = Math.floor(d)
  const min = Math.floor((d - deg) * 60)
  return `${deg}° ${min.toString().padStart(2, '0')}'`
}

function KundaliChart({ chart }: { chart: ChartPayload }) {
  const rashiByHouse = new Map(chart.houses.map((h) => [h.number, h.rashiNumber]))
  const planetsByHouse = new Map(chart.houses.map((h) => [h.number, h.planets]))

  return (
    <div className="grid grid-cols-4 gap-0 rounded-2xl border border-amber-400/30 bg-black/40 p-0.5 shadow-[0_0_40px_-12px_rgba(212,175,55,0.4)]">
      {GRID_HOUSES.flatMap((row, ri) =>
        row.map((house, ci) => {
          const isCenter = house === 0
          const isLagna = house === 1
          const rashiNum = rashiByHouse.get(house) ?? 0
          const planets = planetsByHouse.get(house) ?? []
          return (
            <div
              key={`${ri}-${ci}`}
              className={`relative flex min-h-[72px] flex-col items-center justify-center border border-amber-400/20 p-1.5 text-center sm:min-h-[88px] ${
                isCenter ? 'col-span-2 row-span-2 bg-black/20' : isLagna ? 'bg-amber-400/10' : 'bg-white/[0.02]'
              }`}
              style={isCenter ? { gridColumn: 'span 2', gridRow: 'span 2' } : undefined}
            >
              {isCenter ? (
                <div className="flex flex-col items-center gap-1 text-amber-300/70">
                  <Chakra width={28} height={28} className="animate-spin-slow" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">D1 Rashi</span>
                </div>
              ) : (
                <>
                  <span className={`text-[10px] font-semibold ${isLagna ? 'text-amber-300' : 'text-amber-200/60'}`}>
                    {rashiNum} {isLagna && '· L'}
                  </span>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
                    {planets.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-100"
                        title={p}
                      >
                        {PLANET_ABBR[p] ?? p}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function FormattedInterpretation({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-2.5 text-[14px] leading-relaxed text-slate-200">
      {lines.map((line, i) => {
        const t = line.trim()
        if (!t) return <div key={i} className="h-1" />
        if (/^#{1,3}\s/.test(t)) {
          const level = t.match(/^#+/)![0].length
          return (
            <h3
              key={i}
              className={`mt-4 font-semibold text-amber-200 ${level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'}`}
            >
              {t.replace(/^#+\s/, '')}
            </h3>
          )
        }
        if (/^[-*]\s+/.test(t)) {
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
              <span>{t.replace(/^[-*]\s+/, '')}</span>
            </div>
          )
        }
        if (/^\d+\.\s+/.test(t)) {
          const m = t.match(/^(\d+)\.\s+(.*)/)!
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-amber-300">{m[1]}.</span>
              <span>{m[2]}</span>
            </div>
          )
        }
        if (/^\*\*/.test(t) || t.toLowerCase().startsWith('why')) {
          return (
            <p key={i} className="rounded-lg border border-amber-400/15 bg-amber-400/5 px-3 py-2 text-[13px] text-amber-100/80">
              {t}
            </p>
          )
        }
        return <p key={i}>{t}</p>
      })}
    </div>
  )
}

export default function KundaliPage() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [place, setPlace] = useState('')
  const [lat, setLat] = useState<string>('')
  const [lon, setLon] = useState<string>('')
  const [timezone] = useState('Asia/Kolkata')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [showCities, setShowCities] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chart, setChart] = useState<ChartPayload | null>(null)
  const [interpretation, setInterpretation] = useState('')
  const [nimError, setNimError] = useState<string | null>(null)

  const placeQuery = place.split(',')[0]
  const canGenerate = useMemo(
    () => !!date && !!time && !!place && lat !== '' && lon !== '',
    [date, time, place, lat, lon]
  )

  function onPlaceChange(v: string) {
    setPlace(v)
    setCityResults(findCities(v))
    setShowCities(true)
  }

  function selectCity(c: City) {
    setPlace(`${c.name}, ${c.state}, India`)
    setLat(c.latitude.toString())
    setLon(c.longitude.toString())
    setShowCities(false)
  }

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    setNimError(null)
    setChart(null)
    setInterpretation('')
    try {
      const res = await fetch('/api/astrology/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOfBirth: date,
          timeOfBirth: time,
          place,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          timezone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to generate chart')
        return
      }
      setChart(data.chart)
      setInterpretation(data.interpretation || '')
      if (data.nimError) setNimError(data.nimError)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#07080d] text-slate-100">
      {/* cosmic backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(900px 500px at 15% -10%, rgba(212,175,55,0.10), transparent 60%), radial-gradient(800px 600px at 110% 10%, rgba(120,119,198,0.12), transparent 60%), radial-gradient(700px 500px at 50% 120%, rgba(212,175,55,0.06), transparent 60%)',
        }}
      />
      <div className="relative flex flex-1 flex-col">
        <Navbar />

        <SignInGate>
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-amber-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Sidereal · Lahiri Ayanamsa
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-amber-50 sm:text-5xl">
              Kundali <span className="text-amber-300">AI</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Deterministic Vedic calculations from your exact birth time and place — then interpreted
              with traditional reasoning. No invention, no memory-based positions.
            </p>
          </div>

          {/* Birth form */}
          {!chart && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of birth">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/50"
                  />
                </Field>
                <Field label="Exact birth time">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/50"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Birth place (search Indian city)">
                    <div className="relative">
                      <input
                        type="text"
                        value={place}
                        onChange={(e) => onPlaceChange(e.target.value)}
                        onFocus={() => setShowCities(true)}
                        placeholder="e.g. Shirala, Mumbai, Bengaluru…"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/50"
                      />
                      {showCities && cityResults.length > 0 && (
                        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-[#0e1018] py-1 shadow-2xl">
                          {cityResults.map((c) => (
                            <button
                              key={`${c.name}-${c.state}`}
                              type="button"
                              onClick={() => selectCity(c)}
                              className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-slate-200 transition hover:bg-amber-400/10"
                            >
                              <span>{c.name}</span>
                              <span className="text-xs text-slate-500">{c.state}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                <Field label="Latitude">
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="17.03"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/50"
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    type="number"
                    step="any"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="74.20"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/50"
                  />
                </Field>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Timezone: <span className="text-slate-300">{timezone}</span> · Coordinates fill
                automatically when you pick a city; edit them if needed.
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={generate}
                disabled={!canGenerate || loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Calculating chart…
                  </>
                ) : (
                  <>
                    <IconBolt width={16} height={16} />
                    Generate Kundali
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {chart && (
            <div className="space-y-6">
              <button
                onClick={() => { setChart(null); setInterpretation('') }}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-amber-200"
              >
                <IconArrowRight width={14} height={14} className="rotate-180" />
                New chart
              </button>

              {/* Ascendant + key facts */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <Label>Ascendant (Lagna)</Label>
                  <div className="mt-2">
                    <div className="font-serif text-3xl text-amber-200">{chart.lagna.rashi}</div>
                    <div className="mt-1 text-xs text-slate-400">{chart.lagna.rashiDevanagari} · {degreeString(chart.lagna.degreeInRashi)}</div>
                  </div>
                </Card>
                <Card>
                  <Label>Moon Nakshatra</Label>
                  <div className="mt-2 font-serif text-2xl text-amber-200">{chart.nakshatra.name}</div>
                  <div className="mt-1 text-xs text-slate-400">Pada {chart.nakshatra.pada} · Lord {chart.nakshatra.lord}</div>
                </Card>
                <Card>
                  {chart.dashas.current ? (
                    <>
                      <Label>Current Dasha</Label>
                      <div className="mt-2">
                        <div className="font-serif text-2xl text-amber-200">{chart.dashas.current.mahadasha}</div>
                        <div className="text-xs text-slate-400">Antardasha: {chart.dashas.current.antardasha}</div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {chart.dashas.current.remainingMahadashaYears.toFixed(1)} yrs of Mahadasha remain
                        </div>
                      </div>
                    </>
                  ) : (
                    <><Label>Current Dasha</Label><div className="mt-2 text-sm text-slate-400">Beyond 120-year Vimshottari cycle</div></>
                  )}
                </Card>
              </div>

              {/* Chart grid + planetary table */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <Label>Birth Chart (D1 · North Indian)</Label>
                  <div className="mt-2">
                    <KundaliChart chart={chart} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
                    {Object.entries(PLANET_ABBR).map(([k, v]) => (
                      <span key={k}>{v} = {k}</span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <Label>Planetary Positions</Label>
                  <div className="mt-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-500">
                        <tr className="border-b border-white/10">
                          <th className="px-3 py-2 font-medium">Planet</th>
                          <th className="px-3 py-2 font-medium">Rashi</th>
                          <th className="px-3 py-2 font-medium">Degree</th>
                          <th className="px-3 py-2 font-medium">Nakshatra</th>
                          <th className="px-3 py-2 font-medium">House</th>
                          <th className="px-3 py-2 font-medium">Dignity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.planets.map((p) => (
                          <tr key={p.key} className="border-b border-white/5 last:border-0">
                            <td className="px-3 py-2 font-medium text-amber-100">
                              {p.key}{p.retrograde && <span className="ml-1 text-rose-300">℞</span>}{p.combust && <span className="ml-1 text-amber-400">☼</span>}
                            </td>
                            <td className="px-3 py-2 text-slate-300">{p.rashi}</td>
                            <td className="px-3 py-2 font-mono text-slate-300">{degreeString(p.degreeInRashi)}</td>
                            <td className="px-3 py-2 text-slate-300">{p.nakshatra} P{p.pada}</td>
                            <td className="px-3 py-2 text-slate-300">{p.house}</td>
                            <td className="px-3 py-2">
                              <span className={`rounded px-1.5 py-0.5 text-[10px] ${dignityClass(p.dignity)}`}>{p.dignity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Yogas + Transits */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <Label>Yogas Formed</Label>
                  <div className="mt-3 space-y-2.5">
                    {chart.yogas.length === 0 && <p className="text-sm text-slate-500">No major yogas detected in this chart.</p>}
                    {chart.yogas.map((y) => (
                      <div key={y.name} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-amber-200">{y.name}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] ${strengthClass(y.strength)}`}>{y.strength}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{y.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <Label>Slow Transits Now</Label>
                  <div className="mt-3 space-y-2">
                    {chart.transits.houses.map((t) => (
                      <div key={t.planet} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm">
                        <span className="text-amber-100">{t.planet}</span>
                        <span className="text-slate-300">{t.rashi} <span className="text-slate-500">· House {t.house}</span></span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Dasha timeline */}
              <Card>
                <Label>Upcoming Dasha Timeline</Label>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-500">
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-2 font-medium">Mahadasha</th>
                        <th className="px-3 py-2 font-medium">Antardasha</th>
                        <th className="px-3 py-2 font-medium">Start</th>
                        <th className="px-3 py-2 font-medium">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.dashas.upcoming.slice(0, 12).map((d, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="px-3 py-2 font-medium text-amber-200">{d.mahadasha}</td>
                          <td className="px-3 py-2 text-slate-300">{d.antardasha}</td>
                          <td className="px-3 py-2 font-mono text-slate-400">{d.start.slice(0, 10)}</td>
                          <td className="px-3 py-2 font-mono text-slate-400">{d.end.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* AI Interpretation */}
              <Card>
                <div className="flex items-center justify-between">
                  <Label>AI Interpretation · {chart.birthDetails.place}</Label>
                  <span className="text-[11px] text-slate-500">Ayanamsa {chart.ayanamsa.toFixed(2)}° · Lahiri</span>
                </div>
                {nimError && (
                  <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                    AI interpretation unavailable ({nimError}). The calculated chart above is still valid.
                  </p>
                )}
                <div className="mt-4">
                  {interpretation ? (
                    <FormattedInterpretation text={interpretation} />
                  ) : !nimError ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-300" />
                      Consulting the treatises…
                    </div>
                  ) : null}
                </div>
                <p className="mt-5 border-t border-white/10 pt-3 text-[11px] text-slate-500">
                  Traditional astrological interpretation — not medical, financial, or legal advice.
                  Predictions are tendencies based on the calculated chart, not guarantees.
                </p>
              </Card>
            </div>
          )}
        </main>
        </SignInGate>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300/80">{children}</div>
}

function dignityClass(d: string) {
  switch (d) {
    case 'Exalted': return 'bg-emerald-500/15 text-emerald-300'
    case 'Own sign': return 'bg-amber-400/15 text-amber-200'
    case 'Debilitated': return 'bg-rose-500/15 text-rose-300'
    default: return 'bg-white/5 text-slate-400'
  }
}

function strengthClass(s: string) {
  switch (s) {
    case 'Strong': return 'bg-emerald-500/15 text-emerald-300'
    case 'Moderate': return 'bg-amber-400/15 text-amber-200'
    default: return 'bg-white/5 text-slate-400'
  }
}
