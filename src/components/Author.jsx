import React from 'react';
import { urlFor } from '../services/sanity';
import { FaTwitter, FaLinkedin, FaGlobe } from 'react-icons/fa';

const Author = ({ author }) => {
  if (!author) return null;
  
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 bg-gray-50 rounded-lg mt-8">
      {author.image && (
        <img 
          src={urlFor(author.image).width(100).height(100).url()}
          alt={author.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
        />
      )}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg">{author.name}</h3>
        {author.position && (
          <p className="text-gray-600 text-sm mb-2">{author.position}</p>
        )}
        {author.bio && (
          <p className="text-gray-700 text-sm mb-3">{author.bio}</p>
        )}
        <div className="flex justify-center sm:justify-start gap-3">
          {author.twitter && (
            <a 
              href={`https://twitter.com/${author.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
              aria-label={`${author.name}'s Twitter profile`}
            >
              <FaTwitter size={18} />
            </a>
          )}
          {author.linkedin && (
            <a 
              href={author.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
              aria-label={`${author.name}'s LinkedIn profile`}
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {author.website && (
            <a 
              href={author.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900"
              aria-label={`${author.name}'s website`}
            >
              <FaGlobe size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Author; 