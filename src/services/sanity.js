import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity configuration
const projectId = "omn0qhtn";
const dataset = "blogs"; // NOT 'production'
const apiVersion = "2023-05-03";

// Initialize the Sanity client
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

/**
 * Helper function to fetch data from Sanity with better error handling
 * @param {String} query - GROQ query
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} - Promise that resolves to the query result
 */
export const fetchSanityData = async (query, params = {}) => {
  try {
    console.log("SANITY QUERY:", query);
    console.log("PARAMS:", params);
    
    const result = await client.fetch(query, params);
    console.log("QUERY RESULT:", result);
    return result;
  } catch (error) {
    console.error("SANITY FETCH ERROR:", error);
    throw error;
  }
};

/**
 * Helper function to get image URL from Sanity image reference
 * @param {Object} source - Sanity image source
 * @returns {Function} - Function to generate image URL
 */
export const urlFor = (source) => {
  if (!source || !source.asset) {
    console.error("Invalid image source:", source);
    return { url: () => "" };
  }
  return builder.image(source);
};

/**
 * Format date string to readable format
 * @param {String} dateString - ISO date string
 * @returns {String} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Calculates estimated reading time based on text length
 * @param {String} text - The content text
 * @param {Number} wordsPerMinute - Reading speed in words per minute
 * @returns {Number} - Estimated reading time in minutes
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes || 1; // Return at least 1 minute
};

/**
 * Gets a complete URL to the Sanity Studio dashboard for a document
 * @param {String} documentId - Sanity document ID
 * @returns {String} - URL to edit the document in Sanity Studio
 */
export const getSanityEditUrl = (documentId) => {
  return `https://kalimatirate.sanity.studio/desk/${documentId}`;
};

/**
 * Direct debugging function to check schema and documents
 * This will expose helpful diagnostics about the Sanity connection
 */
export const debugSanityConnection = async () => {
  try {
    console.log("======= SANITY CONNECTION DIAGNOSTICS =======");
    console.log("Client configuration:", {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      useCdn: client.config().useCdn
    });
    
    // Test connection by getting all document types - using simpler GROQ query
    try {
      // This simpler query should work with older Sanity versions too
      const allTypes = await client.fetch(`*[defined(_type)] {_type} | order(_type asc)`);
      const uniqueTypes = [...new Set(allTypes.map(item => item._type))];
      console.log("Available document types:", uniqueTypes);
    } catch (typeError) {
      console.error("Error fetching document types:", typeError);
    }
    
    // Check for blogPost documents
    try {
      const blogPostCount = await client.fetch(`count(*[_type == "blogPost"])`);
      console.log(`Found ${blogPostCount} blogPost documents`);
      
      if (blogPostCount > 0) {
        // Get all blogPost documents with basic info
        const blogPosts = await client.fetch(`*[_type == "blogPost"]{
          _id, 
          title, 
          "slug": slug.current,
          "hasAuthor": defined(author),
          "authorRef": author._ref,
          "hasBody": defined(body),
          "hasCategories": defined(categories) && count(categories) > 0,
          _createdAt
        }`);
        console.log("Blog posts:", blogPosts);
        
        // Check schema field names for a blogPost
        if (blogPosts.length > 0) {
          const firstPost = await client.fetch(`*[_type == "blogPost"][0]{...}`);
          console.log("Sample blogPost schema:", Object.keys(firstPost));
          
          // Check if author references exist
          if (firstPost.author && firstPost.author._ref) {
            const author = await client.fetch(`*[_type == "author" && _id == $id][0]`, {id: firstPost.author._ref});
            console.log("Author reference resolves to:", author ? "Found" : "Not found", author);
          }
        }
      }
    } catch (blogError) {
      console.error("Error fetching blog posts:", blogError);
    }
    
    // Try to check for draft documents
    try {
      const draftCount = await client.fetch(`count(*[_id match "drafts.*"])`);
      console.log(`Found ${draftCount} draft documents (may require auth token to access)`);
    } catch (draftError) {
      console.error("Error checking drafts:", draftError);
    }
    
    console.log("======= DIAGNOSTICS COMPLETE =======");
    return "Diagnostics complete - check console for details";
  } catch (error) {
    console.error("DIAGNOSTICS ERROR:", error);
    return `Diagnostics failed: ${error.message}`;
  }
};

/**
 * Function to directly check for a specific blog post by slug
 */
export const checkSpecificBlogPost = async (slug) => {
  try {
    console.log(`======= CHECKING SPECIFIC BLOG POST: "${slug}" =======`);
    
    // First check if there are ANY blog posts at all
    const totalPosts = await client.fetch(`count(*[_type == "blogPost"])`);
    console.log(`Total blog posts in dataset: ${totalPosts}`);
    
    // Check for case sensitivity issues - try lowercase
    const lowerSlug = slug.toLowerCase();
    console.log(`Checking with lowercase slug: "${lowerSlug}"`);
    const lowerMatch = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{ _id, title, slug }`,
      { slug: lowerSlug }
    );
    
    // Check if the post might be in draft status
    console.log("Checking for draft version...");
    const draftMatch = await client.fetch(
      `*[_id match "drafts.*" && _type == "blogPost" && slug.current == $slug][0]{ _id, title, slug }`,
      { slug }
    );
    if (draftMatch) {
      console.log("Found a DRAFT version of this post:", draftMatch);
      console.log("This post needs to be published in Sanity Studio");
    }
    
    // First try an exact match
    const exactMatch = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{ 
        _id, 
        title, 
        slug,
        _createdAt,
        _updatedAt,
        publishedAt
      }`,
      { slug }
    );
    console.log("Exact match result:", exactMatch);
    
    // Then try a fuzzy match to see if the slug might be slightly different
    console.log("Checking for similar slugs...");
    const allSlugs = await client.fetch(
      `*[_type == "blogPost" && defined(slug.current)]{ _id, title, "slug": slug.current }`
    );
    console.log("All available slugs:", allSlugs);
    
    // Check for partially matching slugs
    const similarSlugs = allSlugs.filter(post => 
      post.slug && post.slug.includes(slug.substring(0, 5))
    );
    if (similarSlugs.length > 0) {
      console.log("Found similar slugs that might match:", similarSlugs);
    }
    
    // If exact match found, check details
    if (exactMatch && exactMatch._id) {
      console.log("Post found! Checking details...");
      
      // Check full document data
      const fullDocument = await client.fetch(
        `*[_id == $id][0]`, 
        { id: exactMatch._id }
      );
      console.log("Full document data:", fullDocument);
      
      // Check if it has a valid author reference
      if (fullDocument.author && fullDocument.author._ref) {
        const author = await client.fetch(
          `*[_type == "author" && _id == $id][0]{ _id, name }`, 
          { id: fullDocument.author._ref }
        );
        console.log("Author reference:", author || "Not found");
      } else {
        console.log("Missing or invalid author reference");
      }
      
      // Check if it has required fields for display
      const missingFields = [];
      ['title', 'slug', 'body', 'mainImage'].forEach(field => {
        if (!fullDocument[field]) missingFields.push(field);
      });
      
      if (missingFields.length > 0) {
        console.log("Missing required fields:", missingFields);
      } else {
        console.log("All required fields are present!");
      }
    } else {
      console.log("Post not found! Possible issues:");
      console.log("1. The slug might be different from what you expect");
      console.log("2. The post might be in draft status (not published)");
      console.log("3. The document might not have a slug field at all");
      console.log("4. There might be a permission issue accessing the document");
    }
    
    console.log(`======= CHECK COMPLETE =======`);
    return "Check complete - see console for details";
  } catch (error) {
    console.error("ERROR CHECKING BLOG POST:", error);
    return `Check failed: ${error.message}`;
  }
};

export default client;
