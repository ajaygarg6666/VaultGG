import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReviewSection = ({ gameId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewsAPI.getByGame(gameId);
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to post a review');
      return;
    }
    setSubmitting(true);
    try {
      await reviewsAPI.create({ gameId, rating: Number(rating), reviewText });
      toast.success('Review posted!');
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId, helpful) => {
    if (!user) {
      toast.error('You must be logged in to vote');
      return;
    }
    try {
      await reviewsAPI.vote(reviewId, helpful);
      fetchReviews();
    } catch (err) {
      toast.error('You already voted on this review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        User Reviews ({reviews.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '20px', marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>Post a Review</h4>
          <div className="form-group">
            <label className="form-label">Rating (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              className="form-control" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Review</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)} 
              required 
              placeholder="What do you think about this game?"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      ) : (
        <div className="card" style={{ padding: '20px', marginBottom: '30px', textAlign: 'center' }}>
          <p>Please log in to post a review.</p>
        </div>
      )}

      <div className="flex gap-md" style={{ flexDirection: 'column' }}>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => {
            const upvotes = review.votes?.filter(v => v.helpful).length || 0;
            const downvotes = review.votes?.filter(v => !v.helpful).length || 0;
            
            return (
              <div key={review._id} className="card animate-fade-in" style={{ padding: '20px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '15px' }}>
                  <div className="flex items-center gap-sm">
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <strong>{review.userId?.username || 'Unknown User'}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '10px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.15)', color: 'var(--warning)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                    ★ {review.rating}/5
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-primary)' }}>{review.reviewText}</p>
                
                <div className="flex items-center gap-md" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Was this review helpful?</span>
                  <button onClick={() => handleVote(review._id, true)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
                    👍 Yes ({upvotes})
                  </button>
                  <button onClick={() => handleVote(review._id, false)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
                    👎 No ({downvotes})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
