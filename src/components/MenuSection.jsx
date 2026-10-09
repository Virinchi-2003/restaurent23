import React, { useState } from 'react';
import { Plus, Eye, Flame, Check } from 'lucide-react';
import { allMenuItems, categories } from '../data/menuData';

export default function MenuSection({ items = allMenuItems, onAddToCart, onOpenDishDetail }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAllItems, setShowAllItems] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  const menuList = items && items.length > 0 ? items : allMenuItems;
  const filteredItems = menuList.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const displayedItems = showAllItems ? filteredItems : filteredItems.slice(0, 8);

  const handleAdd = (e, item) => {
    e.stopPropagation();
    onAddToCart(item);
    setAddedIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== item.id));
    }, 1200);
  };

  return (
    <section className="section-wrapper menu-section" id="menu">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="badge-tag" style={{ background: '#fff1f4', color: '#ff2a5f' }}>
            CULINARY MASTERY
          </span>
          <h2 className="section-title">
            Our Popular <span className="text-gradient-pink">Menu</span>
          </h2>
          <p className="section-subtitle">
            Discover our most ordered bowls, curated for both health enthusiasts and flavor chasers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="menu-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`menu-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              id={`filter-pill-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        <div className="menu-grid">
          {displayedItems.map((item) => {
            const isJustAdded = addedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="menu-card"
                id={`dish-card-${item.id}`}
              >
                {/* Curved Price Tag Badge */}
                <div className="menu-card-price-tag">
                  ₹{item.price}
                </div>

                {/* Floating Food Plate Image */}
                <div
                  className="menu-card-image-box"
                  onClick={() => onOpenDishDetail(item)}
                  title="Click to view full nutritional info & customize"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="menu-card-img"
                    onError={(e) => { e.target.src = item.fallbackImage; }}
                  />
                </div>

                {/* Dish Title */}
                <h3
                  className="menu-card-title"
                  onClick={() => onOpenDishDetail(item)}
                >
                  {item.name}
                </h3>

                {/* Ingredients Tag List */}
                <p className="menu-card-tags">
                  {item.ingredients.slice(0, 3).join(' • ').toUpperCase()}
                </p>

                {/* Footer with Calories and Add Button */}
                <div className="menu-card-footer">
                  <div className="menu-card-calories">
                    <span>CALORIES</span>
                    {item.calories} kcal
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                      onClick={() => onOpenDishDetail(item)}
                      className="nav-icon-btn"
                      style={{ width: '36px', height: '36px' }}
                      title="Quick View & Nutrition"
                      aria-label={`View details for ${item.name}`}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={(e) => handleAdd(e, item)}
                      className="menu-add-btn"
                      style={{
                        backgroundColor: isJustAdded ? 'var(--accent-green)' : undefined,
                        borderColor: isJustAdded ? 'var(--accent-green)' : undefined,
                        color: isJustAdded ? '#ffffff' : undefined
                      }}
                      title="Add to order"
                      id={`add-btn-${item.id}`}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      {isJustAdded ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Menu CTA Button */}
        {filteredItems.length > 4 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="btn-secondary"
              id="view-full-menu-btn"
            >
              <span>{showAllItems ? 'Show Less' : 'View Full Menu & All Dishes'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
