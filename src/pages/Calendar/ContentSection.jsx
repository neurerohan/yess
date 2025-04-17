import React from 'react';

// Simple reusable component to display text content
const ContentSection = ({ title, children }) => {
  return (
    <div className="mt-12 max-w-4xl mx-auto text-left">
      {title && (
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          {title}
        </h3>
      )}
      <div className="prose prose-green sm:prose-lg max-w-none text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default ContentSection; 