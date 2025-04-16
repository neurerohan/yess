import React, { useState, useEffect } from 'react';
import { fetchSanityData, formatDate } from '../services/sanity';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({ name: '', email: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch comments for this post
  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for post ID: ${postId}`);
        const query = `*[_type == "comment" && blogPost._ref == $postId && approved == true] | order(publishedAt desc) {
          _id,
          name,
          comment,
          publishedAt
        }`;
        
        const data = await fetchSanityData(query, { postId });
        setComments(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Could not load comments');
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newComment.name || !newComment.email || !newComment.comment) {
      setSubmitError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // This would normally be handled by a serverless function
      // For a client-only approach, you could use Sanity's API with write tokens
      // but it's recommended to use a server endpoint for security
      
      // Simulating submission - in production, replace with actual API call
      setTimeout(() => {
        // Reset form on successful submission
        setNewComment({ name: '', email: '', comment: '' });
        setSubmitSuccess(true);
        setSubmitting(false);
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1000);
      
    } catch (err) {
      console.error('Error submitting comment:', err);
      setSubmitError('Failed to submit comment. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>
      
      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{comment.name}</h4>
                {comment.publishedAt && (
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.publishedAt)}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{comment.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic">No comments yet. Be the first to share your thoughts!</p>
      )}

      {/* Comment form */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-4">Leave a comment</h4>
        
        {submitSuccess ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
            Thank you for your comment! It will appear after moderation.
          </div>
        ) : null}
        
        {submitError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {submitError}
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newComment.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email * (will not be published)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newComment.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment *
            </label>
            <textarea
              id="comment"
              name="comment"
              value={newComment.comment}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments; 