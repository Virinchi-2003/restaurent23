import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PromiseSection from './components/PromiseSection';
import HowItWorksSection from './components/HowItWorksSection';
import MenuSection from './components/MenuSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import FooterSection from './components/FooterSection';
import CartDrawer from './components/CartDrawer';
import DishDetailModal from './components/DishDetailModal';
import ReservationModal from './components/ReservationModal';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import { getMenuItems, getHeroBowls, getReviews, testConnection } from './db/turso';
import { allMenuItems, heroBowls } from './data/menuData';
import { reviewsData } from './data/reviewsData';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState(allMenuItems);
  const [heroItems, setHeroItems] = useState(heroBowls);
  const [reviews, setReviews] = useState(reviewsData);
  const [isDbConnected, setIsDbConnected] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');
    localStorage.removeItem('bowls_theme');

    // Fetch dynamic menu, hero bowls and reviews from Turso DB
    async function loadTursoData() {
      try {
        const [items, heroes, fetchedReviews, connected] = await Promise.all([
          getMenuItems(),
          getHeroBowls(),
          getReviews(),
          testConnection()
        ]);
        if (items && items.length > 0) setMenuItems(items);
        if (heroes && heroes.length > 0) setHeroItems(heroes);
        if (fetchedReviews && fetchedReviews.length > 0) setReviews(fetchedReviews);
        if (typeof connected === 'boolean') setIsDbConnected(connected);
      } catch (err) {
        console.warn('Turso initial load fallback:', err);
      }
    }
    loadTursoData();
  }, []);

  // Scroll Entrance Animations Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll(
      '.promise-card, .process-step-card, .menu-card, .story-banner, .review-card, .section-header-centered, .newsletter-card'
    );
    targets.forEach((el) => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuItems, reviews]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleAddToCart = (dish, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: qty,
          image: dish.image,
          fallbackImage: dish.fallbackImage,
          customizations: dish.customizations
        }
      ];
    });
    showToast(`Added ${dish.name} to order!`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleApplyPromo = (code) => {
    setPromoCode(code);
    showToast(`Promo code ${code} applied! 20% Discount unlocked.`);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = promoCode === 'TASTY20' ? Math.round(subtotal * 0.20) : 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + estimatedTax);

  return (
    <div className="app-container">
      {/* Sticky Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with 2.5D rotating plate and floating ingredients */}
        <HeroSection
          dishes={heroItems}
          onAddToCart={handleAddToCart}
          onOpenDishDetail={(dish) => setSelectedDish(dish)}
        />

        {/* Section 2: Our Promise (Farm-to-Table, Flash Delivery) */}
        <PromiseSection />

        {/* Section 3: How it Works (3 Step Process) */}
        <HowItWorksSection />

        {/* Section 4: Our Popular Menu */}
        <MenuSection
          items={menuItems}
          onAddToCart={handleAddToCart}
          onOpenDishDetail={(dish) => setSelectedDish(dish)}
        />

        {/* Section 5: What our happy eaters say */}
        <TestimonialsSection reviews={reviews} />

        {/* Section 6: Newsletter / 20% Discount CTA */}
        <NewsletterSection onApplyPromo={handleApplyPromo} />
      </main>

      {/* Footer */}
      <FooterSection
        onOpenReservation={() => setIsReservationOpen(true)}
        isDbConnected={isDbConnected}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromo}
      />

      {/* Dish Detail & Nutrition Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        grandTotal={grandTotal}
        promoCode={promoCode}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
