import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white mt-16 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Footer Grid */}
        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12">
          {/* About Section - Full width in mobile */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-800">KalimatiRate - Nyure</h3>
            <p className="text-gray-600 text-sm mt-4">
              Your trusted source for real-time vegetable prices and date conversion services. Making market information accessible to everyone.
            </p>
            <div className="flex items-center gap-4 justify-center sm:justify-start mt-4">
              <a 
                href="https://www.tiktok.com/@quiknepal" 
                target="_blank" 
                rel="noopener noreferrer nofollow" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/QuikNepal" 
                target="_blank" 
                rel="noopener noreferrer nofollow" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com/QuikNepal" 
                target="_blank" 
                rel="noopener noreferrer nofollow" 
                className="text-gray-600 hover:text-gray-800 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links and Contact Info Grid - Side by side in mobile */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2">
            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-gray-800 font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/kalimati-tarkari-rate-today')} className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    Today's Prices
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/nep-to-eng-date-converter')} className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    Date Converter
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/calendar')} className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    Calendar
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/blogs')} className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    Blogs
                  </button>
                </li>
                <li>
                  <a href="#faq" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#market-status" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                    Market Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h3 className="text-gray-800 font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:mail@nyure.com.np" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                    mail@nyure.com.np
                  </a>
                </li>
                <li>
                  <a href="tel:+977-9746265996" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                    +977-9746265996
                  </a>
                </li>
                <li className="text-gray-600 text-sm">
                  Kalimati, Kathmandu
                </li>
                <li className="text-gray-600 text-sm">
                  Nepal
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-green-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center sm:text-left">
              © 2024 KalimatiRate - Nyure. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-gray-600 hover:text-green-600 text-sm transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 