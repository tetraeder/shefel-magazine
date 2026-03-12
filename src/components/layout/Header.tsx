import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';

const navLinks = [
  { to: '/', label: 'מדיה' },
  { to: '/magazine', label: 'מגזין שפל' },
  { to: '/90seconds', label: 'פסטיבל 90 שניות' },
  { to: '/about', label: 'עלינו' },
  { to: '/contact', label: 'דברו איתנו' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-shefel-yellow border-b-4 border-shefel-red px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between relative">
        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="תפריט"
        >
          <span
            className={`block w-6 h-0.5 bg-shefel-red transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-shefel-red transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-shefel-red transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
          />
        </button>

        {/* Mobile center logo — temporarily hidden until new logo is ready */}
        {/* <Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
          <img
            src="/Asset 1@4x-100.jpg"
            alt="כדורגל שפל"
            className="h-14 mix-blend-multiply"
          />
        </Link> */}

        {/* Desktop: logo + all nav links + socials in one row */}
        <nav className="hidden md:flex items-center gap-4 w-full flex-nowrap">
          {/* Logo temporarily hidden until new logo is ready */}
          {/* <Link to="/" className="shrink-0 ml-2">
            <img
              src="/Asset 1@4x-100.jpg"
              alt="כדורגל שפל"
              className="h-10 mix-blend-multiply"
            />
          </Link> */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body font-bold text-base whitespace-nowrap hover:text-shefel-black transition-colors no-underline ${
                location.pathname === link.to ? 'text-shefel-black' : 'text-shefel-red'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex-1" />
          <SocialLinks
            showLabels
            labelType="desktop"
            className="flex items-center gap-3"
            linkClassName="flex items-center gap-1 text-shefel-red hover:text-shefel-black transition-colors no-underline font-body text-sm font-bold whitespace-nowrap"
            iconClassName="w-4 h-4"
          />
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="menu-overlay md:hidden fixed inset-0 top-[68px] bg-shefel-red z-50 flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`menu-link font-display font-black text-3xl no-underline transition-colors ${location.pathname === link.to
                  ? 'text-shefel-black'
                  : 'text-shefel-yellow hover:text-shefel-white'
                }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
