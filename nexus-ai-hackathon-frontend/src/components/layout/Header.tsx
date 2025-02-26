import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#apps">Our Apps</NavLink>
            <NavLink href="#about">About Us</NavLink>
            <NavLink href="#team">Team</NavLink>
            <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all">
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden"
            >
              <div className="fixed inset-0 bg-white z-40">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col gap-6">
                    <MobileNavLink href="#home" onClick={toggleMenu}>Home</MobileNavLink>
                    <MobileNavLink href="#apps" onClick={toggleMenu}>Our Apps</MobileNavLink>
                    <MobileNavLink href="#about" onClick={toggleMenu}>About Us</MobileNavLink>
                    <MobileNavLink href="#team" onClick={toggleMenu}>Team</MobileNavLink>
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-pink-500 after:transition-all"
  >
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string; onClick: () => void; children: React.ReactNode }> = ({
  href,
  onClick,
  children,
}) => (
  <a
    href={href}
    onClick={onClick}
    className="text-2xl text-gray-800 font-semibold hover:text-primary-500 transition-colors text-center"
  >
    {children}
  </a>
);

const MenuIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className="w-6 h-6 relative">
    <span
      className={`absolute left-0 block h-0.5 w-full bg-gray-800 transform transition-all duration-300 ${
        isOpen ? 'rotate-45 top-3' : 'top-1'
      }`}
    />
    <span
      className={`absolute left-0 block h-0.5 bg-gray-800 transform transition-all duration-300 ${
        isOpen ? 'opacity-0 -translate-x-2 top-3' : 'opacity-100 top-3 w-full'
      }`}
    />
    <span
      className={`absolute left-0 block h-0.5 w-full bg-gray-800 transform transition-all duration-300 ${
        isOpen ? '-rotate-45 top-3' : 'top-5'
      }`}
    />
  </div>
); 