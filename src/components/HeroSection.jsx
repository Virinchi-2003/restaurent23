import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, Flame, ChefHat } from 'lucide-react';
import { heroBowls } from '../data/menuData';

// Available culinary scenes showcasing chef hand & pan with high flames
const CULINARY_VIDEOS = [
  {
    id: 'flame-sizzle',
    name: 'Flambé Sizzle',
    label: '🔥 Flambé',
    quality: '4K Ultra HD',
    src: '/videos/chef-flame-pan-sizzle.mp4',
    poster: '/images/chef_pan_fire_reference.jpg',
    speed: 1.0,
    targetDuration: 7.0, // Continuous duration in seconds per scene
    desc: 'High-heat sauté pan with leaping culinary flames'
  },
  {
    id: 'pan-topping',
    name: 'Chef Pan Topping',
    label: '👨‍🍳 Topping',
    quality: 'HD 60FPS',
    src: '/videos/chef-pan-fire-topping.mp4',
    poster: '/images/chef_pan_flame_poster.jpg',
    speed: 1.15,
    targetDuration: 7.0,
    desc: 'Chef adding fresh ingredients into flaming pan over high heat'
  },
  {
    id: 'artisan-4k',
    name: 'Master Kitchen',
    label: '🍳 Artisan',
    quality: '4K Master',
    src: '/videos/chef-restaurant-4k.mp4',
    poster: '/images/chef_pan_fire_reference.jpg',
    speed: 1.0,
    targetDuration: 7.5,
    desc: 'Artisan restaurant kitchen cooking over open stove'
  }
];

export default function HeroSection({ dishes = heroBowls, onAddToCart, onOpenDishDetail }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollState, setScrollState] = useState({ y: 0, progress: 0 });

  const heroRef = useRef(null);
  const videoRefs = useRef([]);
  const lastActiveIndex = useRef(activeVideoIndex);

  // Advance to next video in the continuous one-by-one sequence
  const advanceToNextVideo = useCallback(() => {
    setActiveVideoIndex(prev => (prev + 1) % CULINARY_VIDEOS.length);
  }, []);

  // Continuous one-by-one auto-playback timer
  useEffect(() => {
    const currentVid = CULINARY_VIDEOS[activeVideoIndex];
    const durationMs = (currentVid.targetDuration || 7) * 1000;
    const timer = setTimeout(() => {
      advanceToNextVideo();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [activeVideoIndex, advanceToNextVideo]);

  // Synchronize playback of all 3 video elements (seamless cross-fade with zero blank frames)
  useEffect(() => {
    const isNewScene = lastActiveIndex.current !== activeVideoIndex;
    lastActiveIndex.current = activeVideoIndex;
    const timeouts = [];

    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeVideoIndex) {
        videoEl.playbackRate = CULINARY_VIDEOS[idx].speed || 1.0;
        if (isNewScene) {
          videoEl.currentTime = 0;
        }
        videoEl.play().catch(() => {});
      } else {
        // Allow crossfade to complete before pausing previous video
        const t = setTimeout(() => {
          if (idx !== activeVideoIndex && videoEl) {
            videoEl.pause();
          }
        }, 900);
        timeouts.push(t);
      }
    });

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [activeVideoIndex]);

  // Video onEnded fallback trigger
  const handleVideoEnded = (idx) => {
    if (idx === activeVideoIndex) {
      advanceToNextVideo();
    }
  };

  // High-performance 2.5D Scroll Physics Engine (rAF throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            const heroHeight = rect.height || window.innerHeight;
            const scrollY = Math.max(0, -rect.top);
            const progress = Math.min(1.2, Math.max(0, scrollY / heroHeight));
            setScrollState({ y: scrollY, progress });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect on mouse move with lerp smoothing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 36;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 36;
      setMousePos({ x, y });
    };

    const node = heroRef.current;
    if (node) {
      node.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => {
      if (node) node.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculated 2.5D transformations based on scroll and mouse
  const { y: scrollY, progress: scrollProgress } = scrollState;

  // Background 2.5D depth transform: moves with perspective, depth zoom, and camera tilt
  const videoTransform = `
    translate3d(${mousePos.x * -0.25}px, ${mousePos.y * -0.25 + scrollY * 0.35}px, ${-scrollY * 0.22}px)
    rotateX(${mousePos.y * -0.03 + scrollProgress * 5.5}deg)
    rotateY(${mousePos.x * 0.03}deg)
    scale(${1 + scrollProgress * 0.09})
  `;

  // Dynamic depth-of-field blur as user scrolls down
  const videoBlur = Math.min(scrollProgress * 6.5, 7);

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      {/* ======================================================================
          2.5D CONTINUOUS BACKGROUND VIDEO LAYER (CROSS-FADING 3 SCENES)
          ====================================================================== */}
      <div
        className="hero-video-bg-container"
        style={{
          transform: videoTransform,
          filter: `blur(${videoBlur}px)`,
        }}
        aria-hidden="true"
      >
        <div className="hero-video-perspective-wrapper">
          {CULINARY_VIDEOS.map((vid, idx) => (
            <video
              key={vid.id}
              ref={el => { videoRefs.current[idx] = el; }}
              className={`hero-video-bg ${activeVideoIndex === idx ? 'active-video' : 'inactive-video'}`}
              autoPlay={idx === 0}
              muted
              playsInline
              preload="auto"
              poster={vid.poster}
              src={vid.src}
              onEnded={() => handleVideoEnded(idx)}
            />
          ))}
        </div>

        {/* Cinematic Chromatic Mesh: Warm amber flame glow, golden radiant heat & smooth white blend */}
        <div className="hero-video-gradient-overlay" />
      </div>

      {/* Floating 2.5D Culinary Embers & Sparks drifting upward */}
      <div className="culinary-embers-layer" aria-hidden="true">
        <span
          className="culinary-ember ember-1"
          style={{
            transform: `translate3d(${mousePos.x * 0.5}px, ${-scrollY * 0.8}px, 50px)`
          }}
        />
        <span
          className="culinary-ember ember-2"
          style={{
            transform: `translate3d(${mousePos.x * -0.7}px, ${-scrollY * 1.1}px, 80px)`
          }}
        />
        <span
          className="culinary-ember ember-3"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${-scrollY * 0.6}px, 30px)`
          }}
        />
        <span
          className="culinary-ember ember-4"
          style={{
            transform: `translate3d(${mousePos.x * -0.4}px, ${-scrollY * 0.9}px, 60px)`
          }}
        />
        <span
          className="culinary-ember ember-5"
          style={{
            transform: `translate3d(${mousePos.x * 0.8}px, ${-scrollY * 1.2}px, 90px)`
          }}
        />
      </div>

      <div className="container hero-grid">
        {/* ======================================================================
            HERO CONTENT & CALL TO ACTION
            ====================================================================== */}
        <div
          className="hero-content"
          style={{
            transform: `translate3d(0, ${scrollY * 0.16}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.1)
          }}
        >
          {/* Hero Heading with Fire-Kissed Gradient Accent */}
          <h1 className="hero-title">
            Embark on a<span className="hero-break-sm" />{' '}
            <span className="text-gradient-flame">tasty adventure</span><span className="hero-break-sm" />{' '}
            with a wholesome diet!
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            Invite your loved ones to savor the finest healthier diet in the area, crafted
            fresh and served piping hot! 100% organic farm harvests prepared by culinary artisans.
          </p>

          {/* Primary CTA Button */}
          <div className="hero-cta-group">
            <a href="#menu" className="btn-primary" id="hero-view-menu-btn">
              <span>View Our Menu</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Mini Interactive Dish Preview Row */}
          <div className="hero-dish-tags">
            <span className="hero-tag-item">
              <Sparkles size={13} className="hero-tag-icon" />
              Sizzling Fire Wok
            </span>
            <span className="hero-tag-item">
              <ChefHat size={13} className="hero-tag-icon" />
              Chef Hand Crafted
            </span>
            <span className="hero-tag-item">
              <Flame size={13} className="hero-tag-icon" />
              100% Fresh Farm Harvest
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
