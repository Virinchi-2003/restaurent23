import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { reviewsData } from '../data/reviewsData';

export default function TestimonialsSection({ reviews = reviewsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeReviews = reviews && reviews.length > 0 ? reviews : reviewsData;
  const currentReview = activeReviews[currentIndex % activeReviews.length] || activeReviews[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
  };

  return (
    <section className="section-wrapper testimonial-section" id="reviews">
      <div className="container">
        <div className="testimonial-dark-card">
          {/* Subtle Ambient Radial Glow */}
          <div className="testimonial-dark-glow"></div>

          {/* Left Column: Heading and Live Metrics */}
          <div className="testimonial-left">
            <span
              className="badge-tag"
              style={{ background: 'rgba(255, 42, 95, 0.15)', color: '#ff4d7a', border: '1px solid rgba(255, 42, 95, 0.3)' }}
            >
              COMMUNITY REPUTATION
            </span>

            <h2 className="testimonial-heading">
              What our <span className="text-gradient-pink">happy eaters</span> say.
            </h2>

            <div className="testimonial-stats-row">
              <div className="stat-item">
                <h4>50K+</h4>
                <p>Bowls Served</p>
              </div>
              <div className="stat-item">
                <h4>4.9/5</h4>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Quote, Avatar and Carousel Controls */}
          <div className="testimonial-right">
            {/* 5 Gold Stars */}
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="#fbbf24" stroke="#fbbf24" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="testimonial-quote">
              "{currentReview.quote}"
            </p>

            {/* Author Footer */}
            <div className="testimonial-author-box">
              <div className="author-info">
                <img
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="author-avatar"
                />
                <div>
                  <h4 className="author-name">{currentReview.name}</h4>
                  <p className="author-role">{currentReview.role}</p>
                </div>
              </div>

              {/* Slider Arrows */}
              <div className="testimonial-nav-arrows">
                <button
                  onClick={handlePrev}
                  className="testimonial-btn"
                  aria-label="Previous testimonial"
                  id="testimonial-prev"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="testimonial-btn"
                  aria-label="Next testimonial"
                  id="testimonial-next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
