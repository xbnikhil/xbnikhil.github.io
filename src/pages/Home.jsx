import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee'
import Reveal from '../components/Reveal'
import HeroDog from '../components/HeroDog'

const experience = [
  {
    role: 'Software Developer',
    company: 'Vidushi Infotech SSP Pvt. Ltd.',
    type: 'Full-time',
    dates: 'Dec 2025 – Present',
    duration: '11 mos',
    location: 'Pune District, Maharashtra, India',
    onsite: 'On-site',
    logo: 'VI',
    logoTone: 'logo-lime',
    skills: 'Bootstrap (Framework), Css and +10 skills',
  },
  {
    role: 'Web Developer',
    company: 'PanGrow',
    type: 'Full-time',
    dates: 'Sep 2023 – Mar 2025',
    duration: '1 yr 7 mos',
    location: 'Pune District, Maharashtra, India',
    onsite: 'On-site',
    roleNote: 'Wordpress website developer',
    logo: 'PG',
    logoTone: 'logo-purple',
    skills: 'Back-End Web Development, HTML and +10 skills',
  },
  {
    role: 'Web Developer',
    company: 'Plus91 Technologies Pvt. Ltd.',
    type: 'Full-time',
    dates: 'Jan 2022 – Jul 2023',
    duration: '1 yr 7 mos',
    location: 'Pune District, Maharashtra, India',
    onsite: 'On-site',
    logo: 'P9',
    logoTone: 'logo-orange',
    skills: 'HTML, JavaScript and +6 skills',
  },
]

const vibeCards = [
  {
    emoji: '🛠️',
    title: 'Building',
    text: 'Small experiments, side quests, and things that almost work on the first try.',
    tone: 'card-lime',
  },
  {
    emoji: '🌱',
    title: 'Learning',
    text: 'Poking at new tools, reading the docs, and hoarding tabs I will definitely close later.',
    tone: 'card-lilac',
  },
  {
    emoji: '☕',
    title: 'Chilling',
    text: 'A calm, colorful corner of the internet. No buzzwords, no hustle-porn — just good vibes.',
    tone: 'card-peach',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-pill">
            <span className="hero-pill-dot" aria-hidden="true" />
            Hey, I'm Nikhil — welcome in.
          </p>

          <h1 className="hero-title">
            My <span className="accent-word">always-in-progress</span> digital
            basecamp.
          </h1>

          <p className="hero-sub">
            A home for the projects I build, tools I explore, and lessons I
            pick up along the way.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/projects">
              Take a peek around <span className="arrow">→</span>
            </Link>
            <Link className="btn btn-ghost" to="/about">
              Who's this guy? <span className="arrow">→</span>
            </Link>
          </div>

          <ul className="hero-badges">
            <li className="badge badge-lime">✨ good vibes</li>
            <li className="badge badge-yellow">⚡ always tinkering</li>
            <li className="badge badge-pink">🎨 colorful by default</li>
            <li className="badge badge-blue">☕ served chill</li>
          </ul>
        </div>

        <HeroDog />
      </section>

      <div className="color-strip" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="section" id="experience">
        <div className="container">
          <Reveal>
            <p className="kicker">work history</p>
            <h2 className="section-title">Experience</h2>
          </Reveal>

          <div className="experience-grid">
            {experience.map((job, index) => (
              <Reveal delay={index * 100} key={job.company}>
                <article className={`experience-entry ${job.logoTone}`}>
                  <div className="experience-logo">{job.logo}</div>
                  <div className="experience-body">
                    <div className="experience-meta">
                      <h3 className="experience-role">{job.role}</h3>
                      <span className="experience-company">
                        {job.company} · {job.type}
                      </span>
                    </div>
                    <div className="experience-dates">
                      <span className="experience-date">{job.dates}</span>
                      <span className="experience-duration">{job.duration}</span>
                    </div>
                    <div className="experience-location">
                      <span className="experience-place">{job.location}</span>
                      <span className="experience-onsite">{job.onsite}</span>
                    </div>
                    {job.roleNote && (
                      <p className="experience-note">{job.roleNote}</p>
                    )}
                    <div className="experience-skills">
                      <span className="skill-bullet" aria-hidden="true">⋄</span>
                      <span className="skill-list">{job.skills}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="vibe">
        <div className="container">
          <Reveal>
            <p className="kicker">the vibe</p>
            <h2 className="section-title">Make yourself at home.</h2>
            <p className="section-sub">
              A quick tour of what this place is about — and what it
              definitely isn't.
            </p>
          </Reveal>

          <div className="vibe-grid">
            {vibeCards.map((card, index) => (
              <Reveal delay={index * 120} key={card.title}>
                <article className={`card ${card.tone}`}>
                  <span className="card-emoji" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cooking-card">
              <div className="cooking-copy">
                <p className="kicker">what's cooking</p>
                <h2 className="section-title">Good stuff is marinating.</h2>
                <p>
                  I'm still deciding what goes on these shelves. Projects,
                  experiments, little wins, maybe some questionable ideas —
                  all in good time.
                </p>
                <Link className="btn btn-ghost" to="/projects">
                  See the empty shelves <span className="arrow">→</span>
                </Link>
              </div>

              <div className="cooking-art" aria-hidden="true">
                <span className="art-question">?</span>
                <span className="art-sticker art-sticker-a">✶</span>
                <span className="art-sticker art-sticker-b">✿</span>
                <span className="art-sticker art-sticker-c">✦</span>
                <span className="art-sticker art-sticker-d">☺</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        items={[
          'Coming soon',
          'Colorful by design',
          'No page reloads',
          'Fresh ideas loading',
          'Chill zone',
        ]}
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>The shelves are still being stocked.</h2>
                <p>
                  Check back soon — or say hi in the meantime. I don't bite,
                  and the door's always open.
                </p>
              </div>
              <div className="cta-actions">
                <Link className="btn btn-dark" to="/contact">
                  Say hello <span className="arrow">→</span>
                </Link>
                <a
                  className="btn btn-outline-dark"
                  href="https://github.com/xbnikhil"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <span className="arrow">↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
