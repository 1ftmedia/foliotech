import React from 'react';
import { Facebook, Linkedin, Instagram, Briefcase, Youtube } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Link, useNavigate } from 'react-router-dom';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Enhanced navigation handler that ensures smooth scroll to top for footer links
  const handleFooterNavigation = (to: string) => {
    // If it's an external link, let the browser handle it
    if (to.startsWith('http')) {
      console.log(`🔗 External link clicked: ${to}`);
      return;
    }
    
    // For internal navigation, ensure smooth scroll to top
    console.log(`🏠 Footer navigation to: ${to}`);
    navigate(to);
    
    // Smooth scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100); // Small delay to ensure navigation completes
  };

  return (
    <footer 
      className="bg-[#f8f9fa] dark:bg-[#1a1a1a] transition-colors duration-300"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center">
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
                  strokeOpacity="0.05"
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
                  strokeOpacity="0.05"
                />
                <text 
                  x="950" 
                  y="800" 
                  fontSize="350" 
                  fill="#000000" 
                  textAnchor="middle"
                >
                  ⚙️
                </text>
                <defs>
                  <filter id="filter0_ii_7_21" x="0.558533" y="0.851044" width="671.275" height="1017.65" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
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
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_7_21"/>
                  </filter>
                  <filter id="filter1_ii_7_21" x="236.932" y="221.45" width="853.526" height="794.754" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_7_21"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="25"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"/>
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_7_21"/>
                  </filter>
                </defs>
              </svg>
              <span className="ml-2 text-xl font-bold text-[#333333] dark:text-white transition-colors duration-300">
                FolioTech Institute
              </span>
            </div>
            <p className="mt-4 text-[#555555] dark:text-[#cccccc] transition-colors duration-300">
              Pursuing Excellence, with Passion and Integrity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { title: 'About Us', href: '/about' },
                { title: 'Apply Now', href: '/apply' }
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                      transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                      rounded hover:underline"
                    onClick={() => handleFooterNavigation(item.href)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { title: 'Volunteer to Teach', href: '/volunteer-to-teach' },
                { title: 'Hire Our Graduates', href: '/hire-a-graduate' },
                { title: 'Partnership Inquiry', href: '/partnership-inquiry' },
                { title: 'Sponsorships', href: '/sponsorships' },
                { title: 'FAQs', href: '/faq' }
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                      transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                      rounded hover:underline"
                    onClick={() => handleFooterNavigation(item.href)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Newsletter */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              {[
                { icon: Facebook, label: 'Facebook', url: 'https://web.facebook.com/FolioTechInstitute/' },
                { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/folahan-olumide-a2a93829/' },
                { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/foliotechinstitute' },
                { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@foliotechinstitute' },
                { icon: Briefcase, label: 'Careers', url: '/career-development' }
              ].map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith('http') ? "_blank" : undefined}
                  rel={url.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="text-[#555555] hover:text-[#0066cc] dark:text-[#cccccc] dark:hover:text-[#66b3ff] 
                    transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                    rounded-full p-1"
                  aria-label={`Visit our ${label} page`}
                  onClick={url.startsWith('http') ? undefined : () => handleFooterNavigation(url)}
                >
                  <Icon 
                    className="h-6 w-6 transform hover:scale-110 transition-transform duration-300 will-change-transform" 
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
            {/* Newsletter Form */}
            <div className="text-[#a3bffa] dark:text-[#a3bffa]">
              <p className="mb-2">Subscribe to our newsletter</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e5e5] dark:border-[#333333] transition-colors duration-300">
          <div className="text-center text-[#555555] dark:text-[#cccccc] transition-colors duration-300">
            <p>© {new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
            <p className="mt-2">
              Built and Engineered by{' '}
              <a
                href="https://www.kingstechstudio.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                  rounded"
              >
                Kings Tech Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
