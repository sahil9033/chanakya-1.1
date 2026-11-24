import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBolt,
  IconCoins,
  IconCompass,
  IconLayers,
  IconNetwork,
  IconScale,
  IconShield,
  IconSplit,
  IconTarget,
} from '../components/Icons'

const UPAYAS = [
  {
    name: 'Sāma',
    devanagari: 'साम',
    subtitle: 'Conciliation & Persuasion',
    Icon: IconScale,
    desc: 'The art of peaceful negotiation — aligning shared interests, honouring reputation and establishing moral rapport before tension escalates.',
    application:
      'Deploy first against honourable counterparts and equals, where mutual preservation serves both parties.',
    prompt: 'How do I execute Sāma (conciliation) with a hostile partner who still values reputation?',
  },
  {
    name: 'Dāma',
    devanagari: 'दाम',
    subtitle: 'Concession & Material Value',
    Icon: IconCoins,
    desc: 'Offering tangible concessions — strategic gifts, treasury allocations, equity or revenue share to satisfy the adversary’s appetite.',
    application:
      'Deploy when the counterpart is driven by economic interest, or when buying critical time costs less than conflict.',
    prompt: 'How to use Dāma (economic concessions) strategically without appearing desperate or weak?',
  },
  {
    name: 'Bheda',
    devanagari: 'भेद',
    subtitle: 'Division & Dissension',
    Icon: IconSplit,
    desc: 'Creating fissures in the opposition’s alliances, exploiting internal jealousies and breaking unified fronts before direct encounter.',
    application:
      'Deploy when facing an alliance stronger than yourself. Never fight a united coalition — divide their counsels first.',
    prompt: 'Explain the tactical deployment of Bheda (dissension) against a monopolistic coalition.',
  },
  {
    name: 'Daṇḍa',
    devanagari: 'दण्ड',
    subtitle: 'Decisive Force & Enforcement',
    Icon: IconShield,
    desc: 'The swift, overwhelming application of law, economic sanction or decisive strike. The final resort, never the first.',
    application:
      'Deploy only when all other Upāyas fail — with absolute surprise, total conviction and zero hesitation.',
    prompt: 'When should Daṇḍa (punitive enforcement) be unleashed to maximise deterrence with minimal blowback?',
  },
]

const SAPTANGA = [
  {
    organ: 'Svāmin',
    devanagari: 'स्वामी',
    role: 'The Sovereign',
    Icon: IconTarget,
    meaning: 'The visionary head who provides moral direction, discipline and strategic clarity.',
  },
  {
    organ: 'Amātya',
    devanagari: 'अमात्य',
    role: 'The Council',
    Icon: IconNetwork,
    meaning: 'The administrative intellect and executive council that executes strategy.',
  },
  {
    organ: 'Janapada',
    devanagari: 'जनपद',
    role: 'Territory & People',
    Icon: IconLayers,
    meaning: 'The fertile economic base, loyal workforce and community that sustains vigour.',
  },
  {
    organ: 'Durga',
    devanagari: 'दुर्ग',
    role: 'The Fortress',
    Icon: IconShield,
    meaning: 'Defensive moats, secure systems, protected reserves and digital architecture.',
  },
  {
    organ: 'Kośa',
    devanagari: 'कोश',
    role: 'The Treasury',
    Icon: IconCoins,
    meaning: 'Liquid reserves acquired ethically that allow survival during famine or war.',
  },
  {
    organ: 'Daṇḍa',
    devanagari: 'दण्ड',
    role: 'Enforcement',
    Icon: IconScale,
    meaning: 'Disciplined executive power capable of protecting sovereignty and enforcing law.',
  },
  {
    organ: 'Mitra',
    devanagari: 'मित्र',
    role: 'The Allies',
    Icon: IconCompass,
    meaning: 'Dependable, enduring friends who stand in solidarity during catastrophe.',
  },
]

export default function CodexPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-ink-line">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-a" />
          <span className="mesh-layer mesh-b" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The Arthashastra frameworks
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-balance font-serif text-5xl leading-[1.04] tracking-tightest text-ink sm:text-6xl">
              The Kautilyan strategic codex
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Written by Acharya Chanakya over 2,300 years ago, the Arthashastra remains the world&apos;s
              most sophisticated treatise on realpolitik, statecraft, economics and warfare.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-9 flex justify-center">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-lift"
              >
                <IconBolt width={16} height={16} className="text-accent" />
                Apply these frameworks
                <IconArrowRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section I — 4 Upayas */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 max-w-xl">
            <Reveal>
              <span className="eyebrow">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Section I · Tactical expedients
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
                The 4 Upāyas of influence
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-pretty text-ink-soft">
                The fourfold methodology used to resolve every dispute, negotiation and conflict in
                human affairs — always applied in order.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {UPAYAS.map((u, i) => (
              <Reveal key={u.name} delay={(i % 2) * 80}>
                <Link
                  href={`/chat?prompt=${encodeURIComponent(u.prompt)}`}
                  className="spot group flex h-full flex-col rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift"
                >
                  <div className="relative flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                      <u.Icon width={22} height={22} />
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, '0')} · Book VII
                    </span>
                  </div>

                  <div className="relative mt-6 flex items-baseline gap-3">
                    <h3 className="font-serif text-3xl tracking-tight text-ink">{u.name}</h3>
                    <span className="text-lg text-ink-faint">{u.devanagari}</span>
                  </div>
                  <div className="text-sm font-medium text-ink-soft">{u.subtitle}</div>

                  <p className="relative mt-4 text-pretty text-[15px] leading-relaxed text-ink-soft">
                    {u.desc}
                  </p>

                  <div className="relative mt-5 rounded-2xl border border-ink-line bg-cream p-4 text-[13px] leading-relaxed text-ink-soft">
                    <strong className="mb-1 block font-medium text-ink">When to deploy</strong>
                    {u.application}
                  </div>

                  <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                    Consult Chanakya
                    <IconArrowRight
                      width={16}
                      height={16}
                      className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section II — Saptanga */}
      <section className="border-y border-ink-line bg-cream py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 max-w-xl">
            <Reveal>
              <span className="eyebrow">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Section II · Organisational architecture
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
                Saptāṅga — the seven pillars
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-pretty text-ink-soft">
                As the body needs seven limbs to thrive, every resilient enterprise or nation
                depends on seven indispensable pillars. Audit each; neglect one and the whole tilts.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAPTANGA.map((s, i) => (
              <Reveal key={s.organ} delay={(i % 3) * 70}>
                <div className="spot group h-full rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-deep">
                      <s.Icon width={20} height={20} />
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="relative mt-6 flex items-baseline gap-2 font-serif text-2xl tracking-tight text-ink">
                    {s.organ}
                    <span className="text-sm text-ink-faint">{s.devanagari}</span>
                  </h3>
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent-deep">
                    {s.role}
                  </div>
                  <p className="relative mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
                    {s.meaning}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-14 flex justify-center">
              <Link
                href="/chat?filter=arthashastra"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-lift"
              >
                <IconBolt width={16} height={16} className="text-accent" />
                Audit your own Saptāṅga
                <IconArrowUpRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
