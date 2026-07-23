import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ReviewPage.css';

function scoreTier(rating) {
  if (rating >= 4) return 'high';
  if (rating === 3) return 'mid';
  return 'low';
}

function formatVibe(vibe) {
  if (!vibe) return null;
  const label = vibe.charAt(0).toUpperCase() + vibe.slice(1);
  return `${label} vibe`;
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDorm, setFilterDorm] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`);
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setReviews(sorted);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError("We couldn't load reviews right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const dormNames = useMemo(() => {
    const names = reviews.map((r) => r.dorm?.name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [reviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const average = sum / total;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
    });
    return { total, average, distribution };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    let list = reviews;
    if (filterDorm !== 'all') {
      list = list.filter((r) => r.dorm?.name === filterDorm);
    }
    const withIndex = list.map((r, i) => ({ r, i }));
    withIndex.sort((a, b) => {
      if (sortBy === 'highest') {
        return b.r.rating - a.r.rating || a.i - b.i;
      }
      if (sortBy === 'lowest') {
        return a.r.rating - b.r.rating || a.i - b.i;
      }
      return a.i - b.i; // already sorted most-recent-first
    });
    return withIndex.map(({ r }) => r);
  }, [reviews, filterDorm, sortBy]);

  return (
    <div className="reviews-page">
      <div className="reviews-main">
        <header className="reviews-header-block">
          <h1>Dorm Reviews</h1>
          <p className="reviews-subtitle">
            Real experiences from students to help you choose where to live.
          </p>
        </header>

        {loading && (
          <div className="reviews-status" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true"></span>
            Loading reviews…
          </div>
        )}

        {!loading && error && (
          <div className="reviews-alert" role="alert">
            <p>{error}</p>
            <button type="button" className="retry-btn" onClick={fetchReviews}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="empty-reviews">
            <p>No dorm reviews yet. Be the first to share your experience!</p>
            <Link to="/rate" className="empty-cta">Write a Review</Link>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && stats && (
          <div className="reviews-content">
            <section className="reviews-summary" aria-label="Ratings summary">
              <div className="summary-score">
                <span className="summary-score-number">{stats.average.toFixed(1)}</span>
                <span className="summary-score-max">/5</span>
              </div>
              <div className="summary-score-side">
                <span
                  className="stars summary-stars"
                  role="img"
                  aria-label={`Average rating ${stats.average.toFixed(1)} out of 5 stars`}
                >
                  {'★'.repeat(Math.round(stats.average))}
                  {'☆'.repeat(Math.max(0, 5 - Math.round(stats.average)))}
                </span>
                <span className="summary-count">
                  Based on {stats.total} review{stats.total !== 1 ? 's' : ''}
                  {dormNames.length > 0 ? ` across ${dormNames.length} dorm${dormNames.length !== 1 ? 's' : ''}` : ''}
                </span>
              </div>
              <div className="summary-bars" aria-hidden="true">
                {stats.distribution.map(({ star, count, pct }) => (
                  <div className="summary-bar-row" key={star}>
                    <span className="summary-bar-label">{star}★</span>
                    <div className="summary-bar-track">
                      <div className="summary-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="summary-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="reviews-controls">
              <label className="control-label">
                Dorm
                <select
                  value={filterDorm}
                  onChange={(e) => setFilterDorm(e.target.value)}
                >
                  <option value="all">All dorms</option>
                  {dormNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>

              <label className="control-label">
                Sort by
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most recent</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </label>

              <p className="reviews-count" aria-live="polite">
                Showing {visibleReviews.length} of {stats.total}
              </p>
            </div>

            <ul className="reviews-feed">
              {visibleReviews.map((review) => {
                const dormName = review.dorm ? review.dorm.name : 'Unknown Dorm';
                const rating = review.rating || 0;
                const tier = scoreTier(rating);
                const dateLabel = review.date
                  ? new Date(review.date).toLocaleDateString()
                  : 'Recently';
                const attrs = review.attributes || {};
                const vibeLabel = formatVibe(attrs.vibe);
                const pros = attrs.pros || [];
                const cons = attrs.cons || [];

                return (
                  <li key={review._id} className="review-row">
                    <div
                      className={`review-score-chip tier-${tier}`}
                      role="img"
                      aria-label={`Rated ${rating} out of 5 stars`}
                    >
                      {rating}
                    </div>
                    <div className="review-body">
                      <div className="review-row-top">
                        <div className="review-row-heading">
                          {review.dorm?._id ? (
                            <Link to={`/dorm/${review.dorm._id}`} className="review-dorm-link">
                              {dormName}
                            </Link>
                          ) : (
                            <span className="review-dorm-static">{dormName}</span>
                          )}
                          <span className="review-date">{dateLabel}</span>
                        </div>
                        <span className="stars" aria-hidden="true">
                          {'★'.repeat(rating)}
                          {'☆'.repeat(Math.max(0, 5 - rating))}
                        </span>
                      </div>

                      {review.review && <p className="review-text">{review.review}</p>}

                      {(pros.length > 0 || cons.length > 0 || attrs.wouldLiveAgain || vibeLabel) && (
                        <div className="review-tags">
                          {attrs.wouldLiveAgain === 'yes' && (
                            <span className="tag-badge tag-pro">Would live here again</span>
                          )}
                          {attrs.wouldLiveAgain === 'no' && (
                            <span className="tag-badge tag-con">Wouldn't live here again</span>
                          )}
                          {vibeLabel && <span className="tag-badge tag-info">{vibeLabel}</span>}
                          {pros.slice(0, 4).map((tag) => (
                            <span className="tag-badge tag-pro" key={`pro-${tag}`}>{tag}</span>
                          ))}
                          {cons.slice(0, 3).map((tag) => (
                            <span className="tag-badge tag-con" key={`con-${tag}`}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {visibleReviews.length === 0 && (
              <p className="no-filtered-reviews">No reviews match this filter yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
