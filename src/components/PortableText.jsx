import React from 'react';
import { PortableText as PortableTextComponent } from '@portabletext/react';
import { Link } from 'react-router-dom';
import { urlFor } from '../services/sanity';

const PortableText = ({ value }) => {
  const components = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) {
          return null;
        }
        return (
          <figure className="my-8">
            <img
              src={urlFor(value)
                .width(800)
                .quality(90)
                .auto('format')
                .url()}
              alt={value.alt || ''}
              className="rounded-lg mx-auto"
            />
            {value.caption && (
              <figcaption className="text-center text-sm mt-2 text-gray-600 italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      callout: ({ value }) => {
        return (
          <div className={`p-4 my-6 rounded-lg border-l-4 border-${value.tone || 'blue'}-500 bg-${value.tone || 'blue'}-50`}>
            <p className="text-gray-800">{value.text}</p>
          </div>
        );
      },
      youtube: ({ value }) => {
        const { url } = value;
        const id = url
          ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]
          : null;
        
        if (!id) return null;
        
        return (
          <div className="relative my-8 pb-[56.25%] h-0 rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      },
      code: ({ value }) => {
        return (
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-6">
            <code className="text-sm">{value.code}</code>
          </pre>
        );
      },
    },
    marks: {
      link: ({ children, value }) => {
        const { href } = value;
        const isInternalLink = href && href.startsWith('/');
        
        if (isInternalLink) {
          return (
            <Link 
              to={href} 
              className="text-green-600 hover:text-green-800 underline"
            >
              {children}
            </Link>
          );
        }
        
        return (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-green-600 hover:text-green-800 underline"
          >
            {children}
          </a>
        );
      },
      internalLink: ({ children, value }) => {
        return (
          <Link 
            to={`/blog/${value.slug.current}`} 
            className="text-green-600 hover:text-green-800 underline"
          >
            {children}
          </Link>
        );
      },
    },
    block: {
      h1: ({ children }) => <h1 className="text-3xl font-bold mt-12 mb-4">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4" id={children[0].replace(/\s+/g, '-').toLowerCase()}>{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4">{children}</h3>,
      h4: ({ children }) => <h4 className="text-lg font-bold mt-6 mb-4">{children}</h4>,
      normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-green-500 pl-4 italic my-6 text-gray-700">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc ml-6 my-4">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal ml-6 my-4">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="my-1">{children}</li>,
      number: ({ children }) => <li className="my-1">{children}</li>,
    },
  };

  return <PortableTextComponent value={value} components={components} />;
};

export default PortableText; 