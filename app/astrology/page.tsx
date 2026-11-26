'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SignInGate from '../components/SignInGate'
import Reveal from '../components/Reveal'
import {
  Chakra,
  IconArrowRight,
  IconBolt,
  IconBook,
  IconCheck,
  IconCoins,
  IconCompass,
  IconLayers,
  IconLotus,
  IconNetwork,
  IconScale,
  IconShield,
  IconSpark,
  IconSplit,
  IconTarget,
} from '../components/Icons'
import { findCities } from '../../lib/astrology/cities'

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

interface PlaceResult {
  id: string
  name: string
  region: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

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

const placeKey = (p: { name: string; region: string }) =>
  `${p.name}|${p.region}`.toLowerCase()

function localPlaces(query: string): PlaceResult[] {
  return findCities(query).map((c) => ({
    id: `local-${c.name}-${c.state}`,
    name: c.name,
    region: c.state,
    country: 'India',
    latitude: c.latitude,
    longitude: c.longitude,
    timezone: 'Asia/Kolkata',
  }))
}

function KundaliChart({ chart }: { chart: ChartPayload }) {
  const rashiByHouse = new Map(chart.houses.map((h) => [h.number, h.rashiNumber]))
  const planetsByHouse = new Map(chart.houses.map((h) => [h.number, h.planets]))

  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-ink-line bg-cream">
      {GRID_HOUSES.flatMap((row, ri) =>
        row.map((house, ci) => {
          const isCenter = house === 0
          const isLagna = house === 1
          const rashiNum = rashiByHouse.get(house) ?? 0
          const planets = planetsByHouse.get(house) ?? []
          return (
            <div
              key={`${ri}-${ci}`}
              className={`relative flex min-h-[76px] flex-col items-center justify-center border border-ink-line/70 p-1.5 text-center sm:min-h-[92px] ${
                isCenter ? 'bg-canvas' : isLagna ? 'bg-accent-tint' : 'bg-cream'
              }`}
              style={isCenter ? { gridColumn: 'span 2', gridRow: 'span 2' } : undefined}
            >
              {isCenter ? (
                <div className="flex flex-col items-center gap-1.5 text-ink-faint">
                  <Chakra width={26} height={26} className="animate-spin-slow" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em]">D1 · Rashi</span>
                </div>
              ) : (
                <>
                  <span className={`text-[10px] font-semibold ${isLagna ? 'text-accent-deep' : 'text-ink-faint'}`}>
                    {rashiNum}
                    {isLagna && ' · L'}
                  </span>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
                    {planets.map((p) => (
                      <span
                        key={p}
                        className="rounded border border-ink-line bg-canvas px-1.5 py-0.5 text-[11px] font-medium text-ink"
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

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

/** Renders the body lines of a single section (bullets, numbered, why-callout, bold). */
function SectionBody({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-2.5 text-[14px] leading-relaxed text-ink/85">
      {lines.map((line, i) => {
        const t = line.trim()
        if (!t) return <div key={i} className="h-0.5" />
        if (/^[-*•]\s+/.test(t)) {
          const body = t.replace(/^[-*•]\s+/, '')
          return (
            <div key={i} className="flex items-start gap-2.5 pl-0.5">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{renderInline(body)}</span>
            </div>
          )
        }
        if (/^\d+\.\s+/.test(t)) {
          const m = t.match(/^(\d+)\.\s+(.*)/)!
          return (
            <div key={i} className="flex items-start gap-2.5 pl-0.5">
              <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-[11px] font-semibold text-accent-deep">
                {m[1]}
              </span>
              <span>{renderInline(m[2])}</span>
            </div>
          )
        }
        if (t.toLowerCase().startsWith('why') || /^\*\*/.test(t)) {
          return (
            <p
              key={i}
              className="rounded-xl border border-ink-line bg-cream px-3 py-2 text-[12.5px] leading-relaxed text-ink-soft"
            >
              {renderInline(t)}
            </p>
          )
        }
        return (
          <p key={i} className="text-[14px] leading-relaxed">
            {renderInline(t)}
          </p>
        )
      })}
    </div>
  )
}

interface Section {
  title: string
  body: string
}

function parseSections(text: string): Section[] {
  const lines = text.split('\n')
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of lines) {
    const m = line.match(/^#{1,3}\s+(.*)/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1].trim(), body: '' }
    } else if (current) {
      current.body += line + '\n'
    }
  }
  if (current) sections.push(current)
  if (sections.length === 0) sections.push({ title: 'Interpretation', body: text })
  return sections.filter((s) => s.body.trim().length > 0 || s.title)
}

function sectionMeta(title: string) {
  const t = title.toLowerCase()
  if (t.includes('overall') || t.includes('personality'))
    return { Icon: IconSpark, label: 'Personality' }
  if (t.includes('love timeline')) return { Icon: IconNetwork, label: 'Love Timeline' }
  if (t.includes('love') || t.includes('relationship'))
    return { Icon: IconLotus, label: 'Love & Relationships' }
  if (t.includes('career') || t.includes('work')) return { Icon: IconTarget, label: 'Career' }
  if (t.includes('wealth') || t.includes('money') || t.includes('luxury'))
    return { Icon: IconCoins, label: 'Wealth & Luxury' }
  if (t.includes('health')) return { Icon: IconShield, label: 'Health' }
  if (t.includes('education') || t.includes('study')) return { Icon: IconBook, label: 'Education' }
  if (t.includes('problem') || t.includes('challenge'))
    return { Icon: IconSplit, label: 'Problems & Challenges' }
  if (t.includes('solution') || t.includes('remedy'))
    return { Icon: IconCheck, label: 'Solutions & Remedies' }
  if (t.includes('12 month')) return { Icon: IconCompass, label: 'Next 12 Months' }
  if (t.includes('5 year') || t.includes('five year')) return { Icon: IconLayers, label: 'Next 5 Years' }
  if (t.includes('dasha')) return { Icon: IconScale, label: 'Dasha Timeline' }
  return { Icon: IconSpark, label: title }
}

function SectionedInterpretation({ text }: { text: string }) {
  const sections = parseSections(text)
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sections.map((s, i) => {
        const { Icon, label } = sectionMeta(s.title)
        return (
          <Reveal key={i} delay={(i % 2) * 70} className="h-full">
            <article className="spot group flex h-full flex-col rounded-3xl border border-ink-line bg-canvas p-5 transition-all duration-500 ease-expo hover:border-accent/25 hover:shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                  <Icon width={19} height={19} />
                </span>
                <h3 className="font-serif text-xl leading-tight tracking-tight text-ink">
                  {label}
                </h3>
              </div>
              <div className="mt-4 flex-1">
                <SectionBody text={s.body} />
              </div>
            </article>
          </Reveal>
        )
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
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [remoteResults, setRemoteResults] = useState<PlaceResult[]>([])
  const [showList, setShowList] = useState(false)
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chart, setChart] = useState<ChartPayload | null>(null)
  const [interpretation, setInterpretation] = useState('')
  const [nimError, setNimError] = useState<string | null>(null)

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (debounce.current) clearTimeout(debounce.current)
  }, [])

  const localResults = useMemo<PlaceResult[]>(
    () => (place.trim().length >= 1 ? localPlaces(place) : []),
    [place]
  )
  const placeResults = useMemo<PlaceResult[]>(() => {
    const seen = new Set(localResults.map(placeKey))
    const extra = remoteResults.filter((r) => !seen.has(placeKey(r)))
    return [...localResults, ...extra].slice(0, 10)
  }, [localResults, remoteResults])

  const canGenerate = useMemo(
    () => !!date && !!time && !!place && lat !== '' && lon !== '' && !!timezone,
    [date, time, place, lat, lon, timezone]
  )

  function onPlaceChange(v: string) {
    setPlace(v)
    setShowList(true)
    if (debounce.current) clearTimeout(debounce.current)
    const q = v.trim()
    if (q.length < 2) {
      setRemoteResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/astrology/geocode?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setRemoteResults(Array.isArray(data.results) ? data.results : [])
      } catch {
        setRemoteResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
  }

  function selectPlace(p: PlaceResult) {
    setPlace(`${p.name}${p.region ? `, ${p.region}` : ''}${p.country ? `, ${p.country}` : ''}`)
    setLat(p.latitude.toString())
    setLon(p.longitude.toString())
    setTimezone(p.timezone)
    setShowList(false)
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
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar />

      <SignInGate>
        <main className="flex-1">
          {/* Header */}
          <section className="relative isolate overflow-hidden border-b border-ink-line">
            <div className="mesh" aria-hidden="true">
              <span className="mesh-layer mesh-a" />
              <span className="mesh-layer mesh-c" />
            </div>
            <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
              <Reveal className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Sidereal · Lahiri Ayanamsa
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.03] tracking-tightest text-ink sm:text-6xl">
                  Kundali <em className="italic text-accent-deep">AI</em>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft">
                  Deterministic Vedic calculations from your exact birth time and place — then
                  interpreted with traditional reasoning. No invented positions, no guessing from
                  your date alone.
                </p>
              </Reveal>
            </div>
          </section>

          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            {/* Birth form */}
            {!chart && (
              <div className="mx-auto max-w-2xl">
                <Reveal>
                  <div className="spot rounded-3xl border border-ink-line bg-canvas p-6 shadow-soft sm:p-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Date of birth">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Exact birth time">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className={inputClass}
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Birth place (any city, worldwide)">
                          <div className="relative">
                            <input
                              type="text"
                              value={place}
                              onChange={(e) => onPlaceChange(e.target.value)}
                              onFocus={() => setShowList(true)}
                              onBlur={() => setTimeout(() => setShowList(false), 150)}
                              placeholder="e.g. Shirala, Mumbai, London, New York…"
                              autoComplete="off"
                              className={inputClass}
                            />
                            {showList && place.trim().length >= 1 && (
                              <div className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-2xl border border-ink-line bg-canvas py-1 shadow-lift">
                                {placeResults.length === 0 && (
                                  <div className="px-4 py-2.5 text-sm text-ink-faint">
                                    {searching ? 'Searching places…' : 'No matching place — enter coordinates manually.'}
                                  </div>
                                )}
                                {placeResults.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectPlace(p)}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-cream"
                                  >
                                    <span className="text-sm font-medium text-ink">{p.name}</span>
                                    <span className="truncate text-xs text-ink-faint">
                                      {[p.region, p.country].filter(Boolean).join(', ')}
                                    </span>
                                  </button>
                                ))}
                                {searching && placeResults.length > 0 && (
                                  <div className="border-t border-ink-line px-4 py-2 text-[11px] text-ink-faint">
                                    Searching more places…
                                  </div>
                                )}
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
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Longitude">
                        <input
                          type="number"
                          step="any"
                          value={lon}
                          onChange={(e) => setLon(e.target.value)}
                          placeholder="74.20"
                          className={inputClass}
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Timezone">
                          <input
                            type="text"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            placeholder="Asia/Kolkata"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>

                    <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
                      Picking a place fills latitude, longitude and timezone automatically — edit any
                      field if you know the exact values. An accurate birth time is essential for the
                      Lagna and dasha.
                    </p>

                    {error && (
                      <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                        {error}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={generate}
                      disabled={!canGenerate || loading}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas shadow-sm transition-all duration-300 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" />
                          Calculating chart…
                        </>
                      ) : (
                        <>
                          <IconBolt width={16} height={16} className="text-accent" />
                          Generate Kundali
                        </>
                      )}
                    </button>
                  </div>
                </Reveal>
              </div>
            )}

            {/* Results */}
            {chart && (
              <div className="space-y-8">
                <button
                  type="button"
                  onClick={() => { setChart(null); setInterpretation('') }}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  <IconArrowRight width={14} height={14} className="rotate-180" />
                  New chart
                </button>

                {/* Ascendant + key facts */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <Card>
                    <Label>Ascendant (Lagna)</Label>
                    <div className="mt-3 font-serif text-4xl leading-none tracking-tight text-ink">
                      {chart.lagna.rashi}
                    </div>
                    <div className="mt-2 text-xs text-ink-faint">
                      {chart.lagna.rashiDevanagari} · {degreeString(chart.lagna.degreeInRashi)}
                    </div>
                  </Card>
                  <Card>
                    <Label>Moon Nakshatra</Label>
                    <div className="mt-3 font-serif text-3xl leading-none tracking-tight text-ink">
                      {chart.nakshatra.name}
                    </div>
                    <div className="mt-2 text-xs text-ink-faint">
                      {chart.nakshatra.devanagari} · Pada {chart.nakshatra.pada} · Lord {chart.nakshatra.lord}
                    </div>
                  </Card>
                  <Card>
                    <Label>Current Dasha</Label>
                    {chart.dashas.current ? (
                      <>
                        <div className="mt-3 font-serif text-3xl leading-none tracking-tight text-ink">
                          {chart.dashas.current.mahadasha}
                          <span className="text-ink-faint"> / {chart.dashas.current.antardasha}</span>
                        </div>
                        <div className="mt-2 text-xs text-ink-faint">
                          {chart.dashas.current.remainingMahadashaYears.toFixed(1)} yrs of Mahadasha remain
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 text-sm text-ink-soft">Beyond the 120-year Vimshottari cycle.</div>
                    )}
                  </Card>
                </div>

                {/* Chart grid + planetary table */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <Label>Birth Chart (D1 · North Indian)</Label>
                    <div className="mt-3">
                      <KundaliChart chart={chart} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-ink-faint">
                      {Object.entries(PLANET_ABBR).map(([k, v]) => (
                        <span key={k}>{v} = {k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-3">
                    <Label>Planetary Positions</Label>
                    <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-line">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-cream text-ink-faint">
                          <tr className="border-b border-ink-line">
                            <th className="px-3.5 py-2.5 font-medium">Planet</th>
                            <th className="px-3.5 py-2.5 font-medium">Rashi</th>
                            <th className="px-3.5 py-2.5 font-medium">Degree</th>
                            <th className="px-3.5 py-2.5 font-medium">Nakshatra</th>
                            <th className="px-3.5 py-2.5 font-medium">House</th>
                            <th className="px-3.5 py-2.5 font-medium">Dignity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chart.planets.map((p) => (
                            <tr key={p.key} className="border-b border-ink-line/60 last:border-0">
                              <td className="px-3.5 py-2.5 font-medium text-ink">
                                {p.key}
                                {p.retrograde && <span className="ml-1 text-accent-deep" title="Retrograde">℞</span>}
                                {p.combust && <span className="ml-1 text-ink-faint" title="Combust">☼</span>}
                              </td>
                              <td className="px-3.5 py-2.5 text-ink-soft">{p.rashi}</td>
                              <td className="px-3.5 py-2.5 font-mono text-ink-soft">{degreeString(p.degreeInRashi)}</td>
                              <td className="px-3.5 py-2.5 text-ink-soft">{p.nakshatra} P{p.pada}</td>
                              <td className="px-3.5 py-2.5 text-ink-soft">{p.house}</td>
                              <td className="px-3.5 py-2.5">
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${dignityClass(p.dignity)}`}>
                                  {p.dignity}
                                </span>
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
                    <div className="mt-4 space-y-2.5">
                      {chart.yogas.length === 0 && (
                        <p className="text-sm text-ink-faint">No major yogas detected in this chart.</p>
                      )}
                      {chart.yogas.map((y) => (
                        <div key={y.name} className="rounded-2xl border border-ink-line bg-cream p-3.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-ink">{y.name}</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${strengthClass(y.strength)}`}>
                              {y.strength}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{y.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <Label>Slow Transits Now</Label>
                    <div className="mt-4 space-y-2">
                      {chart.transits.houses.map((t) => (
                        <div key={t.planet} className="flex items-center justify-between rounded-xl border border-ink-line bg-cream px-3.5 py-2.5 text-sm">
                          <span className="font-medium text-ink">{t.planet}</span>
                          <span className="text-ink-soft">
                            {t.rashi} <span className="text-ink-faint">· House {t.house}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Dasha timeline */}
                <Card>
                  <Label>Upcoming Dasha Timeline</Label>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream text-ink-faint">
                        <tr className="border-b border-ink-line">
                          <th className="px-3.5 py-2.5 font-medium">Mahadasha</th>
                          <th className="px-3.5 py-2.5 font-medium">Antardasha</th>
                          <th className="px-3.5 py-2.5 font-medium">Start</th>
                          <th className="px-3.5 py-2.5 font-medium">End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.dashas.upcoming.slice(0, 12).map((d, i) => (
                          <tr key={i} className="border-b border-ink-line/60 last:border-0">
                            <td className="px-3.5 py-2.5 font-medium text-ink">{d.mahadasha}</td>
                            <td className="px-3.5 py-2.5 text-ink-soft">{d.antardasha}</td>
                            <td className="px-3.5 py-2.5 font-mono text-ink-faint">{d.start.slice(0, 10)}</td>
                            <td className="px-3.5 py-2.5 font-mono text-ink-faint">{d.end.slice(0, 10)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* AI Interpretation */}
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label>AI Interpretation</Label>
                    <span className="text-[11px] text-ink-faint">
                      Ayanamsa {chart.ayanamsa.toFixed(2)}° · Lahiri · {chart.birthDetails.place}
                    </span>
                  </div>
                  {nimError && (
                    <p className="mt-4 rounded-xl border border-accent/25 bg-accent-tint px-3.5 py-2.5 text-xs leading-relaxed text-accent-deep">
                      AI interpretation is unavailable right now ({nimError}). The calculated chart
                      above is still valid — you can retry the interpretation later.
                    </p>
                  )}
                  <div className="mt-5">
                    {interpretation ? (
                      <SectionedInterpretation text={interpretation} />
                    ) : !nimError ? (
                      <div className="flex items-center gap-2 text-sm text-ink-soft">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-line border-t-accent" />
                        Consulting the treatises…
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-6 border-t border-ink-line pt-4 text-[11px] leading-relaxed text-ink-faint">
                    Traditional astrological interpretation — not medical, financial, or legal advice.
                    Predictions are tendencies based on the calculated chart, not guarantees.
                  </p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </SignInGate>

      <Footer />
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-ink-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-accent/60 focus:ring-4 focus:ring-accent/10'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</span>
      {children}
    </label>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-ink-line bg-canvas p-6 shadow-soft ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-deep">{children}</div>
}

function dignityClass(d: string) {
  switch (d) {
    case 'Exalted': return 'border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300'
    case 'Own sign': return 'border-accent/20 bg-accent-tint text-accent-deep'
    case 'Debilitated': return 'border-rose-200 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:text-rose-300'
    default: return 'border-ink-line bg-ink/[0.04] text-ink-soft'
  }
}

function strengthClass(s: string) {
  switch (s) {
    case 'Strong': return 'border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300'
    case 'Moderate': return 'border-accent/20 bg-accent-tint text-accent-deep'
    default: return 'border-ink-line bg-ink/[0.04] text-ink-soft'
  }
}
