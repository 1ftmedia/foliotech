import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, User } from "lucide-react";
import { NavItem } from "../types";
import { useAuth } from "./auth/AuthProvider";
import { ThemeToggle, useTheme } from "./ThemeProvider";
import { MenuToggle } from './Navigation/MenuToggle';
import { MobileMenu } from './Navigation/MobileMenu';
import { AuthDialog } from './auth/AuthDialog';
import { toast } from 'react-hot-toast';
import { signOut } from '../lib/supabase/auth';
import { useTourContext } from '../context/TourContext';

const navItems: NavItem[] = [
  { title: "Programs", href: "/#featured-programs" },
  { title: "About", href: "/about" },
  { title: "Admissions", href: "#admissions" },
  {
    title: "Support",
    href: "#",
    children: [
      { title: "Sponsor a Student", href: "/sponsorships" },
      { title: "Donate Equipment", href: "/give" },
      { title: "Volunteer to Teach", href: "/volunteer-to-teach" },
      { title: "Partnership", href: "/partnership-inquiry" }
    ]
  },
  {
    title: "Careers",
    href: "#",
    children: [
      { title: "Career Tracks", href: "/career-development" },
      { title: "Hire a Graduate", href: "/hire-a-graduate" }
    ]
  },
  { title: "Contact", href: "#contact" },
];

export function Navigation() {
  console.log('Navigation component rendering...');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { startTour } = useTourContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Failed to sign out');
    }
  };

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveDropdown(null);

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        navigate('/', { state: { scrollTo: targetId } });
      }
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (location.pathname === path || (path === '/' && location.pathname === '')) {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  }, [location.pathname, navigate]);

  const handleStartTour = () => {
    startTour();
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "h-16 bg-white/98 dark:bg-gray-900/98 shadow-lg" 
            : "h-20 bg-white/95 dark:bg-gray-900/95"
        } backdrop-blur-[10px] border-b border-gray-200/15 dark:border-gray-700/15`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link 
  to="/" 
  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
  aria-label="FolioTech Institute home"
>
  <svg
    width="1151"
    height="1015"
    viewBox="0 0 1151 1015"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 transition-transform duration-300 hover:scale-110"
    aria-hidden="true"
  >
    <g filter="url(#filter0_ii_7_21)">
      <path 
        d="M655.709 251.834C706.565 181.091 631.119 37.973 460.668 10.22C367.339 0.968983 342.19 -3.92864 234.89 10.22C127.589 24.3686 2.40514 128.306 28.1127 286.662C57.3874 466.99 100.205 657.246 34.819 754.109C-43.5196 870.16 18.5238 1027.03 179.004 1013.14C244.914 1007.43 315.055 971.825 311.453 902.125C307.652 828.587 221.477 740.505 228.742 690.441C234.849 648.357 280.716 628.405 383.546 659.423C486.375 690.441 526.613 490.908 375.722 496.714C224.83 502.519 179.004 385.702 228.183 292.103C272.431 207.893 438.313 267.616 476.874 286.662C515.436 305.708 604.853 322.577 655.709 251.834Z" 
        fill="#6B2D26"
      />
    </g>
    <path 
      d="M655.709 251.834C706.565 181.091 631.119 37.973 460.668 10.22C367.339 0.968983 342.19 -3.92864 234.89 10.22C127.589 24.3686 2.40514 128.306 28.1127 286.662C57.3874 466.99 100.205 657.246 34.819 754.109C-43.5196 870.16 18.5238 1027.03 179.004 1013.14C244.914 1007.43 315.055 971.825 311.453 902.125C307.652 828.587 221.477 740.505 228.742 690.441C234.849 648.357 280.716 628.405 383.546 659.423C486.375 690.441 526.613 490.908 375.722 496.714C224.83 502.519 179.004 385.702 228.183 292.103C272.431 207.893 438.313 267.616 476.874 286.662C515.436 305.708 604.853 322.577 655.709 251.834Z" 
      stroke="black" 
      stroke-opacity="0.05"
    />
    <g filter="url(#filter1_ii_7_21)">
      <path 
        d="M470.727 310.605C536.672 336.726 596.652 330.459 669.121 297.001C798.776 237.142 860.766 199.24 977.051 237.142C1110.62 280.676 1117.88 399.85 1039.64 441.208C955.447 485.714 935.696 437.943 782.569 423.794C629.442 409.646 623.133 520.938 655.709 595.21C701.535 699.692 744.008 785.672 712.153 878.182C682.389 964.621 532.76 1079.53 415.959 960.896C299.158 842.266 474.08 698.059 530.525 569.089C558.135 506.002 509.288 462.975 376.28 468.961C243.273 474.947 219.5 381.205 248.302 314.959C280.716 240.407 404.782 284.485 470.727 310.605Z" 
        fill="#00AEEF"
      />
    </g>
    <path 
      d="M470.727 310.605C536.672 336.726 596.652 330.459 669.121 297.001C798.776 237.142 860.766 199.24 977.051 237.142C1110.62 280.676 1117.88 399.85 1039.64 441.208C955.447 485.714 935.696 437.943 782.569 423.794C629.442 409.646 623.133 520.938 655.709 595.21C701.535 699.692 744.008 785.672 712.153 878.182C682.389 964.621 532.76 1079.53 415.959 960.896C299.158 842.266 474.08 698.059 530.525 569.089C558.135 506.002 509.288 462.975 376.28 468.961C243.273 474.947 219.5 381.205 248.302 314.959C280.716 240.407 404.782 284.485 470.727 310.605Z" 
      stroke="black" 
      stroke-opacity="0.05"
    />
    <text 
      x="950" 
      y="800" 
      font-size="350" 
      fill="#000000" 
      text-anchor="middle"
    >
      ⚙️
    </text>
    <defs>
      <filter id="filter0_ii_7_21" x="0.558533" y="0.851044" width="671.275" height="1017.65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="25"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_7_21"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="25"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_7_21" result="effect2_innerShadow_7_21"/>
      </filter>
      <filter id="filter1_ii_7_21" x="236.932" y="221.45" width="853.526" height="794.754" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="25"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_7_21"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="25"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_7_21" result="effect2_innerShadow_7_21"/>
      </filter>
    </defs>
  </svg>
  <span className={`text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 ${
    isScrolled ? 'text-lg' : 'text-xl'
  } hover:text-shadow-glow`}>
    FolioTech Institute
  </span>
</Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  ref={item.children ? dropdownRef : null}
                  id={item.title === 'Support' ? 'support-nav-item' : undefined}
                >
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        aria-expanded={activeDropdown === item.title}
                        aria-haspopup="true"
                      >
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-[10px]"
                            role="menu"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                to={child.href}
                                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400"
                                role="menuitem"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              
              <ThemeToggle />
              
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4 flex-nowrap">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setShowAuthDialog(true);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthDialog(true);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Get Started
                  </button>
                </div>
              )}

              <button
                onClick={handleStartTour}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                aria-label="Start website tour"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <MenuToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={navItems}
          onSignIn={() => {
            setIsOpen(false);
            setAuthMode('signin');
            setShowAuthDialog(true);
          }}
          onSignUp={() => {
            setIsOpen(false);
            setAuthMode('signup');
            setShowAuthDialog(true);
          }}
          user={user}
          onSignOut={handleSignOut}
          onStartTour={() => {
            setIsOpen(false);
            startTour();
          }}
        />
      </nav>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultMode={authMode}
      />
    </>
  );
}
