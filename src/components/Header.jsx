import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('rate') || query.includes('kalimati') || query.includes('price')) {
      navigate('/kalimati-tarkari-rate-today');
    } else if (query.includes('date') || query.includes('convert')) {
      navigate('/nep-to-eng-date-converter');
    } else if (query.includes('calendar') || query.includes('patro')) {
      navigate('/calendar');
    } else if (query.includes('blog') || query.includes('article')) {
      navigate('/blogs');
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white py-4 px-6 flex justify-between items-center border-b border-green-100">
      <div className="flex items-center">
        <a 
          href="https://kalimatirate.nyure.com.np" 
          className="flex items-center hover:opacity-90 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="Kalimati Rate Logo" 
            className="h-8 w-auto"
          />
        </a>
      </div>
      
      {/* Desktop Navigation - REORDERED */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Calendar First */}
        <button
          onClick={() => navigate('/calendar')}
          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
        >
          Calendar
        </button>
        {/* Other Links */}
        <button
          onClick={() => navigate('/kalimati-tarkari-rate-today')}
          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
        >
          Veg Prices
        </button>
        <button
          onClick={() => navigate('/nep-to-eng-date-converter')}
          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
        >
          Date Converter
        </button>
        <button
          onClick={() => navigate('/blogs')}
          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
        >
          Blogs
        </button>

        {/* Social Media Icons - Desktop Only */}
        <div className="flex items-center gap-4 mr-4">
          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@quiknepal" 
            target="_blank" 
            rel="noopener noreferrer nofollow" 
            className="hover:opacity-80 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <g>
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="black"/>
              </g>
            </svg>
          </a>
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/QuikNepal" 
            target="_blank" 
            rel="noopener noreferrer nofollow" 
            className="hover:opacity-80 transition-opacity"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* Twitter/X */}
          <a 
            href="https://twitter.com/QuikNepal" 
            target="_blank" 
            rel="noopener noreferrer nofollow" 
            className="hover:opacity-80 transition-opacity"
          >
            <svg className="w-5 h-5" fill="black" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-green-100 p-2 z-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full px-3 py-2 border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                autoFocus
              />
            </form>
          )}
        </div>
      </div>

      {/* Mobile Navigation - REORDERED */}
      <div className="flex md:hidden gap-4 items-center">
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-green-100 p-2 z-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full px-3 py-2 border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                autoFocus
              />
            </form>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-green-100 py-2 z-50">
              {/* Calendar First */}
              <button
                onClick={() => {
                  navigate('/calendar');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 transition-colors"
              >
                Calendar
              </button>
              {/* Other Links */}
              <button
                onClick={() => {
                  navigate('/kalimati-tarkari-rate-today');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 transition-colors"
              >
                Veg Prices
              </button>
              <button
                onClick={() => {
                  navigate('/nep-to-eng-date-converter');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 transition-colors"
              >
                Date Converter
              </button>
              <button
                onClick={() => {
                  navigate('/blogs');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 transition-colors"
              >
                Blogs
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 