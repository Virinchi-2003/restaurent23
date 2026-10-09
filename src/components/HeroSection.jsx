import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroBowls } from '../data/menuData';

export default function HeroSection({ dishes = heroBowls, onAddToCart, onOpenDishDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const activeBowls = dishes && dishes.length > 0 ? dishes : heroBowls;
  const currentBowl = activeBowls[currentIndex % activeBowls.length] || activeBowls[0];

  const handleNext = () => {
    setRotation(prev => prev + 90);
    setCurrentIndex(prev => (prev + 1) % activeBowls.length);
  };

  // 1.25x Automatic Rotation Timer for Hero Dish Showcase
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setRotation(prev => prev + 90);
      setCurrentIndex(prev => (prev + 1) % activeBowls.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [isHovered, currentIndex, activeBowls]);

  // Strict 1.5x playback speed for background chopping vegetables video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const enforceSpeed = () => {
      video.playbackRate = 1.5;
    };

    enforceSpeed();
    video.play().catch(() => {});
    video.addEventListener('loadedmetadata', enforceSpeed);
    video.addEventListener('play', enforceSpeed);
    video.addEventListener('ratechange', () => {
      if (video.playbackRate !== 1.5) {
        video.playbackRate = 1.5;
      }
    });

    return () => {
      video.removeEventListener('loadedmetadata', enforceSpeed);
      video.removeEventListener('play', enforceSpeed);
    };
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
      setMousePos({ x, y });
    };

    const node = heroRef.current;
    if (node) {
      node.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (node) node.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      {/* 2.5D Animated Culinary Chopping Veggies Background */}
      <div
        className="hero-video-bg-container"
        style={{
          transform: `translate3d(${mousePos.x * -0.32}px, ${mousePos.y * -0.32}px, 0) rotateX(${mousePos.y * -0.04}deg) rotateY(${mousePos.x * 0.04}deg)`,
        }}
        aria-hidden="true"
      >
        <div className="hero-video-perspective-wrapper">
          <video
            ref={videoRef}
            className="hero-video-bg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/farm_harvest.jpg"
            src="/videos/cutting-carrots.mp4"
          />
        </div>

        {/* Ambient Gradient Mesh overlay seamlessly blending with surrounding areas */}
        <div className="hero-video-gradient-overlay" />
      </div>

      <div className="container hero-grid">
        {/* Left Column: Hero Content */}
        <div className="hero-content">
          {/* Hero Heading */}
          <h1 className="hero-title">
            Embark on a{' '}
            <span className="text-gradient-pink">tasty adventure</span> with a{' '}
            wholesome diet!
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            Invite your loved ones to savor the finest healthier diet in the area, crafted
            fresh and served piping hot! 100% organic farm harvests prepared by culinary artisans.
          </p>

          {/* Primary CTA Buttons */}
          <div className="hero-cta-group">
            <button
              onClick={() => onAddToCart(currentBowl)}
              className="btn-primary"
              id="hero-order-btn"
            >
              <span>Order Now — ₹{currentBowl.price}</span>
            </button>
            <a href="#menu" className="btn-secondary" id="hero-view-menu-btn">
              <span>View Our Menu</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Right Column: 2.5D Showcase Stage */}
        <div
          className="hero-visual-stage"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Glow */}
          <div className="stage-glow"></div>

          {/* Floating Parallax Ingredient 1: Basil Leaf Top-Left */}
          <img
            src="/images/basil_leaf.png"
            alt="Fresh basil leaf"
            className="floating-ingredient ingredient-basil-1"
            style={{
              transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) rotate(${mousePos.x * 0.5}deg)`,
              mixBlendMode: 'multiply'
            }}
          />

          {/* Floating Parallax Ingredient 2: Cherry Tomato Bottom-Left */}
          <img
            src="/images/cherry_tomato.png"
            alt="Organic cherry tomato"
            className="floating-ingredient ingredient-tomato-1"
            style={{
              transform: `translate(${mousePos.x * -0.9}px, ${mousePos.y * -0.9}px)`,
              mixBlendMode: 'multiply'
            }}
          />

          {/* Floating Parallax Ingredient 3: Mushroom Top */}
          <img
            src="/images/mushroom.png"
            alt="Fresh button mushroom"
            className="floating-ingredient ingredient-mushroom-1"
            style={{
              transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)`,
              mixBlendMode: 'multiply'
            }}
          />

          {/* Floating Parallax Ingredient 4: Tiny Tomato Middle-Right */}
          <img
            src="/images/cherry_tomato.png"
            alt="Sweet cherry tomato"
            className="floating-ingredient ingredient-tomato-2"
            style={{
              transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px) scale(0.85)`,
              mixBlendMode: 'multiply'
            }}
          />

          {/* Floating Parallax Ingredient 5: Basil Leaf Bottom-Right */}
          <img
            src="/images/basil_leaf.png"
            alt="Fresh green herb"
            className="floating-ingredient ingredient-basil-2"
            style={{
              transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px) rotate(45deg)`,
              mixBlendMode: 'multiply'
            }}
          />

          {/* The Main 2.5D Floating Dish */}
          <div className="plate-showcase-container">
            <div
              className="plate-image-wrapper"
              onClick={() => onOpenDishDetail(currentBowl)}
              style={{
                transform: `rotate(${rotation}deg) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
                cursor: 'pointer'
              }}
              title="Click to view full recipe & customize"
            >
              <img
                src={currentBowl.image}
                alt={currentBowl.name}
                className="plate-hero-image"
                onError={(e) => { e.target.src = currentBowl.fallbackImage; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
