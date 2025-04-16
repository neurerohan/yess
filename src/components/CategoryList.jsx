import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client, { fetchSanityData } from "../services/sanity";

const CategoryList = ({ activeCategoryId, onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories");
        const query = `*[_type == "category"]{
          _id,
          title,
          "slug": slug.current,
          description,
          "count": count(*[_type == "blogPost" && references(^._id)])
        } | order(title asc)`;
        
        const data = await fetchSanityData(query);
        setCategories(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryClick && onCategoryClick(category._id)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategoryId === category._id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.title} {category.count > 0 && <span>({category.count})</span>}
          </button>
        ))}
        {activeCategoryId && (
          <button
            onClick={() => onCategoryClick && onCategoryClick(null)}
            className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList; 