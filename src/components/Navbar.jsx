import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About', end: false },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-logo" aria-label="little corner — home">
          <span className="nav-logo-mark" aria-hidden="true">
            <span className="mark-block mark-x">x</span>
            <span className="mark-block mark-b">b</span>
            <span className="mark-block mark-dot">.</span>
          </span>
          <span className="nav-logo-text">little corner</span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="btn btn-primary btn-small nav-cta">
          Say hi <span className="arrow">→</span>
        </Link>
      </div>
    </header>
  )
}
