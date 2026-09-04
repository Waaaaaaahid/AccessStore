/*
 * Compatibility data client.
 *
 * The original starter was wired directly to Supabase, which caused the Vite
 * app to crash on Vercel when Supabase environment variables were absent.
 * AccessStore is being moved to MongoDB, so the frontend must not initialise
 * a Supabase client at startup.
 *
 * Set VITE_API_URL to the MongoDB-backed API when the backend is deployed.
 * Until then, this client uses a small localStorage-backed demo store so the
 * storefront renders instead of showing a blank page.
 */

type Row = Record<string, any>;

type Result = { data: any; error: any };

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const STORAGE_KEY = 'accessstore-demo-db-v1';

const seed = (): Record<string, Row[]> => ({
  categories: [
    { id: 'cat-gaming', name: 'Gaming', slug: 'gaming' },
    { id: 'cat-merch', name: 'Merchandise', slug: 'merchandise' },
    { id: 'cat-accessories', name: 'Accessories', slug: 'accessories' },
    { id: 'cat-collectibles', name: 'Collectibles', slug: 'collectibles' },
    { id: 'cat-apparel', name: 'Apparel', slug: 'apparel' },
    { id: 'cat-creator', name: 'Creator Picks', slug: 'creator-picks' },
  ],
  products: [
    { id: 'demo-1', name: 'Creator Gaming Mouse', slug: 'creator-gaming-mouse', description: 'Lightweight precision gaming mouse.', short_description: 'Precision gaming mouse', price: 1499, original_price: 1999, discount_percentage: 25, category_id: 'cat-gaming', image_url: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800', images: [], rating: 4.8, review_count: 124, stock: 25, is_featured: true, is_new: true, created_at: new Date().toISOString() },
    { id: 'demo-2', name: 'Pro Gaming Headset', slug: 'pro-gaming-headset', description: 'Comfortable headset for long gaming sessions.', short_description: 'Immersive gaming audio', price: 2499, original_price: 2999, discount_percentage: 17, category_id: 'cat-gaming', image_url: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800', images: [], rating: 4.7, review_count: 89, stock: 18, is_featured: true, is_new: false, created_at: new Date().toISOString() },
    { id: 'demo-3', name: 'Creator Hoodie', slug: 'creator-hoodie', description: 'Premium heavyweight creator hoodie.', short_description: 'Premium creator hoodie', price: 1999, original_price: 2499, discount_percentage: 20, category_id: 'cat-apparel', image_url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', images: [], rating: 4.9, review_count: 76, stock: 30, is_featured: true, is_new: true, created_at: new Date().toISOString() },
    { id: 'demo-4', name: 'Gaming Desk Mat', slug: 'gaming-desk-mat', description: 'Large smooth desk mat for gaming setups.', short_description: 'XL gaming desk mat', price: 899, original_price: 1199, discount_percentage: 25, category_id: 'cat-accessories', image_url: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800', images: [], rating: 4.6, review_count: 51, stock: 42, is_featured: true, is_new: false, created_at: new Date().toISOString() },
  ],
  orders: [],
  order_items: [],
  payments: [],
  coupons: [],
  reviews: [],
  support_payments: [],
  site_settings: [
    { key: 'creator_name', value: 'BlockMaster' },
    { key: 'creator_tagline', value: 'Level Up Your Roblox Experience' },
    { key: 'creator_description', value: "Hey! I'm BlockMaster, a Roblox content creator creating entertaining gaming videos, challenges and community content." },
    { key: 'youtube_subscribers', value: '2.5M' },
    { key: 'youtube_videos', value: '850+' },
    { key: 'youtube_views', value: '450M+' },
    { key: 'youtube_url', value: 'https://youtube.com/' },
    { key: 'instagram_url', value: 'https://instagram.com/' },
    { key: 'discord_url', value: 'https://discord.com/' },
    { key: 'business_email', value: 'contact@accessstore.in' },
    { key: 'whatsapp_number', value: '' },
    { key: 'upi_id', value: '' },
    { key: 'support_page_url', value: '' },
    { key: 'hero_heading', value: 'Level Up Your Roblox Experience.' },
    { key: 'hero_subheading', value: 'Gaming gear, creator merchandise and handpicked products for the community.' },
  ],
});

function getDb(): Record<string, Row[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db = seed();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch {}
  return db;
}

function saveDb(db: Record<string, Row[]>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch {}
}

function id() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

class QueryBuilder implements PromiseLike<Result> {
  private filters: Array<(row: Row) => boolean> = [];
  private ordering: { field: string; ascending: boolean } | null = null;
  private maxRows: number | null = null;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: Row | Row[] | null = null;
  private selected = false;
  private singleRow = false;

  constructor(private table: string) {}

  select(_columns = '*') { this.selected = true; return this; }
  eq(field: string, value: any) { this.filters.push(r => r[field] === value); return this; }
  or(expression: string) {
    const parts = expression.split(',').map(p => p.trim());
    this.filters.push(row => parts.some(part => {
      const m = part.match(/^([\w]+)\.ilike\.%(.+)%$/);
      return m ? String(row[m[1]] ?? '').toLowerCase().includes(m[2].toLowerCase()) : true;
    }));
    return this;
  }
  order(field: string, options?: { ascending?: boolean }) { this.ordering = { field, ascending: options?.ascending !== false }; return this; }
  limit(n: number) { this.maxRows = n; return this; }
  single() { this.singleRow = true; return this; }
  insert(payload: Row | Row[]) { this.operation = 'insert'; this.payload = payload; return this; }
  update(payload: Row) { this.operation = 'update'; this.payload = payload; return this; }
  delete() { this.operation = 'delete'; return this; }

  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<Result> {
    const body = { op: this.operation, filters: this.filters.length, ordering: this.ordering, limit: this.maxRows, single: this.singleRow, payload: this.payload };

    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/db/${encodeURIComponent(this.table)}`, {
          method: this.operation === 'select' ? 'GET' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: this.operation === 'select' ? undefined : JSON.stringify(body),
        });
        if (response.ok) return await response.json();
      } catch {}
    }

    const db = getDb();
    let rows = [...(db[this.table] || [])];
    for (const filter of this.filters) rows = rows.filter(filter);
    if (this.ordering) {
      const { field, ascending } = this.ordering;
      rows.sort((a, b) => {
        const av = a[field], bv = b[field];
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * (ascending ? 1 : -1);
      });
    }

    if (this.operation === 'insert') {
      const input = Array.isArray(this.payload) ? this.payload : [this.payload || {}];
      const created = input.map(row => ({ id: row.id || id(), created_at: row.created_at || new Date().toISOString(), updated_at: new Date().toISOString(), ...row }));
      db[this.table] = [...(db[this.table] || []), ...created];
      saveDb(db);
      return { data: this.singleRow ? created[0] : created, error: null };
    }

    if (this.operation === 'update') {
      const updated = rows.map(row => ({ ...row, ...(this.payload || {}), updated_at: new Date().toISOString() }));
      const ids = new Set(rows.map(r => r.id));
      db[this.table] = (db[this.table] || []).map(row => ids.has(row.id) ? (updated.find(u => u.id === row.id) || row) : row);
      saveDb(db);
      return { data: updated, error: null };
    }

    if (this.operation === 'delete') {
      const ids = new Set(rows.map(r => r.id));
      db[this.table] = (db[this.table] || []).filter(row => !ids.has(row.id));
      saveDb(db);
      return { data: null, error: null };
    }

    if (this.maxRows !== null) rows = rows.slice(0, this.maxRows);
    if (this.singleRow) return { data: rows[0] || null, error: rows[0] ? null : { message: 'No rows found' } };
    return { data: rows, error: null };
  }
}

export const supabase = {
  from(table: string) { return new QueryBuilder(table); },
};
