import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function About() {
  return (
    <>
      <section className="page-hero page-hero-lime">
        <div className="container">
          <p className="kicker">about</p>
          <h1 className="page-title">
            Hi, I'm <span className="accent-word">Nikhil</span>.
          </h1>
          <p className="page-sub">
            This page is still a blank canvas — but here's the honest version
            for now.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-intro">
            <Reveal>
              <figure className="portrait">
                <img
                  src="/assets/profile.png"
                  alt="Portrait of Nikhil"
                  width="340"
                  height="340"
                  loading="lazy"
                />
              </figure>
            </Reveal>

            <Reveal delay={120}>
              <article className="paper-card">
                <h2>Under construction, on purpose.</h2>
                <p>
                  I'm still figuring out exactly what this little corner of the
                  internet should be. What I do know: it won't be the usual
                  “passionate world-class developer” wall of text.
                </p>
                <p>
                  When there's a real story to tell — background, what I'm
                  into, what I'm building — it'll land right here. Until then,
                  enjoy the colors.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="fun-grid">
              <div className="card card-lilac">
                <span className="card-emoji" aria-hidden="true">
                  🎧
                </span>
                <h3>Currently</h3>
                <p>Collecting ideas and a suspicious amount of browser tabs.</p>
              </div>
              <div className="card card-lime">
                <span className="card-emoji" aria-hidden="true">
                  📚
                </span>
                <h3>Learning</h3>
                <p>New tools, better patterns, and how to build calmer UI.</p>
              </div>
              <div className="card card-peach">
                <span className="card-emoji" aria-hidden="true">
                  ☕
                </span>
                <h3>Off-screen</h3>
                <p>Coffee, walks, and pretending I'll start journaling.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="section-cta">
              <Link className="btn btn-primary" to="/contact">
                Say hi <span className="arrow">→</span>
              </Link>
              <Link className="btn btn-ghost" to="/projects">
                Peek at projects <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
