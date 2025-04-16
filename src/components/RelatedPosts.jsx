import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSanityData, urlFor, formatDate } from '../services/sanity';

const RelatedPosts = ({ currentPostId, categories = [] }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentPostId || !categories.length) {
      setLoading(false);
      return;
    }

    // Fetch related posts based on categories
    const categoryRefs = categories.map(cat => cat._ref);
    
    setLoading(true);
    setError(null);

    const fetchRelatedPosts = async () => {
      try {
        console.log(`Fetching related posts for post ID: ${currentPostId}`);
        const query = `*[_type == "blogPost" && _id != $currentPostId && count((categories[]->_id)[@ in $categoryRefs]) > 0][0...3]{
          _id,
          title,
          slug,
          publishedAt,
          mainImage {
            asset-> {
              _id,
              url
            }
          }
        }`;
        
        const data = await fetchSanityData(query, { currentPostId, categoryRefs });
        setRelatedPosts(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching related posts:', err);
        setError('Failed to load related posts');
        setLoading(false);
      }
    };
    
    fetchRelatedPosts();
  }, [currentPostId, categories]);

  if (loading) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!relatedPosts.length) {
    return null;
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link 
            key={post._id}
            to={`/blog/${post.slug.current}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.mainImage && post.mainImage.asset && (
              <img 
                src={urlFor(post.mainImage).width(400).height(240).url()}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
              {post.publishedAt && (
                <p className="text-sm text-gray-500">
                  {formatDate(post.publishedAt)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts; 