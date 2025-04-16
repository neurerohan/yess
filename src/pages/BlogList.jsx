import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchSanityData, urlFor, formatDate } from "../services/sanity";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryList from "../components/CategoryList";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Fetch blogs with simplified query and error handling
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching blog posts...");
        
        // Build query based on whether a category filter is active
        let query;
        if (activeCategoryId) {
          console.log(`Fetching with category filter: ${activeCategoryId}`);
          query = `*[_type == "blogPost" && references("${activeCategoryId}")] | order(publishedAt desc) {
            _id,
            title,
            "slug": slug.current,
            publishedAt,
            excerpt,
            "readingTime": round(length(pt::text(body)) / 200),
            mainImage {
              asset-> {
                _id,
                url
              }
            },
            "author": author->{name, "slug": slug.current, image}
          }`;
        } else {
          // No category filter, get all blog posts
          query = `*[_type == "blogPost"] | order(publishedAt desc) {
            _id,
            title,
            "slug": slug.current,
            publishedAt,
            excerpt,
            "readingTime": round(length(pt::text(body)) / 200),
            mainImage {
              asset-> {
                _id,
                url
              }
            },
            "author": author->{name, "slug": slug.current, image}
          }`;
        }
        
        const data = await fetchSanityData(query);
        console.log(`Fetched ${data ? data.length : 0} blog posts`, data);
        setBlogs(data || []);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [activeCategoryId]);

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    console.log(`Setting active category: ${categoryId || 'none'}`);
    setActiveCategoryId(categoryId);
  };

  return (
    <>
      <Helmet>
        <title>Blog | Kalimati Rate</title>
        <meta
          name="description"
          content="Read our latest articles on vegetable prices, farming techniques, and market trends."
        />
      </Helmet>

      <Header />
      
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Blog</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The latest news, articles and resources on vegetable prices, farming techniques and market trends.
              </p>
            </div>

            {/* Category filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <CategoryList 
                activeCategoryId={activeCategoryId}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Blog List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="relative">
                      {blog.mainImage && blog.mainImage.asset ? (
                        <img
                          src={urlFor(blog.mainImage).width(600).height(340).url()}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full h-16"></div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                        {blog.title}
                      </h2>
                      {blog.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {formatDate(blog.publishedAt)}
                          </span>
                          {blog.readingTime && (
                            <span className="text-green-600">· {blog.readingTime} min read</span>
                          )}
                        </div>
                        {blog.author && (
                          <div className="flex items-center">
                            <span className="mr-2">By {blog.author.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {activeCategoryId 
                    ? "No posts found for this category. Try selecting a different category."
                    : "No blog posts have been published yet. Check back soon!"}
                </p>
                {activeCategoryId && (
                  <button
                    onClick={() => setActiveCategoryId(null)}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    View All Posts
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogList;
