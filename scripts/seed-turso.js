import { createClient } from '@libsql/client';
import { heroBowls, allMenuItems } from '../src/data/menuData.js';
import { reviewsData } from '../src/data/reviewsData.js';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL || 'libsql://restaurent-virinchi-2003.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1NDAwNTAsImlkIjoiMDFhMTIwMWItOWUwMS03MTdlLThjYzMtOTFlZDYzNWIyNzA3Iiwia2lkIjoiYzdhbkp0dS1RNE1rRUtCYlNEMlJ5TjI0X2ZsT3lZSE5qSmZHeS1PWTRfayIsInJpZCI6Ijg1MGQwY2IxLThlNGEtNGIzOS1iOWVmLWJmNjkwMTE4M2IwNCJ9.Mchep_tL7uC9ptHLWnnKe47PSYmrFm3D8rxXU-LOF2miLR7dM3YBz_Sx_2Eqnfkenu9WBFtzHn8HhrFM9xi_Cw',
});

async function seed() {
  console.log('--- Initializing Turso Database Schema ---');

  // 1. Menu Items Table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      calories INTEGER,
      rating REAL,
      reviews_count INTEGER,
      image TEXT,
      fallback_image TEXT,
      description TEXT,
      ingredients TEXT,
      macros TEXT,
      accent_color TEXT,
      is_popular INTEGER DEFAULT 0,
      is_hero INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ menu_items table ready');

  // 2. Orders Table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT,
      pincode TEXT,
      payment_method TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      grand_total REAL NOT NULL,
      promo_code TEXT,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ orders table ready');

  // 3. Reservations Table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      guests INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      seating_preference TEXT,
      special_requests TEXT,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ reservations table ready');

  // 4. Newsletter Subscribers Table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      discount_code TEXT DEFAULT 'TASTY20',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ subscribers table ready');

  // 5. Customer Reviews Table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      rating INTEGER DEFAULT 5,
      avatar TEXT,
      quote TEXT NOT NULL,
      stat TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ reviews table ready');

  // Seed Menu Items
  console.log('\n--- Seeding Menu Items ---');
  const heroIds = new Set(heroBowls.map(b => b.id));

  for (const item of allMenuItems) {
    const isHero = heroIds.has(item.id) ? 1 : 0;
    const isPopular = item.isPopular ? 1 : 0;
    const ingredientsJson = JSON.stringify(item.ingredients || []);
    const macrosJson = JSON.stringify(item.macros || {});

    await client.execute({
      sql: `
        INSERT OR REPLACE INTO menu_items (
          id, name, subtitle, category, price, calories, rating, reviews_count,
          image, fallback_image, description, ingredients, macros, accent_color,
          is_popular, is_hero
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        item.id,
        item.name,
        item.subtitle || '',
        item.category,
        item.price,
        item.calories || 0,
        item.rating || 5.0,
        item.reviewsCount || 0,
        item.image,
        item.fallbackImage || '',
        item.description || '',
        ingredientsJson,
        macrosJson,
        item.accentColor || '#ff2a5f',
        isPopular,
        isHero
      ]
    });
    console.log(`  + Seeded menu item: ${item.name} (₹${item.price}) [${item.category}]`);
  }

  // Seed Reviews
  console.log('\n--- Seeding Customer Reviews ---');
  for (const review of reviewsData) {
    await client.execute({
      sql: `
        INSERT OR REPLACE INTO reviews (
          id, name, role, rating, avatar, quote, stat
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        review.id,
        review.name,
        review.role,
        review.rating,
        review.avatar,
        review.quote,
        review.stat
      ]
    });
    console.log(`  + Seeded review: ${review.name} (${review.rating}★)`);
  }

  // Verification Counts
  console.log('\n--- Database Verification ---');
  const countMenu = await client.execute('SELECT COUNT(*) as count FROM menu_items;');
  const countReviews = await client.execute('SELECT COUNT(*) as count FROM reviews;');
  const countOrders = await client.execute('SELECT COUNT(*) as count FROM orders;');
  const countReservations = await client.execute('SELECT COUNT(*) as count FROM reservations;');
  const countSubscribers = await client.execute('SELECT COUNT(*) as count FROM subscribers;');

  console.log(`Total Menu Items in Turso: ${countMenu.rows[0].count}`);
  console.log(`Total Reviews in Turso:    ${countReviews.rows[0].count}`);
  console.log(`Total Orders in Turso:     ${countOrders.rows[0].count}`);
  console.log(`Total Reservations:        ${countReservations.rows[0].count}`);
  console.log(`Total Subscribers:         ${countSubscribers.rows[0].count}`);
  console.log('\n🎉 Turso database seeded successfully!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
