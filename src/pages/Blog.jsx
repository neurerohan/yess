import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchSanityData, urlFor, formatDate } from "../services/sanity";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PortableText from "../components/PortableText";
import Author from "../components/Author";
import SocialShare from "../components/SocialShare";
import Comments from "../components/Comments";
import RelatedPosts from "../components/RelatedPosts";
import { FaClock, FaCalendarAlt, FaTag, FaChevronLeft } from "react-icons/fa";

const Blog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    
    const fetchBlogPost = async () => {
      if (!slug) {
        setError("Invalid blog post URL");
        setLoading(false);
        return;
      }
      
      try {
        console.log(`FETCHING BLOG POST WITH SLUG: "${slug}"`);
        
        // Simplified query with better structure
        const query = `*[_type == "blogPost" && slug.current == $slug][0]{
          _id,
          title,
          "slug": slug.current,
          mainImage{
            asset->{
              _id,
              url
            }
          },
          body,
          excerpt,
          publishedAt,
          "estimatedReadingTime": round(length(pt::text(body)) / 200),
          "author": author->{
            _id,
            name,
            "slug": slug.current,
            bio,
            position,
            image,
            twitter,
            linkedin,
            website
          },
          "categories": categories[]->{
            _id,
            title,
            description
          }
        }`;
        
        const data = await fetchSanityData(query, { slug });
        console.log("BLOG POST RESULT:", data);
        
        if (!data) {
          console.log(`No blog post found with slug: "${slug}"`);
          // Try to find if the post exists with a different slug
          const similarPostsQuery = `*[_type == "blogPost"]{title, "slug": slug.current}[0...5]`;
          const availablePosts = await fetchSanityData(similarPostsQuery);
          console.log("Available posts:", availablePosts);
          
          setError(`Blog post not found. The post with slug "${slug}" doesn't exist.`);
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(`Failed to load the blog post. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [slug]);

  // Create SEO metadata
  const pageTitle = blog ? `${blog.title} | Kalimati Rate` : "Blog | Kalimati Rate";
  const pageDescription = blog?.excerpt || "Read our latest articles on vegetable prices, farming techniques, and market trends.";
  const pageImage = blog?.mainImage ? urlFor(blog.mainImage).width(1200).height(630).url() : "";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {blog && (
          <>
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content="article" />
            {pageImage && <meta property="og:image" content={pageImage} />}
          </>
        )}
      </Helmet>

      <Header />

      <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back to blogs link */}
            <Link 
              to="/blogs" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors duration-300 group"
            >
              <FaChevronLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to all blogs</span>
            </Link>

            {loading ? (
              <div className="flex justify-center items-center py-32 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-xl shadow-sm mb-8 border border-red-100">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="mb-6">{error}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/blogs")}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 font-medium transition-colors duration-300"
                  >
                    Return to Blogs
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors duration-300 shadow-sm hover:shadow"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : blog ? (
              <>
                <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
                  {/* Featured image */}
                  {blog.mainImage && blog.mainImage.asset && (
                    <div className="relative h-72 md:h-96 w-full overflow-hidden">
                      <img
                        src={urlFor(blog.mainImage).width(1200).height(675).url()}
                        alt={blog.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                        <div className="p-6 md:p-10 w-full">
                          {/* Categories on image */}
                          {blog.categories && blog.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {blog.categories.map((category) => (
                                <Link
                                  key={category._id}
                                  to={`/blogs?category=${category._id}`}
                                  className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-sm"
                                >
                                  {category.title}
                                </Link>
                              ))}
                            </div>
                          )}
                          {/* Title on image */}
                          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                            {blog.title}
                          </h1>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 md:p-10">
                    {/* If no featured image, show title and categories here */}
                    {(!blog.mainImage || !blog.mainImage.asset) && (
                      <>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                          {blog.title}
                        </h1>
                        {blog.categories && blog.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {blog.categories.map((category) => (
                              <Link
                                key={category._id}
                                to={`/blogs?category=${category._id}`}
                                className="bg-green-100 text-green-700 text-sm px-4 py-1.5 rounded-full hover:bg-green-200 transition-colors duration-300"
                              >
                                {category.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Blog meta info */}
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-10 border-b border-gray-100 pb-6">
                      {blog.publishedAt && (
                        <div className="flex items-center mr-6 mb-2">
                          <FaCalendarAlt className="mr-2 text-green-600" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      )}
                      
                      {blog.estimatedReadingTime && (
                        <div className="flex items-center mr-6 mb-2">
                          <FaClock className="mr-2 text-green-600" />
                          <span>{blog.estimatedReadingTime} min read</span>
                        </div>
                      )}
                      
                      {blog.author && (
                        <div className="flex items-center mb-2 ml-auto">
                          <span className="mr-2 text-gray-500">By</span>
                          <span className="font-medium text-gray-800">{blog.author.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Excerpt if available */}
                    {blog.excerpt && (
                      <div className="mb-10 bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
                        <p className="text-lg text-gray-700 font-medium italic">
                          {blog.excerpt}
                        </p>
                      </div>
                    )}
                    
                    {/* Blog content */}
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-p:text-gray-600 prose-img:rounded-lg prose-hr:border-gray-200">
                      {blog.body && <PortableText value={blog.body} />}
                    </div>
                    
                    {/* Tags */}
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="mt-12 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 tracking-wider">Tagged with:</h3>
                        <div className="flex flex-wrap gap-2">
                          {blog.categories.map((category) => (
                            <Link
                              key={category._id}
                              to={`/blogs?category=${category._id}`}
                              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors duration-300"
                            >
                              {category.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Social sharing */}
                    <div className="mt-10 bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">Share this article</h3>
                      <SocialShare title={blog.title} url={window.location.href} />
                    </div>
                  </div>
                </article>
                
                {/* Author bio */}
                {blog.author && (
                  <div className="mt-10">
                    <Author author={blog.author} />
                  </div>
                )}
                
                {/* Related posts */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="mt-16">
                    <RelatedPosts currentPostId={blog._id} categories={blog.categories} />
                  </div>
                )}
                
                {/* Comments section */}
                <div className="mt-16 bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-100">
                  <Comments postId={blog._id} />
                </div>
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Blog post not found</h2>
                <p className="text-gray-600 mb-10 max-w-md mx-auto">The post you're looking for doesn't seem to exist.</p>
                <Link
                  to="/blogs"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors duration-300 inline-block shadow-sm hover:shadow"
                >
                  Browse All Articles
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
