'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { createReview, deleteReview } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Star, Trash2 } from 'lucide-react';
import type { Review } from '@/types/listing';

interface Props {
  listingId: string;
  reviews: Review[];
}

export default function ReviewSection({ listingId, reviews }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to leave a review.');
      return;
    }

    setLoading(true);
    try {
      await createReview(listingId, { rating, comment });
      setRating(5);
      setComment('');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm('Delete this review?')) {
      try {
        await deleteReview(listingId, reviewId);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h2 className="font-display text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
        Guest reviews
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-white/10">
          <h3 className="text-sm font-semibold mb-3 text-white/80">Leave a Review</h3>
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  fill={star <= rating ? 'var(--gold)' : 'none'}
                  color={star <= rating ? 'var(--gold)' : 'var(--text-faint)'}
                />
              </button>
            ))}
          </div>

          <textarea
            required
            rows={3}
            placeholder="Share your experience..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm px-6 py-2"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {!reviews || reviews.length === 0 ? (
        <p className="text-white/40 text-sm">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                paddingBottom: 20,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < review.rating ? 'var(--gold)' : 'none'}
                      style={{ color: i < review.rating ? 'var(--gold)' : 'var(--text-faint)' }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {review.author?.username ?? 'Anonymous'} ·{' '}
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  {user && user._id === (review.author?._id || review.author) && (
                    <button 
                      onClick={() => handleDelete(review._id)}
                      className="text-red-400/70 hover:text-red-400 transition-colors p-1"
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
