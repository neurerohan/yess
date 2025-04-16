import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Extracts heading content from Portable Text blocks
 * @param {Array} blocks - Portable Text blocks
 * @returns {Array} - Array of heading objects with id, text, and level
 */
const extractHeadings = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return [];
  
  return blocks
    .filter(block => 
      block._type === 'block' && 
      ['h1', 'h2', 'h3', 'h4'].includes(block.style) &&
      block.children &&
      block.children.length > 0 &&
      block.children[0].text
    )
    .map(heading => {
      const id = heading.children[0].text.replace(/\s+/g, '-').toLowerCase();
      return {
        id,
        text: heading.children[0].text,
        level: parseInt(heading.style.substring(1))
      };
    });
};

const TableOfContents = ({ blocks }) => {
  const headings = extractHeadings(blocks);
  
  if (headings.length === 0) return null;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li 
              key={index} 
              className={`${heading.level === 2 ? 'pl-0' : heading.level === 3 ? 'pl-4' : 'pl-8'}`}
            >
              <a 
                href={`#${heading.id}`}
                className="text-green-600 hover:text-green-800 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents; 