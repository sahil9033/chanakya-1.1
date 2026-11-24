import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#E6E6E6] bg-[#F7F7F8] py-12 px-4 sm:px-8 text-[#585C7B]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1E2033]">
              chanakya
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D5650F] inline-block -mt-1" />
          </div>
          <p className="text-xs sm:text-sm text-[#585C7B] max-w-sm leading-relaxed">
            Sovereign strategic intelligence rooted in Kautilya&apos;s Arthashastra, Chanakya Niti, and Vedic Upanishadic discernment.
          </p>
          <div className="text-xs text-[#8F92A9] pt-2">
            &copy; {new Date().getFullYear()} Characha AI. Built on sovereign compute architecture.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E2033] mb-3">
            Treatises & Knowledge
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/codex" className="hover:text-[#D5650F] transition-colors">
                The 4 Upayas (Tactics)
              </Link>
            </li>
            <li>
              <Link href="/codex" className="hover:text-[#D5650F] transition-colors">
                Saptanga (7 Pillars)
              </Link>
            </li>
            <li>
              <Link href="/codex" className="hover:text-[#D5650F] transition-colors">
                Mandala Geopolitics
              </Link>
            </li>
            <li>
              <Link href="/philosophy" className="hover:text-[#D5650F] transition-colors">
                Upanishadic Viveka
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E2033] mb-3">
            Counsel Console
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/chat" className="hover:text-[#D5650F] transition-colors">
                Ask Chanakya Everything
              </Link>
            </li>
            <li>
              <Link href="/chat?filter=arthashastra" className="hover:text-[#D5650F] transition-colors">
                Statecraft Realpolitik Mode
              </Link>
            </li>
            <li>
              <Link href="/chat?filter=upanishad" className="hover:text-[#D5650F] transition-colors">
                Upanishadic Discernment
              </Link>
            </li>
            <li>
              <a
                href="https://build.nvidia.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D5650F] transition-colors"
              >
                NVIDIA NIM Infrastructure ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
