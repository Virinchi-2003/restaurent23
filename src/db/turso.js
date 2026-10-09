import { createClient } from '@libsql/client/web';
import { heroBowls as localHeroBowls, allMenuItems as localAllMenuItems } from '../data/menuData.js';
import { reviewsData as localReviews } from '../data/reviewsData.js';

let TURSO_URL = import.meta.env?.VITE_TURSO_DATABASE_URL || 'https://restaurent-virinchi-2003.aws-ap-south-1.turso.io';
if (TURSO_URL.startsWith('libsql://')) {
  TURSO_URL = TURSO_URL.replace('libsql://', 'https://');
}
const TURSO_TOKEN = import.meta.env?.VITE_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1NDAwNTAsImlkIjoiMDFhMTIwMWItOWUwMS03MTdlLThjYzMtOTFlZDYzNWIyNzA3Iiwia2lkIjoiYzdhbkp0dS1RNE1rRUtCYlNEMlJ5TjI0X2ZsT3lZSE5qSmZHeS1PWTRfayIsInJpZCI6Ijg1MGQwY2IxLThlNGEtNGIzOS1iOWVmLWJmNjkwMTE4M2IwNCJ9.Mchep_tL7uC9ptHLWnnKe47PSYmrFm3D8rxXU-LOF2miLR7dM3YBz_Sx_2Eqnfkenu9WBFtzHn8HhrFM9xi_Cw';

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

/**
 * Maps SQL row to application dish object format
 */
function mapMenuRow(row) {
  let ingredients = [];
  try {
    ingredients = typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients || [];
  } catch {
    ingredients = [];
  }

  let macros = { protein: '30g', carbs: '45g', fat: '15g' };
  try {
    macros = typeof row.macros === 'string' ? JSON.parse(row.macros) : row.macros || macros;
  } catch {
    macros = { protein: '30g', carbs: '45g', fat: '15g' };
  }

  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    category: row.category,
    price: Number(row.price),
    calories: Number(row.calories) || 450,
    rating: Number(row.rating) || 4.9,
    reviewsCount: Number(row.reviews_count) || 200,
    image: row.image,
    fallbackImage: row.fallback_image || row.image,
    description: row.description || '',
    ingredients,
    macros,
    accentColor: row.accent_color || '#ff2a5f',
    isPopular: Boolean(row.is_popular),
    isHero: Boolean(row.is_hero),
  };
}

/**
 * Fetch all menu items from Turso with automatic local fallback
 */
export async function getMenuItems() {
  try {
    const res = await turso.execute('SELECT * FROM menu_items ORDER BY is_popular DESC, price ASC;');
    if (res.rows && res.rows.length > 0) {
      return res.rows.map(mapMenuRow);
    }
  } catch (err) {
    console.warn('[Turso DB] Fetch menu items fallback to local cache:', err?.message || err);
  }
  return localAllMenuItems;
}

/**
 * Fetch hero showcase bowls from Turso with automatic local fallback
 */
export async function getHeroBowls() {
  try {
    const res = await turso.execute('SELECT * FROM menu_items WHERE is_hero = 1 ORDER BY price ASC;');
    if (res.rows && res.rows.length > 0) {
      return res.rows.map(mapMenuRow);
    }
  } catch (err) {
    console.warn('[Turso DB] Fetch hero bowls fallback to local cache:', err?.message || err);
  }
  return localHeroBowls;
}

/**
 * Sync and save placed customer order to Turso database
 */
export async function createOrder(orderData) {
  const orderId = orderData.id || `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const itemsJson = JSON.stringify(orderData.items || []);

  try {
    await turso.execute({
      sql: `
        INSERT INTO orders (
          id, customer_name, email, phone, address, city, pincode,
          payment_method, items, subtotal, discount, delivery_fee, tax,
          grand_total, promo_code, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        orderId,
        orderData.customerName || orderData.name || 'Valued Guest',
        orderData.email || '',
        orderData.phone || '',
        orderData.address || '',
        orderData.city || 'Mumbai',
        orderData.pincode || '',
        orderData.paymentMethod || 'UPI',
        itemsJson,
        Number(orderData.subtotal) || 0,
        Number(orderData.discount) || 0,
        Number(orderData.deliveryFee) || 0,
        Number(orderData.tax) || 0,
        Number(orderData.grandTotal) || 0,
        orderData.promoCode || '',
        'confirmed'
      ]
    });
    console.log(`[Turso DB] Order ${orderId} successfully synced.`);
    return { success: true, orderId };
  } catch (err) {
    console.error('[Turso DB] Error saving order:', err);
    return { success: false, orderId, error: err?.message || String(err) };
  }
}

/**
 * Sync and save table reservation to Turso database
 */
export async function createReservation(resData) {
  const reservationId = resData.id || `RES-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  try {
    await turso.execute({
      sql: `
        INSERT INTO reservations (
          id, customer_name, email, phone, guests, date, time,
          seating_preference, special_requests, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        reservationId,
        resData.name || resData.customerName || 'Valued Guest',
        resData.email || '',
        resData.phone || '',
        Number(resData.guests) || 2,
        resData.date || new Date().toISOString().split('T')[0],
        resData.time || '19:00',
        resData.seatingPreference || 'standard',
        resData.specialRequests || '',
        'confirmed'
      ]
    });
    console.log(`[Turso DB] Reservation ${reservationId} successfully synced.`);
    return { success: true, reservationId };
  } catch (err) {
    console.error('[Turso DB] Error saving reservation:', err);
    return { success: false, reservationId, error: err?.message || String(err) };
  }
}

/**
 * Sync newsletter email subscription to Turso database
 */
export async function subscribeNewsletter(email) {
  try {
    await turso.execute({
      sql: `
        INSERT OR IGNORE INTO subscribers (email, discount_code)
        VALUES (?, 'TASTY20')
      `,
      args: [email]
    });
    console.log(`[Turso DB] Subscriber ${email} synced.`);
    return { success: true };
  } catch (err) {
    console.error('[Turso DB] Error subscribing newsletter:', err);
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Fetch reviews from Turso with fallback
 */
export async function getReviews() {
  try {
    const res = await turso.execute('SELECT * FROM reviews ORDER BY id ASC;');
    if (res.rows && res.rows.length > 0) {
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        rating: Number(r.rating) || 5,
        avatar: r.avatar,
        quote: r.quote,
        stat: r.stat
      }));
    }
  } catch (err) {
    console.warn('[Turso DB] Fetch reviews fallback:', err?.message || err);
  }
  return localReviews;
}

/**
 * Test Turso connection status
 */
export async function testConnection() {
  try {
    const res = await turso.execute('SELECT 1 as is_connected;');
    return res.rows && res.rows.length > 0;
  } catch {
    return false;
  }
}
