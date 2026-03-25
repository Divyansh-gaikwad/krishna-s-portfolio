import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import InfiniteMenu from './components/InfiniteMenu'
import heroPortrait from './assets/pic1.png'
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaBehance,
  FaArrowRight,
  FaHeart,
  FaMagic,
  FaVideo,
  FaBolt,
  FaLayerGroup,
} from 'react-icons/fa'

const timelineData = [
  {
    year: '2022 - 2024',
    role: 'Post-Production Specialist - Studio Axis',
    description:
      'Delivered ad cuts, wedding films, and corporate highlights with custom sound design, color grading, and motion typography.',
    achievement: '500+ projects delivered with <48h turnaround on short-form',
    cover:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    year: '2024 - 2025',
    role: 'Freelance Editor - Creator Collaborations',
    description:
      'Built cinematic edits and fast-paced shorts for creators, coaches, and startups with retention-first storytelling.',
    achievement: '120+ clients worldwide, 40M+ combined views',
    cover:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    year: '2026',
    role: 'Lead Video Editor - Brand Story Lab',
    description:
      'Directed the post-production pipeline for launch films, social campaigns, and podcast edits for lifestyle and tech brands.',
    achievement: '300+ reels, 24 campaign films, 95% repeat-client ratio',
    cover:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  },
]

const pricingPlans = [
  {
    name: 'Pre-Wedding',
    price: 'Rs 6,000/-',
    note: 'per project',
    cover:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    icon: FaHeart,
    accent: 'from-fuchsia-500/40 via-violet-500/20 to-transparent',
    features: [
      'Pre-wedding cinematic edit',
      'Story-first pacing and transitions',
      'Color correction included',
      'First draft in 9 working days (after song lock)',
    ],
  },
  {
    name: 'Wedding Film + Teaser',
    price: 'Rs 16,000/-',
    note: 'per project',
    popular: true,
    cover:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    icon: FaMagic,
    accent: 'from-violet-500/45 via-cyan-500/15 to-transparent',
    features: [
      'Wedding film with teaser output',
      'Music sync, transitions, and polish',
      'Delivery timeline: about 25 days',
      '2 rounds of changes included',
    ],
  },
  {
    name: 'Documentary',
    price: 'Rs 20,000/-',
    note: 'per project',
    cover:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    icon: FaVideo,
    accent: 'from-cyan-500/35 via-sky-500/15 to-transparent',
    features: [
      'Long-form wedding documentary edit',
      'Narrative structure and continuity flow',
      'Professional color correction pass',
      'Part of full wedding delivery options',
    ],
  },
  {
    name: 'Same Day Edit',
    price: 'Rs 10,000/-',
    note: 'per day (travel extra)',
    cover:
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80',
    icon: FaBolt,
    accent: 'from-emerald-500/35 via-cyan-500/15 to-transparent',
    features: [
      'Fast turnaround same-day output',
      'Event-day selection and edit support',
      'Best for highlights and reception screens',
      'Travel and logistics excluded',
    ],
  },
  {
    name: 'Film + Teaser + Documentary',
    price: 'Rs 40,000/-',
    note: 'complete package',
    cover:
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1200&q=80',
    icon: FaLayerGroup,
    accent: 'from-violet-500/35 via-indigo-500/15 to-transparent',
    features: [
      'Complete wedding post-production package',
      'Film + teaser + documentary delivery',
      'Typical full timeline: 30-35 days',
      '40% advance, 60% before final delivery',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const projectItems = [
  {
    image: '/image 1 .png',
    link: 'https://youtu.be/Atb-qs3NkYI?si=JNvvMgqHqimCSzht',
    title: 'Soulmate Frames',
    description: 'A tender pre-wedding story built on soft emotion and timeless visuals.',
  },
  {
    image: '/image 2.png',
    link: 'https://youtu.be/KKyMT2irlRQ?si=X2dd25c6GIIsbrP3',
    title: 'Eternal Vows Prelude',
    description: 'A cinematic pre-wedding sequence with elegant pacing and romantic mood.',
  },
  {
    image: '/image 3.png',
    link: 'https://youtu.be/MQU8AbEO0p8?si=FDRHNWIvg0HXk9cI',
    title: 'Forever Begins',
    description: 'A heartfelt pre-wedding highlight capturing joy, chemistry, and celebration.',
  },
  {
    image: '/image 4.png',
    link: 'https://youtu.be/HOHYcZu88c0?si=FQmyaYE1PBcjAo9D',
    title: 'Moments in Motion',
    description: 'A vibrant wedding story cut with rhythmic pacing, emotion, and cinematic detail.',
  },
]

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [typedIntro, setTypedIntro] = useState('')
  const [typedRole, setTypedRole] = useState('')
  const [isPricingPaused, setIsPricingPaused] = useState(false)

  useEffect(() => {
    const introText = "Hey, I'm Krishna Kavde"
    const roleText = 'Creative\nEditor'
    let introIndex = 0
    let roleIndex = 0
    let roleTimer

    const introTimer = setInterval(() => {
      introIndex += 1
      setTypedIntro(introText.slice(0, introIndex))

      if (introIndex >= introText.length) {
        clearInterval(introTimer)

        roleTimer = setInterval(() => {
          roleIndex += 1
          setTypedRole(roleText.slice(0, roleIndex))

          if (roleIndex >= roleText.length) {
            clearInterval(roleTimer)
          }
        }, 70)
      }
    }, 60)

    return () => {
      clearInterval(introTimer)
      clearInterval(roleTimer)
    }
  }, [])

  const socialLinks = useMemo(
    () => [
      { icon: FaInstagram, href: '#', label: 'Instagram' },
      { icon: FaYoutube, href: '#', label: 'YouTube' },
      { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
      { icon: FaBehance, href: '#', label: 'Behance' },
    ],
    [],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    // Simulate submission with a console log and an alert.
    console.log('Contact form submitted', form)
    alert('Thanks! Your message has been sent.')
    setForm({ name: '', email: '', message: '' })
  }

  const scrollToWork = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05050B] text-slate-100">
      <section className="relative min-h-screen p-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex min-h-screen w-full flex-col overflow-hidden rounded-b-[52px] bg-[linear-gradient(130deg,#090612_0%,#140b2b_38%,#0a1a2b_100%)]"
        >
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_22%_18%,rgba(124,58,237,0.18),transparent_40%),radial-gradient(circle_at_82%_20%,rgba(6,182,212,0.14),transparent_42%)]" />

          <div className="relative z-30 flex items-center justify-between px-6 pb-3 pt-6 sm:px-9">
            <p className="invisible font-['Poppins'] text-lg font-medium text-white">Krishna Kavde</p>
            <div className="hidden items-center gap-14 font-['Poppins'] text-base font-normal tracking-wide text-slate-100/90 md:flex">
              <a href="#" className="transition duration-200 hover:text-cyan-200">
                Home
              </a>
              <a href="#experience" className="transition duration-200 hover:text-cyan-200">
                About
              </a>
              <a href="#projects" className="transition duration-200 hover:text-cyan-200">
                Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1.5 text-sm font-semibold  text-black transition hover:scale-[1.03]"
              >
                <span className="px-2">Get in touch</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
                  <FaArrowRight className="text-[14px]" />
                </span>
              </a>
            </div>
          </div>

          <div className="relative z-20 grid flex-1 grid-rows-[1fr_auto]">
            <div className="relative grid items-center px-6 pb-8 pt-2 sm:px-9 lg:grid-cols-[1.2fr_0.9fr]">
              <img
                src={heroPortrait}
                alt="Hero portrait"
                className="pointer-events-none absolute bottom-0 left-[27%] z-10 h-[92%] w-[42%] scale-[1.45] object-contain object-center opacity-90 mix-blend-normal brightness-90 contrast-85 saturate-[0.86] blur-[0.4px] drop-shadow-[0_0_36px_rgba(5,5,11,0.95)] max-lg:hidden"
              />

              <div className="relative z-20 -translate-y-[24px]">
                <p className="text-3xl font-semibold text-slate-100 sm:text-4xl">
                  {typedIntro}
                  <span className="ml-1 inline-block animate-pulse text-cyan-200">|</span>
                </p>
                <h1 className="mt-2 whitespace-pre-line font-['Poppins'] text-6xl font-semibold leading-[0.9] text-white sm:text-7xl xl:text-8xl">
                  {typedRole}
                  <span className="ml-1 inline-block animate-pulse text-violet-200">|</span>
                </h1>
                <p className="mt-6 max-w-md text-base text-slate-200/95 sm:text-lg">
                  I create premium reels, wedding stories, and cinematic edits
                  that feel effortless and unforgettable.
                </p>
              </div>

              <div className="relative z-20 mt-4 max-w-lg -translate-y-[30px] justify-self-end p-1 text-left lg:-translate-x-4 xl:-translate-x-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/80">
                  Post-Production Philosophy
                </p>
                <p className="mt-3 font-['Poppins'] text-3xl font-semibold leading-[1.02] tracking-tight text-slate-100 drop-shadow-[0_10px_22px_rgba(0,0,0,0.28)] sm:text-4xl">
                  Great editing should feel
                  <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-100 bg-clip-text text-transparent">
                    {' '}
                    invisible.
                  </span>
                </p>
                <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-slate-200/85 sm:text-base">
                  From hook to climax, every cut is shaped for retention,
                  clarity, and emotional impact.
                </p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-16 z-30 flex items-start justify-between gap-6 px-6 text-[0.72rem] font-medium tracking-[0.02em] text-slate-200/88 sm:px-9 sm:text-xs md:text-sm">
              <p className="flex min-w-[128px] flex-col leading-tight">
                <span className="mb-1 text-[0.9rem] font-semibold leading-none text-[#00F5FF] drop-shadow-[0_0_8px_rgba(0,245,255,0.55)] sm:text-[1rem]">#01</span>
                <span className="text-[0.8rem] sm:text-sm">Reel Editing</span>
              </p>
              <p className="flex min-w-[128px] flex-col leading-tight">
                <span className="mb-1 text-[0.9rem] font-semibold leading-none text-[#FFD60A] drop-shadow-[0_0_8px_rgba(255,214,10,0.5)] sm:text-[1rem]">#02</span>
                <span className="text-[0.8rem] sm:text-sm">Wedding Highlights</span>
              </p>
              <p className="flex min-w-[128px] flex-col leading-tight">
                <span className="mb-1 text-[0.9rem] font-semibold leading-none text-[#FF8A00] drop-shadow-[0_0_8px_rgba(255,138,0,0.5)] sm:text-[1rem]">#03</span>
                <span className="text-[0.8rem] sm:text-sm">YouTube Video Edits</span>
              </p>
              <p className="flex min-w-[128px] flex-col leading-tight">
                <span className="mb-1 text-[0.9rem] font-semibold leading-none text-[#7CFF3A] drop-shadow-[0_0_8px_rgba(124,255,58,0.5)] sm:text-[1rem]">#04</span>
                <span className="text-[0.8rem] sm:text-sm">Brand Promo Films</span>
              </p>
            </div>

          </div>
        </motion.div>
      </section>

      <section id="experience" className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="font-['Poppins'] text-3xl font-semibold text-white sm:text-4xl"
        >
          Experience Timeline
        </motion.h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Years of crafting edits that hold attention and convert viewers into
          customers.
        </p>

        <div className="relative mt-16">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-0 hidden h-full w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-violet-500 to-cyan-400 md:block"
          />

          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <motion.article
                key={item.role}
                initial={{ opacity: 0, x: index % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className={`group relative ml-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-violet-300/30 hover:bg-violet-500/5 md:w-[46%] ${index % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'}`}
              >
                <div className="mb-3 inline-block rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs tracking-wide text-cyan-100">
                  {item.year}
                </div>
                <div className="relative mb-4 h-32 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={item.cover}
                    alt={`${item.role} timeline visual`}
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,12,0.08)_0%,rgba(2,4,12,0.55)_100%)]" />
                </div>
                <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-medium text-violet-200">
                  {item.achievement}
                </p>
                <div className="absolute -right-2 -top-2 hidden h-4 w-4 rounded-full bg-violet-400 shadow-[0_0_30px_rgba(124,58,237,0.9)] md:block" />
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          id="projects"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <h3 className="font-['Poppins'] text-3xl font-semibold text-white sm:text-4xl">
            Projects I&apos;ve Worked Upon
          </h3>
          <p className="mt-3 max-w-2xl text-slate-300">
            Rotate the gallery and click the active thumbnail to open its YouTube video.
          </p>

          <div className="relative left-1/2 mt-8 h-[560px] w-screen -translate-x-1/2 sm:h-[620px]">
            <InfiniteMenu items={projectItems} scale={0.95} />
          </div>
        </motion.div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
          className="mb-12"
        >
          <h2 className="font-['Poppins'] text-3xl font-semibold text-white sm:text-4xl">
            Pricing / Services
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Services and rates based on your quotation document.
          </p>
        </motion.div>

        <div
          className="relative overflow-x-hidden overflow-y-visible py-3"
          onMouseEnter={() => setIsPricingPaused(true)}
          onMouseLeave={() => setIsPricingPaused(false)}
        >
          <div
            className={`pricing-marquee-track flex w-max gap-6 py-2 ${isPricingPaused ? 'pricing-marquee-paused' : ''}`}
          >
            {[...pricingPlans, ...pricingPlans].map((plan, index) => (
              <div key={`${plan.name}-${index}`} className="w-[320px] sm:w-[360px]">
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className={`relative flex h-full flex-col rounded-3xl border p-5 backdrop-blur-2xl ${plan.popular ? 'border-violet-300/50 bg-violet-500/15 shadow-[0_0_40px_rgba(124,58,237,0.35)]' : 'border-white/10 bg-white/[0.03] hover:border-cyan-200/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]'}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 rounded-full border border-violet-300/50 bg-violet-500/90 px-3 py-1 text-xs tracking-wider text-white">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="relative mb-4 h-24 overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={plan.cover}
                      alt={`${plan.name} preview`}
                      className="h-full w-full object-cover opacity-70"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,12,0.08)_0%,rgba(2,4,12,0.72)_100%)]" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${plan.accent}`} />
                    <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/35 text-cyan-100">
                      <plan.icon className="text-sm" />
                    </div>
                  </div>

                  <h3 className="min-h-[48px] text-xl font-semibold leading-tight text-white">
                    {plan.name}
                  </h3>

                  <div className="mt-2 grid min-h-[74px] grid-cols-[1fr_auto] items-end gap-3">
                    <p className="whitespace-nowrap text-4xl font-bold leading-none text-cyan-200">
                      {plan.price}
                    </p>
                    <p className="max-w-[110px] text-sm leading-snug text-slate-300">{plan.note}</p>
                  </div>

                  <ul className="mt-5 min-h-[160px] space-y-2.5 text-sm text-slate-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-violet-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="mt-6 w-full rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-50 transition hover:bg-cyan-500/25"
                  >
                    Book Service
                  </button>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl sm:p-10"
        >
          <h2 className="font-['Poppins'] text-3xl font-semibold text-white sm:text-4xl">
            Let&apos;s Create Something Cinematic
          </h2>
          <p className="mt-3 text-slate-300">
            Send your brief and I&apos;ll reply with scope, timeline, and best-fit
            package.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Name"
              className="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-400/70 focus:shadow-[0_0_24px_rgba(124,58,237,0.25)]"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-400/70 focus:shadow-[0_0_24px_rgba(6,182,212,0.25)]"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
              placeholder="Tell me about your project"
              className="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-400/70 focus:shadow-[0_0_24px_rgba(124,58,237,0.25)]"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/40 bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3 text-sm font-medium text-white"
            >
              Send Message
              <FaArrowRight />
            </motion.button>
          </form>
        </motion.div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 border-t border-white/10 px-6 py-10 sm:flex-row sm:px-10">
        <p className="text-sm text-slate-400">
          Copyright {new Date().getFullYear()} Krishna VFX. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="rounded-full border border-white/15 bg-white/[0.03] p-2.5 text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:text-cyan-200"
            >
              <Icon />
            </a>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default App
