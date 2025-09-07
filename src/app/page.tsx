import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'
import CursorFillLink from '@/components/CursorFillLink'

export default function Home() {
  return (
    <div>
      {/* HERO - Full Viewport Height */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden -mt-4 md:mt-0">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(241,91,91,0.18), transparent 60%)', filter: 'blur(28px)' }} />
          <div className="absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(241,91,91,0.14), transparent 60%)', filter: 'blur(24px)' }} />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal variant="fade-up">
            <div className="max-w-4xl mx-auto px-3 md:px-0">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] text-gray-100">
                Ship a job‑ready resume
                <span className="block" style={{ color: 'var(--brand)' }}>powered by your real work</span>
              </h1>
              <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Connect your GitHub and LinkedIn, get quantified bullet points with proof, and export a clean, ATS‑friendly PDF in minutes.
              </p>
              <div className="mt-12">
                <SignedOut>
                  <Link href="/sign-up" className="btn-brand px-8 py-4 rounded-md text-lg font-semibold shadow shimmer magnetic">
                    Get Started Free
                  </Link>
                </SignedOut>
                <SignedIn>
                  <CursorFillLink href="/dashboard" className="btn-fill px-8 py-4 rounded-md text-lg font-semibold magnetic">
                    Go to Dashboard
                  </CursorFillLink>
                </SignedIn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <section className="w-full py-16">
        <Reveal className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8" variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                k: '01',
                title: 'Evidence‑based bullets',
                desc: 'We pull signals from commits, PRs, issues, and profile data to write bullets with real impact and numbers.'
              },
              {
                k: '02',
                title: 'Role‑aware tone',
                desc: 'Target a role or job description and we refocus language to match expectations without losing authenticity.'
              },
              {
                k: '03',
                title: 'Instant structure',
                desc: 'Drag sections, reorder content, and export to a clean PDF with beautiful typography and hierarchy.'
              }
            ].map((f, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 card-pro">
                <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-300">{f.k}</div>
                <h3 className="mt-2 text-xl font-semibold text-gray-100">{f.title}</h3>
                <p className="mt-2 text-gray-400">{f.desc}</p>
                <div className="mt-4 text-sm" style={{ color: 'var(--brand)' }}>Learn more →</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FLOW TIMELINE */}
      <section className="w-full py-16" style={{ background: 'linear-gradient(180deg, #0d0d0d, #111111)' }}>
        <Reveal className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8" variant="slide-left">
          <h2 className="text-2xl font-bold text-gray-100">A focused workflow</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              {
                title: 'Connect',
                body: 'Sign in with GitHub and LinkedIn. We only read, you control deletion anytime.'
              },
              {
                title: 'Ingest',
                body: 'We analyze repositories, contributions, roles and skills with lightweight heuristics.'
              },
              {
                title: 'Draft',
                body: 'AI proposes quantified bullets and summaries; you approve, tweak, or remove.'
              },
              {
                title: 'Export',
                body: 'Choose a template, adjust ordering, and export an ATS‑friendly PDF instantly.'
              }
            ].map((s, i) => (
              <div key={i} className="relative rounded-xl bg-white/5 border border-white/10 p-6 card-pro">
                <div className="absolute -top-3 left-5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/20 bg-black/40 px-2 text-[12px] text-gray-300">{i + 1}</div>
                <div className="text-lg font-semibold text-gray-100">{s.title}</div>
                <p className="mt-2 text-gray-400">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DEEP DIVE SECTION */}
      <section className="w-full py-16">
        <Reveal className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8" variant="fade-up">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 card-pro">
            <h3 className="text-xl font-semibold text-gray-100">Stand out with clarity</h3>
            <p className="mt-2 text-gray-400">
              Recruiters skim. We design for scanning: strong section headers, tight line‑height, balanced whitespace,
              and clean emphasis on results over responsibilities.
            </p>
            <div className="mt-4 rounded-md border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
              Example bullets
              <ul className="mt-2 space-y-1 text-gray-300">
                <li>— Cut build time by 43% by parallelizing CI steps and caching dependencies.</li>
                <li>— Led migration to typed APIs, reducing runtime errors by 28%.</li>
                <li>— Designed feature flags rollout; prevented incidents during 4 product launches.</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 card-pro">
            <h3 className="text-xl font-semibold text-gray-100">Designed for both humans and ATS</h3>
            <p className="mt-2 text-gray-400">
              Readable for people, parsable for machines. Clear headings, semantic ordering, and consistent structure ensure
              your resume survives automated filters without looking robotic.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-white/10 bg-black/40 p-4">
                <div className="text-[12px] uppercase tracking-wide text-gray-400">Signals</div>
                <div className="mt-1 text-gray-300">Commits, PRs, Releases, Issues, Stars</div>
              </div>
              <div className="rounded-md border border-white/10 bg-black/40 p-4">
                <div className="text-[12px] uppercase tracking-wide text-gray-400">Profile</div>
                <div className="mt-1 text-gray-300">Roles, Skills, Tenure, Impact</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full py-16" style={{ background: 'linear-gradient(180deg, #0d0d0d, #111111)' }}>
        <Reveal className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8" variant="zoom">
          <h2 className="text-2xl font-bold text-gray-100">What developers say</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              'I shipped a resume I\'m proud of in under 30 minutes.',
              'The bullets feel like me—just sharper and backed by data.',
              'Best part: no wrestling with docs. Edit, approve, export.'
            ].map((q, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-6 card-pro">
                <p className="text-gray-300">“{q}”</p>
                <div className="mt-3 text-sm text-gray-400">�� Software Engineer</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section className="w-full py-16">
        <Reveal className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6" variant="slide-left">
          {[
            { name: 'Starter', price: 'Free', note: 'For getting started', features: ['1 active resume', 'Core AI bullets', 'Export PDF'] },
            { name: 'Pro', price: '$9/mo', note: 'For serious job search', features: ['Unlimited resumes', 'Advanced AI tuning', 'All templates', 'Priority support'] },
            { name: 'Team', price: '$19/mo', note: 'For small teams', features: ['Shared workspace', 'Comments & notes', 'Admin controls'] }
          ].map((p, i) => (
            <div key={i} className={`rounded-2xl border p-6 card-pro ${i === 1 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}>
              <div className="text-sm text-gray-400">{p.note}</div>
              <div className="mt-1 text-xl font-semibold text-gray-100">{p.name}</div>
              <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--brand)' }}>{p.price}</div>
              <ul className="mt-4 space-y-2 text-gray-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><span className="text-xs" style={{ color: 'var(--brand)' }}>•</span><span>{f}</span></li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/sign-up" className={`w-full inline-flex justify-center px-4 py-2 rounded-md font-semibold shimmer magnetic ${i === 1 ? 'btn-brand' : 'btn-outline-brand'}`}>{i === 1 ? 'Upgrade to Pro' : 'Choose ' + p.name}</Link>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* FAQ WITH DETAILS */}
      <section className="w-full py-16" style={{ background: 'linear-gradient(180deg, #0d0d0d, #111111)' }}>
        <Reveal className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8" variant="fade-up">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[
              { q: 'How do you use my data?', a: 'We read your public activity and data you authorize via OAuth. You can revoke and delete data anytime from settings.' },
              { q: 'Will this pass ATS filters?', a: 'Yes. We use semantic headings, consistent ordering, and clean typography designed for ATS parsing.' },
              { q: 'Do I keep control?', a: 'Yes. You approve or edit every bullet and can remove anything you do not like before exporting.' },
              { q: 'Is there a free plan?', a: 'Yes. Start free and upgrade if you want advanced AI tuning, unlimited exports, and premium templates.' },
            ].map((f, i) => (
              <details key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 card-pro group">
                <summary className="cursor-pointer list-none select-none text-gray-100 flex items-center justify-between">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-xs text-gray-400 group-open:rotate-90 transition-transform">›</span>
                </summary>
                <div className="mt-2 text-gray-400">{f.a}</div>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="w-full pb-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 border" style={{ background: 'rgba(241, 91, 91, 0.08)', borderColor: 'rgba(241, 91, 91, 0.3)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-100">Cut your resume time from hours to minutes</h3>
                <p className="mt-2 text-gray-300">Connect accounts, review AI suggestions, and export a professional PDF. No fluff. No fiddly editors.</p>
              </div>
              <SignedOut>
                <Link href="/sign-up" className="btn-brand px-6 py-3 rounded-md text-base font-semibold shadow shimmer magnetic">Get Started</Link>
              </SignedOut>
              <SignedIn>
                <CursorFillLink href="/dashboard" className="btn-fill px-6 py-3 rounded-md text-base font-semibold magnetic">
                  Go to Dashboard
                </CursorFillLink>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
