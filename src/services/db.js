// Relational Local Storage Database Engine for Sawera Sweets & Bakers
// Manages reactive state across Customer, Staff, Rider, and Admin views with window custom events.

import { CATEGORIES } from '../data/categories.js';
import { PRODUCTS } from '../data/products.js';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { DEFAULT_BOX_OPTIONS } from '../data/boxStudioConfig.js';
import { DEFAULT_OCCASIONS } from '../data/occasionsConfig.js';

const DB_VERSION = 'sawera_v3.0';
const EVENT_NAME = 'sawera-db-change';

const defaultBranches = [
  {
    id: "shop-1",
    name: "Sawera Sweets & Bakers (Main Store)",
    nameUrdu: "سویرا سویٹس اینڈ بیکرز (مرکزی اسٹور)",
    address: "Gojra Road, Opposite DHQ Hospital, Jhang",
    addressUrdu: "گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ",
    city: "Jhang",
    whatsapp: "0322 7434080",
    phone: "0322 7434080",
    email: "sawerasweets.pk@gmail.com",
    timings: "5:30 AM - 12:00 AM (Midnight), Every Day",
    isOpen: true,
    deliveryEnabled: true,
    pickupEnabled: false, // Turned off per user request; will be enabled later
    isArchived: false,
    isMain: true
  }
];

const defaultSettings = {
  storeName: "Sawera Sweets & Bakers",
  storeNameUrdu: "سویرا سویٹس اینڈ بیکرز",
  mottoUrdu: "ہر خوشی کیساتھ",
  tagline: "Authentic Sweets, Fresh Bakery & Daily Mart Essentials",
  establishedYear: "1994",
  yearsOfService: "30+",
  maintenanceMode: false,
  maintenanceMessage: "We are currently performing routine maintenance to improve our service. Please check back shortly!",
  taxRate: 0,
  loyaltyPointsRate: 100, // 1 point for every 100 PKR spent
  minOrderAmount: 250,
  freeDeliveryThreshold: 3000,
  defaultDeliveryFee: 100,
  deliveryOptions: {
    inCityFee: 100,
    inCityLabel: "Inside Jhang City (جھنگ شہر)",
    outCityFee: 250,
    outCityLabel: "Outside Jhang / Other Cities (دیگر شہر)",
    freeDeliveryThreshold: 3000
  },
  deliveryTiers: [
    { id: "tier-1", maxKm: 5, fee: 100, label: "Local (0 - 5 km)" },
    { id: "tier-2", maxKm: 12, fee: 180, label: "City Wide (5 - 12 km)" },
    { id: "tier-3", maxKm: 25, fee: 280, label: "Suburbs (12 - 25 km)" },
    { id: "tier-4", maxKm: 999, fee: 450, label: "All Pakistan Express" }
  ],
  payments: {
    cod: { enabled: true, title: "Cash on Delivery (COD)" },
    easypaisa: {
      enabled: true,
      title: "Easypaisa",
      number: "0322 7434080",
      accountTitle: "Muhammad Akash",
      instructions: "Transfer to Easypaisa Account 0322 7434080 (Muhammad Akash) and upload your payment screenshot."
    },
    bank: {
      enabled: true,
      title: "Direct Bank Transfer (MCB)",
      bankName: "MCB Bank Limited",
      accountTitle: "Sawera Sweets and Bakers",
      accountNumber: "[MCB ACCOUNT NUMBER - CONFIGURE IN ADMIN]",
      iban: "[PKXX MUCB XXXX XXXX XXXX - CONFIGURE IN ADMIN]",
      instructions: "Transfer to our MCB Bank account and upload your deposit slip or mobile banking receipt screenshot."
    }
  },
  integrations: {
    whatsapp: {
      apiKey: "",
      senderPhone: "0322 7434080",
      autoNotifyOrder: true
    },
    smtp: {
      host: "",
      port: 587,
      user: "",
      senderEmail: "sawerasweets.pk@gmail.com"
    }
  }
};

const defaultUsers = [
  {
    id: "usr-admin",
    name: "Muhammad Akash (Owner)",
    email: "admin@sawerasweets.pk",
    phone: "0322 7434080",
    password: "admin123",
    role: "owner_admin",
    assignedBranch: "all",
    permissions: ["all"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "usr-staff",
    name: "Shop 1 Lead Staff",
    email: "staff@sawerasweets.pk",
    phone: "0322 7434080",
    password: "staff123",
    role: "staff",
    assignedBranch: "shop-1",
    permissions: ["view_orders", "manage_orders", "view_products", "manage_stock", "view_customers"],
    expiresAt: null,
    isActive: true,
    createdAt: "2024-02-15T00:00:00.000Z"
  },
  {
    id: "usr-rider",
    name: "Rider Tariq (Express)",
    email: "rider@sawerasweets.pk",
    phone: "0300 7654321",
    password: "rider123",
    role: "rider",
    assignedBranch: "shop-1",
    vehicle: "Honda 125 (JHG-8842)",
    commissionRate: 80,
    isActive: true,
    createdAt: "2024-03-01T00:00:00.000Z"
  },
  {
    id: "usr-customer",
    name: "Muhammad Usman",
    email: "customer@sawerasweets.pk",
    phone: "0312 9876543",
    password: "customer123",
    role: "customer",
    loyaltyPoints: 180,
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        recipientName: "Muhammad Usman",
        phone: "0312 9876543",
        address: "House 24, Street 5, Civil Lines, Near DHQ",
        city: "Jhang",
        isDefault: true
      },
      {
        id: "addr-2",
        label: "Office",
        recipientName: "Muhammad Usman",
        phone: "0312 9876543",
        address: "Commercial Plaza, Ground Floor, Session Chowk",
        city: "Jhang",
        isDefault: false
      }
    ],
    isActive: true,
    createdAt: "2024-03-10T00:00:00.000Z"
  }
];

const defaultBanners = [
  {
    id: "ban-1",
    title: "Pure Desi Ghee Traditional Sweets",
    titleUrdu: "خالص دیسی گھی کی روایتی مٹھائیاں",
    subtitle: "Prepared fresh daily using pure ingredients with 30+ years of excellence",
    subtitleUrdu: "روزانہ خالص اجزاء اور تیس سالہ روایت کے ساتھ تازہ تیار شدہ",
    category: "sweets",
    link: "/category/sweets",
    badge: "Authentic Tradition",
    bgColor: "from-emerald-900 via-emerald-800 to-teal-950",
    buttonText: "Order Fresh Sweets",
    active: true
  },
  {
    id: "ban-2",
    title: "Oven Fresh Cakes & Tea Bakery",
    titleUrdu: "اوون فریش کیک اور بیکری آئٹمز",
    subtitle: "Celebration cakes, crunchy almond biscuits, and tea rusks baked every morning",
    subtitleUrdu: "سالگرہ کے کیک، بادامی بسکٹ اور کرسپی رسک روزانہ دستیاب",
    category: "bakery",
    link: "/category/bakery",
    badge: "Baked Every Morning",
    bgColor: "from-amber-900 via-amber-800 to-amber-950",
    buttonText: "Browse Fresh Bakery",
    active: true
  },
  {
    id: "ban-3",
    title: "Daily Kiryana, Grocery & Fragrances",
    titleUrdu: "روزمرہ راشن، کریانہ اور پرفیومز",
    subtitle: "Super kernel basmati rice, pure desi ghee, cosmetics, and non-alcoholic attars",
    subtitleUrdu: "باسمتی چاول، خالص دیسی گھی، کاسمیٹکس اور خوشبودار عطر",
    category: "grocery",
    link: "/products",
    badge: "Store Essentials",
    bgColor: "from-emerald-950 via-teal-900 to-emerald-900",
    buttonText: "Shop All Essentials",
    active: true
  }
];

const defaultFaqs = [
  {
    id: "faq-1",
    question: "Where is Sawera Sweets & Bakers located?",
    questionUrdu: "سویرا سویٹس اینڈ بیکرز کی شاپ کہاں واقع ہے؟",
    answer: "Our main store (Shop 1) is located at Gojra Road, Opposite DHQ Hospital, Jhang. We also support multiple local branches across the city.",
    answerUrdu: "ہمارا مرکزی اسٹور (شاپ ۱) گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال جھنگ پر واقع ہے۔",
    category: "general"
  },
  {
    id: "faq-2",
    question: "Do you offer delivery across Pakistan?",
    questionUrdu: "کیا پورے پاکستان میں ڈلیوری دستیاب ہے؟",
    answer: "Yes! We offer fast local delivery in Jhang and express safe courier shipping across all major cities in Pakistan for dry sweets, bakery tins, attars, and groceries.",
    answerUrdu: "جی ہاں! جھنگ شہر میں فوری لوکل ہوم ڈلیوری اور دیگر شہروں کے لیے محفوظ کورئیر سروس دستیاب ہے۔",
    category: "delivery"
  },
  {
    id: "faq-3",
    question: "What are your payment options?",
    questionUrdu: "ادائیگی کے کون سے طریقے موجود ہیں؟",
    answer: "We support Cash on Delivery (COD), Easypaisa mobile wallet (0322 7434080 - Muhammad Akash), and direct MCB Bank Transfer with payment proof receipt upload.",
    answerUrdu: "کیش آن ڈلیوری، ایزی پیسہ (0322 7434080) اور ایم سی بی بینک ٹرانسفر کے ذریعے ادائیگی ممکن ہے۔",
    category: "payments"
  },
  {
    id: "faq-4",
    question: "What is your return and exchange policy?",
    questionUrdu: "واپسی یا تبادلے کی کیا پالیسی ہے؟",
    answer: "As per food and hygiene standards, we do not accept returns. However, in the rare event that a product is defective or damaged during transit, an immediate exchange will be arranged.",
    answerUrdu: "کھانے پینے کی اشیاء کی واپسی ممکن نہیں، تاہم خرابی یا نقصان کی صورت میں فوری متبادل دیا جاتا ہے۔",
    category: "policy"
  }
];

// Clean product seed
const seedInitialProducts = () => {
  return PRODUCTS.map((prod) => ({
    ...prod,
    isActive: prod.isActive !== false,
    stocks: prod.stocks || {
      "shop-1": 50
    },
    stockStatus: prod.stockStatus || "in_stock",
    inStock: prod.inStock !== false,
    lowStockThreshold: 10,
    unitType: prod.unit?.toLowerCase().includes("kg") ? "kg" : prod.unit?.toLowerCase().includes("liter") ? "liter" : "piece",
    allowsDecimalQuantity: Boolean(prod.unit?.toLowerCase().includes("kg") || prod.unit?.toLowerCase().includes("liter"))
  }));
};

const defaultOrders = [];
const defaultStockRequests = [];
const defaultReviews = [];
const defaultQuestions = [];
const defaultTickets = [];
const defaultChats = [];

const defaultActivityLogs = [
  {
    id: "act-1",
    action: "System Initialized",
    details: "Production database initialized with Shop 1 real Jhang business data and 6 official categories.",
    performedBy: "System",
    timestamp: "2026-09-25T07:00:00.000Z"
  },
  {
    id: "act-2",
    action: "Stock Request Submitted",
    details: "Shop 1 Lead Staff requested +25 kg addition for Pure Desi Ghee Gulab Jamun.",
    performedBy: "Shop 1 Lead Staff",
    timestamp: "2026-09-25T08:30:00.000Z"
  },
  {
    id: "act-3",
    action: "Order Dispatched",
    details: "Order SAV-108291 handed over to Rider Tariq for DHQ area delivery.",
    performedBy: "Shop 1 Staff",
    timestamp: "2026-09-24T15:10:00.000Z"
  }
];

// In-memory / LocalStorage Database Class
class SaweraDB {
  constructor() {
    this.init();
  }

  init() {
    try {
      const storedVersion = localStorage.getItem('sawera_db_version');
      if (storedVersion !== DB_VERSION) {
        // NON-DESTRUCTIVE INITIALIZATION:
        // Only seed collections that are completely missing (null in localStorage).
        // NEVER overwrite existing collections like users, settings, categories, products!
        this.seedInitialMissing();
        localStorage.setItem('sawera_db_version', DB_VERSION);
      } else {
        // Migration safeguard: Ensure only 1 branch exists
        const currentBranches = this.get('branches');
        if (!Array.isArray(currentBranches) || currentBranches.length !== 1 || currentBranches[0].id !== 'shop-1') {
          this.set('branches', defaultBranches);
        }
      }

      // Non-destructive catalog check: Ensure all 16 catalog items exist and stale demo prices are upgraded
      try {
        const deletedIds = this.get('deleted_product_ids') || [];
        const currentProds = this.get('products') || [];
        const catalogProds = seedInitialProducts();
        const officialIds = new Set(catalogProds.map(p => p.id));
        
        // Clean official catalog IDs from deleted_product_ids so authentic products are never suppressed
        const cleanDeletedIds = deletedIds.filter(id => !officialIds.has(id));
        if (cleanDeletedIds.length !== deletedIds.length) {
          this.setLocal('deleted_product_ids', cleanDeletedIds);
        }

        let hasProdsUpdate = false;
        const updatedProds = [...currentProds];

        for (const cp of catalogProds) {
          const foundIdx = updatedProds.findIndex(p => p.id === cp.id);
          if (foundIdx === -1) {
            // Missing product backfill! (Guarantees Admin Panel gets all 16 products)
            updatedProds.push(cp);
            hasProdsUpdate = true;
          } else {
            const existing = updatedProds[foundIdx];
            let itemUpdated = false;
            const patched = { ...existing };

            // Upgrade any stale demo prices (1400, 1300, 1200, 1600 or missing discountPrice) to authentic rates
            const isStaleDemoPrice = 
              (patched.price === 1400 || patched.price === 1300 || patched.price === 1200 || patched.price === 1600) &&
              (!patched.discountPrice || patched.discountPrice === 1200 || patched.discountPrice === 1300 || patched.discountPrice === 1400);
            
            const isStale600 = patched.variations?.some(v => v.price === 650 && v.discountPrice === 600);

            if (isStaleDemoPrice || isStale600) {
              patched.price = cp.price;
              patched.discountPrice = cp.discountPrice;
              patched.variations = cp.variations;
              patched.unit = cp.unit;
              itemUpdated = true;
            }

            if (!patched.image && cp.image) {
              patched.image = cp.image;
              itemUpdated = true;
            }
            if (!patched.urduDescription && cp.urduDescription) {
              patched.urduDescription = cp.urduDescription;
              itemUpdated = true;
            }
            if (!patched.urduName && cp.urduName) {
              patched.urduName = cp.urduName;
              itemUpdated = true;
            }
            if (!patched.variations || patched.variations.length === 0) {
              patched.variations = cp.variations;
              itemUpdated = true;
            }

            if (itemUpdated) {
              updatedProds[foundIdx] = patched;
              hasProdsUpdate = true;
            }
          }
        }

        const cleanedProds = updatedProds.filter(p => !cleanDeletedIds.includes(p.id));
        if (cleanedProds.length !== currentProds.length || hasProdsUpdate) {
          this.setLocal('products', cleanedProds);
        }
      } catch (err) {
        console.warn('Catalog merge error in init:', err);
      }

      // Non-destructive category check: Preserve admin isActive status
      try {
        const curCats = this.get('categories');
        if (Array.isArray(curCats) && curCats.length > 0) {
          let hasCatsUpdate = false;
          const updatedCats = [...curCats];

          for (const cat of CATEGORIES) {
            const foundIdx = updatedCats.findIndex(c => c.id === cat.id || c.slug === cat.slug);
            if (foundIdx === -1) {
              updatedCats.push({ ...cat, isActive: true });
              hasCatsUpdate = true;
            } else {
              // CRITICAL: Preserve existing isActive state! NEVER revert to true!
              const existing = updatedCats[foundIdx];
              if (existing.isActive === undefined) {
                updatedCats[foundIdx] = { ...cat, ...existing, isActive: true };
                hasCatsUpdate = true;
              }
            }
          }

          if (hasCatsUpdate) {
            this.setLocal('categories', updatedCats);
          }
        }
      } catch (err) {
        console.warn('Categories merge error in init:', err);
      }

      // Admin Security Safeguard: Restore saved admin password if customized
      try {
        const adminSec = localStorage.getItem('sawera_admin_security');
        if (adminSec) {
          const parsedSec = JSON.parse(adminSec);
          if (parsedSec?.password) {
            const curUsers = this.get('users');
            if (Array.isArray(curUsers) && curUsers.length > 0) {
              let passChanged = false;
              const patchedUsers = curUsers.map(u => {
                if ((u.role === 'owner_admin' || u.role === 'super_admin' || u.email === (parsedSec.adminEmail || 'admin@sawerasweets.pk')) && u.password !== parsedSec.password) {
                  passChanged = true;
                  return { ...u, password: parsedSec.password };
                }
                return u;
              });
              if (passChanged) {
                localStorage.setItem('sawera_users', JSON.stringify(patchedUsers));
              }
            }
          }
        }
      } catch (e) {
        console.warn('Admin security check error:', e);
      }

      // Safeguard: Ensure cached active user session reflects Muhammad Akash
      try {
        const curUser = localStorage.getItem('sawera_user');
        if (curUser && curUser.includes('Haji Muhammad')) {
          const parsed = JSON.parse(curUser);
          parsed.name = "Muhammad Akash (Owner)";
          localStorage.setItem('sawera_user', JSON.stringify(parsed));
        }
      } catch (e) {}

      // Migrate any cached phone numbers in branches/settings to 0322 7434080
      try {
        const branches = this.get('branches');
        if (Array.isArray(branches) && branches.some(b => b.whatsapp?.includes('0347') || b.phone?.includes('0347') || b.whatsapp?.includes('0348') || b.phone?.includes('0348'))) {
          const updatedBranches = branches.map(b => ({
            ...b,
            whatsapp: '0322 7434080',
            phone: '0322 7434080'
          }));
          this.set('branches', updatedBranches);
        }

        const sets = this.get('settings');
        let hasSetsUpdate = false;
        if (sets?.integrations?.whatsapp?.senderPhone?.includes('0347') || sets?.integrations?.whatsapp?.senderPhone?.includes('0348')) {
          sets.integrations.whatsapp.senderPhone = '0322 7434080';
          hasSetsUpdate = true;
        }
        if (sets?.payments?.easypaisa?.number && (sets.payments.easypaisa.number.includes('0348') || sets.payments.easypaisa.number.includes('0347'))) {
          sets.payments.easypaisa.number = '0322 7434080';
          sets.payments.easypaisa.instructions = "Transfer to Easypaisa Account 0322 7434080 (Muhammad Akash) and upload your payment screenshot.";
          hasSetsUpdate = true;
        }
        if (hasSetsUpdate) {
          this.set('settings', sets);
        }
      } catch (e) {}

      // Additive safeguard: Ensure Box Studio Options and Occasions are initialized
      try {
        const currentBoxes = this.get('boxOptions');
        if (!Array.isArray(currentBoxes) || currentBoxes.length === 0) {
          this.set('boxOptions', DEFAULT_BOX_OPTIONS);
        }
        const currentOccasions = this.get('occasions');
        if (!Array.isArray(currentOccasions) || currentOccasions.length === 0) {
          this.set('occasions', DEFAULT_OCCASIONS);
        }
      } catch (e) {
        console.warn('Box options init error:', e);
      }

      // Cross-Device Server Sync (Mobile + Desktop Authoritative State)
      this.syncFromServer();

      // Supabase Cloud Sync & Realtime Subscription
      if (isSupabaseConfigured && supabase) {
        this.syncFromSupabase();
        this.subscribeToSupabase();
      }
    } catch (e) {
      console.warn('LocalStorage error during init:', e);
      this.seedInitialMissing();
    }
  }

  seedInitialMissing() {
    if (localStorage.getItem('sawera_branches') === null) {
      this.setLocal('branches', defaultBranches);
    }
    if (localStorage.getItem('sawera_settings') === null) {
      this.setLocal('settings', defaultSettings);
    }
    if (localStorage.getItem('sawera_users') === null) {
      this.setLocal('users', defaultUsers);
    }
    if (localStorage.getItem('sawera_categories') === null) {
      this.setLocal('categories', CATEGORIES.map(c => ({ ...c, isActive: true })));
    }
    if (localStorage.getItem('sawera_products') === null) {
      this.setLocal('products', seedInitialProducts());
    }
    if (localStorage.getItem('sawera_orders') === null) {
      this.setLocal('orders', defaultOrders);
    }
    if (localStorage.getItem('sawera_stockRequests') === null) {
      this.setLocal('stockRequests', defaultStockRequests);
    }
    if (localStorage.getItem('sawera_reviews') === null) {
      this.setLocal('reviews', defaultReviews);
    }
    if (localStorage.getItem('sawera_questions') === null) {
      this.setLocal('questions', defaultQuestions);
    }
    if (localStorage.getItem('sawera_tickets') === null) {
      this.setLocal('tickets', defaultTickets);
    }
    if (localStorage.getItem('sawera_chats') === null) {
      this.setLocal('chats', defaultChats);
    }
    if (localStorage.getItem('sawera_banners') === null) {
      this.setLocal('banners', defaultBanners);
    }
    if (localStorage.getItem('sawera_faqs') === null) {
      this.setLocal('faqs', defaultFaqs);
    }
    if (localStorage.getItem('sawera_boxOptions') === null) {
      this.setLocal('boxOptions', DEFAULT_BOX_OPTIONS);
    }
    if (localStorage.getItem('sawera_occasions') === null) {
      this.setLocal('occasions', DEFAULT_OCCASIONS);
    }
    if (localStorage.getItem('sawera_activityLogs') === null) {
      this.setLocal('activityLogs', defaultActivityLogs);
    }
    if (localStorage.getItem('sawera_contactMessages') === null) {
      this.setLocal('contactMessages', []);
    }
    this.broadcast();
  }

  seedInitial() {
    this.set('branches', defaultBranches);
    this.set('settings', defaultSettings);
    this.set('users', defaultUsers);
    this.set('categories', CATEGORIES);
    this.set('products', seedInitialProducts());
    this.set('orders', defaultOrders);
    this.set('stockRequests', defaultStockRequests);
    this.set('reviews', defaultReviews);
    this.set('questions', defaultQuestions);
    this.set('tickets', defaultTickets);
    this.set('chats', defaultChats);
    this.set('banners', defaultBanners);
    this.set('faqs', defaultFaqs);
    this.set('boxOptions', DEFAULT_BOX_OPTIONS);
    this.set('occasions', DEFAULT_OCCASIONS);
    this.set('activityLogs', defaultActivityLogs);
    this.set('contactMessages', []);
    this.broadcast();
  }

  setLocal(collection, data) {
    try {
      localStorage.setItem(`sawera_${collection}`, JSON.stringify(data));
      this.broadcast();
    } catch (e) {
      console.error(`Error writing local ${collection}:`, e);
    }
  }

  get(collection) {
    try {
      const item = localStorage.getItem(`sawera_${collection}`);
      if (!item) {
        if (collection === 'settings') return defaultSettings;
        return [];
      }
      const parsed = JSON.parse(item);
      if (collection === 'settings') {
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          return defaultSettings;
        }
        return { ...defaultSettings, ...parsed };
      }
      return parsed;
    } catch (e) {
      console.error(`Error reading ${collection}:`, e);
      if (collection === 'settings') return defaultSettings;
      return [];
    }
  }

  set(collection, data) {
    try {
      localStorage.setItem(`sawera_${collection}`, JSON.stringify(data));
      this.broadcast();

      // Cross-Device Server Persistence (Ensures mobile and desktop show matching data)
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        try {
          fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection, data })
          }).catch(() => {});
        } catch (e) {}
      }

      // Cloud Persistence via Supabase
      if (isSupabaseConfigured && supabase) {
        if (collection === 'settings') {
          supabase.from('sawera_settings').upsert({
            id: 'settings',
            data,
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (error) console.warn("Supabase settings sync error:", error.message);
          });
        } else if (collection === 'categories') {
          supabase.from('sawera_settings').upsert({
            id: 'categories',
            data,
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (error) console.warn("Supabase categories sync error:", error.message);
          });
        } else if (collection === 'deleted_product_ids') {
          supabase.from('sawera_settings').upsert({
            id: 'deleted_product_ids',
            data,
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (error) console.warn("Supabase deleted_product_ids sync error:", error.message);
          });
        }
      }
    } catch (e) {
      console.error(`Error writing ${collection}:`, e);
    }
  }

  async syncFromServer() {
    if (typeof window === 'undefined' || typeof fetch !== 'function') return;
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return;
      const json = await res.json();
      if (!json?.success || !json.data) return;

      const serverStore = json.data;

      // 0. Merge deleted product IDs first
      const serverDeletedIds = serverStore.deleted_product_ids;
      const localDeletedIds = this.get('deleted_product_ids') || [];
      if (Array.isArray(serverDeletedIds) && serverDeletedIds.length > 0) {
        const combined = Array.from(new Set([...localDeletedIds, ...serverDeletedIds]));
        if (combined.length !== localDeletedIds.length) {
          localStorage.setItem('sawera_deleted_product_ids', JSON.stringify(combined));
        }
      }

      // 1. Merge Products (protecting deleted products and custom variations)
      const currentDeleted = this.get('deleted_product_ids') || [];
      if (Array.isArray(serverStore.products) && serverStore.products.length > 0) {
        const validServerProds = serverStore.products.filter(p => p && p.id && !currentDeleted.includes(p.id));
        const localProds = this.get('products') || [];
        const mergedProds = [...localProds];

        for (const sp of validServerProds) {
          const idx = mergedProds.findIndex(p => p.id === sp.id);
          if (idx === -1) {
            mergedProds.push(sp);
          } else {
            mergedProds[idx] = { ...mergedProds[idx], ...sp };
          }
        }
        const cleaned = mergedProds.filter(p => !currentDeleted.includes(p.id));
        localStorage.setItem('sawera_products', JSON.stringify(cleaned));
      }

      // 2. Merge Categories (preserves isActive)
      if (Array.isArray(serverStore.categories) && serverStore.categories.length > 0) {
        const localCats = this.getCategories();
        const mergedCats = localCats.map(lc => {
          const sc = serverStore.categories.find(c => c.id === lc.id || c.slug === lc.slug);
          if (sc && sc.isActive !== undefined) {
            return { ...lc, ...sc, isActive: sc.isActive };
          }
          return lc;
        });
        localStorage.setItem('sawera_categories', JSON.stringify(mergedCats));
      }

      // 3. Merge Settings
      if (serverStore.settings && typeof serverStore.settings === 'object' && !Array.isArray(serverStore.settings)) {
        const localSettings = this.getSettings();
        localStorage.setItem('sawera_settings', JSON.stringify({ ...localSettings, ...serverStore.settings }));
      }

      // 4. Merge Admin Security
      if (serverStore.admin_security?.password) {
        const users = this.get('users');
        const adminPass = serverStore.admin_security.password;
        const updatedUsers = users.map(u => {
          if ((u.role === 'owner_admin' || u.role === 'super_admin' || u.email === 'admin@sawerasweets.pk') && u.password !== adminPass) {
            return { ...u, password: adminPass };
          }
          return u;
        });
        localStorage.setItem('sawera_users', JSON.stringify(updatedUsers));
        localStorage.setItem('sawera_admin_security', JSON.stringify(serverStore.admin_security));
      }

      this.broadcast();
    } catch (e) {
      // Quiet fail if /api/sync is not running or unreachable
    }
  }

  async syncFromSupabase() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 0. Fetch Deleted Product IDs first to protect deletion state
      const { data: delSetting } = await supabase.from('sawera_settings').select('*').eq('id', 'deleted_product_ids').maybeSingle();
      let cloudDeletedIds = [];
      if (delSetting?.data && Array.isArray(delSetting.data)) {
        cloudDeletedIds = delSetting.data;
      }
      const localDeletedIds = this.get('deleted_product_ids') || [];
      const combinedDeletedIds = Array.from(new Set([...localDeletedIds, ...cloudDeletedIds]));
      
      // Clean official catalog IDs from combinedDeletedIds so authentic products are NEVER suppressed
      const catalogProds = seedInitialProducts();
      const officialIds = new Set(catalogProds.map(p => p.id));
      const cleanCombinedDeletedIds = combinedDeletedIds.filter(id => !officialIds.has(id));

      if (cleanCombinedDeletedIds.length !== localDeletedIds.length) {
        localStorage.setItem('sawera_deleted_product_ids', JSON.stringify(cleanCombinedDeletedIds));
      }

      // 1. Fetch Products
      const { data: prods, error: pErr } = await supabase.from('sawera_products').select('*');
      if (!pErr && Array.isArray(prods)) {
        if (prods.length === 0) {
          // Brand new empty Supabase table: seed initial 16 authentic products to cloud!
          for (const lp of catalogProds) {
            if (!cleanCombinedDeletedIds.includes(lp.id)) {
              await supabase.from('sawera_products').upsert({
                id: lp.id,
                data: lp,
                updated_at: new Date().toISOString()
              }).catch(() => {});
            }
          }
          this.setLocal('products', catalogProds.filter(p => !cleanCombinedDeletedIds.includes(p.id)));
        } else {
          const cloudProducts = prods.map(p => p.data).filter(p => p && p.id);
          const localProds = this.get('products') || [];
          
          const mergedMap = new Map();
          // 1. Seed with authentic catalog
          for (const cp of catalogProds) {
            mergedMap.set(cp.id, cp);
          }
          // 2. Cloud products from Supabase take priority (authoritative cloud prices and variations)
          for (const cp of cloudProducts) {
            if (cp && cp.id) {
              const base = mergedMap.get(cp.id) || {};
              mergedMap.set(cp.id, { ...base, ...cp });
            }
          }
          // 3. Local custom products
          for (const lp of localProds) {
            if (lp && lp.id && !mergedMap.has(lp.id) && !cleanCombinedDeletedIds.includes(lp.id)) {
              mergedMap.set(lp.id, lp);
            }
          }
          const finalProds = Array.from(mergedMap.values()).filter(p => !cleanCombinedDeletedIds.includes(p.id));
          this.setLocal('products', finalProds);
        }
      }

      // 2. Fetch Orders from Supabase
      await this.syncOrdersFromSupabase();

      // 3. Fetch Settings
      const { data: sets, error: sErr } = await supabase.from('sawera_settings').select('*').eq('id', 'settings').maybeSingle();
      if (!sErr && sets?.data) {
        const localSettings = this.getSettings();
        this.setLocal('settings', { ...localSettings, ...sets.data });
      }

      // 4. Fetch Categories - preserve isActive status
      const { data: catSetting, error: cErr } = await supabase.from('sawera_settings').select('*').eq('id', 'categories').maybeSingle();
      if (!cErr && catSetting?.data && Array.isArray(catSetting.data)) {
        const localCats = this.getCategories();
        const mergedCats = localCats.map(lc => {
          const cloudCat = catSetting.data.find(cc => cc.id === lc.id || cc.slug === lc.slug);
          if (cloudCat && cloudCat.isActive !== undefined) {
            return { ...lc, ...cloudCat, isActive: cloudCat.isActive };
          }
          return lc;
        });
        this.setLocal('categories', mergedCats);
      } else if (!cErr && !catSetting) {
        // Initial seed categories to Supabase
        const currentCats = this.getCategories();
        supabase.from('sawera_settings').upsert({
          id: 'categories',
          data: currentCats,
          updated_at: new Date().toISOString()
        }).catch(() => {});
      }

      // 5. Fetch Admin Security (Password persistence)
      const { data: secSetting, error: secErr } = await supabase.from('sawera_settings').select('*').eq('id', 'admin_security').maybeSingle();
      if (!secErr && secSetting?.data?.password) {
        const users = this.get('users');
        const adminEmail = secSetting.data.adminEmail || 'admin@sawerasweets.pk';
        const savedPass = secSetting.data.password;
        let userUpdated = false;
        const updatedUsers = users.map(u => {
          if ((u.email?.toLowerCase() === adminEmail.toLowerCase() || u.role === 'owner_admin' || u.role === 'super_admin') && u.password !== savedPass) {
            userUpdated = true;
            return { ...u, password: savedPass };
          }
          return u;
        });
        if (userUpdated) {
          this.setLocal('users', updatedUsers);
          localStorage.setItem('sawera_admin_security', JSON.stringify(secSetting.data));
          const currentUserStr = localStorage.getItem('sawera_current_user');
          if (currentUserStr) {
            try {
              const cur = JSON.parse(currentUserStr);
              if (cur.email?.toLowerCase() === adminEmail.toLowerCase() || cur.role === 'owner_admin') {
                cur.password = savedPass;
                localStorage.setItem('sawera_current_user', JSON.stringify(cur));
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.warn('Initial Supabase sync error:', err);
    }
  }

  subscribeToSupabase() {
    if (!isSupabaseConfigured || !supabase || this.realtimeSubscribed) return;
    try {
      this.realtimeSubscribed = true;
      supabase
        .channel('sawera_cloud_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_products' }, (payload) => {
          const current = this.getProducts();
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = payload.new.data;
            const updated = current.some(p => p.id === item.id)
              ? current.map(p => p.id === item.id ? item : p)
              : [item, ...current];
            this.setLocal('products', updated);
          } else if (payload.eventType === 'DELETE') {
            const filtered = current.filter(p => p.id !== payload.old.id);
            this.setLocal('products', filtered);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_orders' }, (payload) => {
          const current = this.getOrders();
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = payload.new.data;
            const updated = current.some(o => o.id === item.id)
              ? current.map(o => o.id === item.id ? item : o)
              : [item, ...current];
            this.setLocal('orders', updated);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_settings' }, (payload) => {
          if (payload.new?.id === 'categories' && Array.isArray(payload.new?.data)) {
            this.setLocal('categories', payload.new.data);
          } else if (payload.new?.id === 'settings' && payload.new?.data) {
            this.setLocal('settings', payload.new.data);
          } else if (payload.new?.data) {
            this.setLocal('settings', payload.new.data);
          }
        })
        .subscribe();
    } catch (err) {
      this.realtimeSubscribed = false;
      console.warn('Supabase realtime subscription error:', err);
    }
  }

  broadcast() {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      }
    } catch (e) {
      // Ignore in non-browser context
    }
  }

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(EVENT_NAME, callback);
    return () => window.removeEventListener(EVENT_NAME, callback);
  }

  // Activity Log Helper
  logActivity(action, details, performedBy = 'Admin') {
    const logs = this.get('activityLogs');
    const newLog = {
      id: `act-${Date.now()}`,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString()
    };
    this.set('activityLogs', [newLog, ...logs.slice(0, 99)]);
  }

  // Branch Operations
  getBranches() {
    return this.get('branches');
  }

  getBranchById(id) {
    const branches = this.getBranches();
    return branches.find(b => b.id === id);
  }

  updateBranch(id, updates) {
    const branches = this.getBranches().map(b => b.id === id ? { ...b, ...updates } : b);
    this.set('branches', branches);
    this.logActivity('Branch Updated', `Branch ${id} details updated.`);
    return true;
  }

  // Category Operations
  getCategories() {
    const cats = this.get('categories');
    if (!Array.isArray(cats) || cats.length === 0) {
      return CATEGORIES.map(c => ({ ...c, isActive: true }));
    }
    return cats.map(c => ({ ...c, isActive: c.isActive !== false }));
  }

  toggleCategoryActive(slugOrId) {
    const cats = this.getCategories();
    let target = null;
    const updated = cats.map(c => {
      if (c.id === slugOrId || c.slug === slugOrId) {
        const nextState = c.isActive === false ? true : false;
        target = { ...c, isActive: nextState };
        return target;
      }
      return c;
    });

    this.set('categories', updated);
    if (target) {
      this.logActivity('Category Status Changed', `Category "${target.name}" is now ${target.isActive ? 'Active (Live)' : 'Inactive (Off)'}.`);
    }
    this.broadcast();
    return target;
  }

  saveCategory(catData) {
    const cats = this.getCategories();
    let updated;
    const exists = cats.some(c => c.id === catData.id || c.slug === catData.slug);
    if (exists) {
      updated = cats.map(c => (c.id === catData.id || c.slug === catData.slug) ? { ...c, ...catData } : c);
    } else {
      updated = [...cats, { ...catData, id: catData.id || catData.slug, isActive: catData.isActive !== false }];
    }
    this.set('categories', updated);
    this.logActivity('Category Saved', `Category "${catData.name}" was saved.`);
    this.broadcast();
    return true;
  }

  // Product Operations
  getProducts() {
    const deletedIds = this.get('deleted_product_ids') || [];
    const prods = this.get('products');

    if (!Array.isArray(prods) || prods.length === 0) {
      if (localStorage.getItem('sawera_products') === null) {
        const catalog = seedInitialProducts().filter(c => !deletedIds.includes(c.id));
        this.set('products', catalog);
        return catalog;
      }
      return [];
    }

    return prods.filter(p => !deletedIds.includes(p.id));
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(productData) {
    const products = this.getProducts();
    let productToSave;
    if (productData.id && products.some(p => p.id === productData.id)) {
      productToSave = { 
        ...products.find(p => p.id === productData.id), 
        ...productData,
        updatedAt: new Date().toISOString()
      };
      const updated = products.map(p => p.id === productData.id ? productToSave : p);
      this.set('products', updated);
      this.logActivity('Product Updated', `Product ${productData.name} updated.`);
    } else {
      productToSave = {
        ...productData,
        id: productData.id || `prd-${Date.now()}`,
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.set('products', [productToSave, ...products]);
      this.logActivity('Product Added', `New product ${productToSave.name} added.`);
    }

    // If this product was previously in deletedIds, unmark it
    const deletedIds = this.get('deleted_product_ids') || [];
    if (deletedIds.includes(productToSave.id)) {
      this.set('deleted_product_ids', deletedIds.filter(id => id !== productToSave.id));
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_products').upsert({
        id: productToSave.id,
        data: productToSave,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn("Supabase product save error:", error.message);
      });
    }

    this.broadcast();
    return productToSave;
  }

  deleteProduct(id) {
    // 1. Record ID in deleted_product_ids list to prevent re-seeding
    const deletedIds = this.get('deleted_product_ids') || [];
    if (!deletedIds.includes(id)) {
      this.set('deleted_product_ids', [...deletedIds, id]);
    }

    // 2. Remove product from products storage
    const currentProds = this.get('products') || [];
    const product = currentProds.find(p => p.id === id);
    const filtered = currentProds.filter(p => p.id !== id);
    this.set('products', filtered);
    this.logActivity('Product Deleted', `Product ${product?.name || id} was deleted.`);

    // 3. Delete from Supabase if connected
    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_products').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn("Supabase product delete error:", error.message);
      });
    }

    this.broadcast();
    return true;
  }

  toggleProductActive(id) {
    const products = this.getProducts();
    const target = products.find(p => p.id === id);
    if (!target) return false;
    const nextState = target.isActive === false ? true : false;
    const updated = { ...target, isActive: nextState };
    this.saveProduct(updated);
    this.logActivity('Product Status Changed', `Product "${target.name}" is now ${nextState ? 'Active (Live)' : 'Inactive (Off)'}.`);
    this.broadcast();
    return updated;
  }

  // Order Operations & Single-Branch Fulfillment
  getOrders() {
    return this.get('orders');
  }

  async syncOrdersFromSupabase() {
    if (!isSupabaseConfigured || !supabase) return this.getOrders();
    try {
      const { data: ords, error: oErr } = await supabase
        .from('sawera_orders')
        .select('*');
        
      if (!oErr && Array.isArray(ords)) {
        const orderList = ords.map(o => o.data).filter(Boolean);
        const localOrders = this.get('orders') || [];
        
        const mergedMap = new Map();
        // Supabase cloud orders take priority
        for (const o of orderList) {
          if (o && o.id) mergedMap.set(o.id, o);
        }
        // Retain any pending local orders
        for (const lo of localOrders) {
          if (lo && lo.id && !mergedMap.has(lo.id)) {
            mergedMap.set(lo.id, lo);
          }
        }
        
        const mergedOrders = Array.from(mergedMap.values());
        mergedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        
        this.setLocal('orders', mergedOrders);
        return mergedOrders;
      }
    } catch (err) {
      console.warn("syncOrdersFromSupabase error:", err);
    }
    return this.getOrders();
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  }

  async createOrder(orderData) {
    const orders = this.getOrders();
    const products = this.getProducts();
    const branches = this.getBranches().filter(b => !b.isArchived);
    const assignedBranch = branches[0] || defaultBranches[0];

    // Deduct stock from the store (shop-1)
    const updatedProducts = products.map(p => {
      const cartItem = orderData.items?.find(i => i.id === p.id);
      if (cartItem && p.stocks) {
        const currentStock = p.stocks[assignedBranch.id] || 0;
        return {
          ...p,
          stocks: {
            ...p.stocks,
            [assignedBranch.id]: Math.max(0, currentStock - (cartItem.quantity || 1))
          }
        };
      }
      return p;
    });
    this.setLocal('products', updatedProducts);

    const newOrder = {
      ...orderData,
      id: orderData.id || `SAV-${Math.floor(100000 + Math.random() * 900000)}`,
      assignedBranch: assignedBranch.id,
      assignedBranchName: assignedBranch.name,
      status: orderData.paymentMethod === 'cod' ? 'confirmed' : 'placed',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : (orderData.paymentProofUrl ? 'verified' : 'pending'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.setLocal('orders', [newOrder, ...orders]);
    this.logActivity('New Order Placed', `Order ${newOrder.id} placed for Rs. ${newOrder.total} assigned to ${assignedBranch.name}.`);

    // Await cloud persistence so mobile connections never get cut short
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('sawera_orders').upsert({
          id: newOrder.id,
          data: newOrder,
          created_at: newOrder.createdAt
        });
        if (error) console.warn("Supabase order upsert error:", error.message);
      } catch (err) {
        console.warn("Supabase order save error:", err);
      }
    }

    // Award loyalty points if registered customer
    if (orderData.customer?.email) {
      const users = this.get('users');
      const userIdx = users.findIndex(u => u.email === orderData.customer.email);
      if (userIdx !== -1) {
        const earnedPoints = Math.floor(newOrder.total / 100);
        users[userIdx].loyaltyPoints = (users[userIdx].loyaltyPoints || 0) + earnedPoints;
        this.setLocal('users', users);
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId, status, extraFields = {}) {
    const orders = this.getOrders();
    let updatedOrder = null;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        updatedOrder = {
          ...o,
          status,
          ...extraFields,
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });
    this.set('orders', updated);
    this.logActivity('Order Status Changed', `Order ${orderId} status changed to ${status}.`);

    if (isSupabaseConfigured && supabase && updatedOrder) {
      supabase.from('sawera_orders').upsert({
        id: updatedOrder.id,
        data: updatedOrder
      }).then(({ error }) => {
        if (error) console.warn("Supabase order status update error:", error.message);
      });
    }

    return true;
  }

  // Stock Requests (Staff Submissions & Admin Approvals)
  getStockRequests() {
    return this.get('stockRequests');
  }

  createStockRequest(reqData) {
    const requests = this.getStockRequests();
    const newReq = {
      ...reqData,
      id: `sr-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.set('stockRequests', [newReq, ...requests]);
    this.logActivity('Stock Request Submitted', `${reqData.requestedBy} requested adjustment for ${reqData.productName}.`);
    return newReq;
  }

  reviewStockRequest(requestId, approved, reviewerName, rejectionReason = null) {
    const requests = this.getStockRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return false;

    if (approved) {
      // Apply stock change to the product
      const products = this.getProducts();
      const updatedProducts = products.map(p => {
        if (p.id === req.productId) {
          const current = p.stocks?.[req.branchId] || 0;
          let newQty = current;
          if (req.type === 'add') newQty = current + Number(req.changeQty);
          else if (req.type === 'deduct') newQty = Math.max(0, current - Number(req.changeQty));
          else if (req.type === 'set') newQty = Number(req.changeQty);

          return {
            ...p,
            stocks: {
              ...p.stocks,
              [req.branchId]: newQty
            }
          };
        }
        return p;
      });
      this.set('products', updatedProducts);
    }

    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: approved ? 'approved' : 'rejected',
          rejectionReason: approved ? null : (rejectionReason || 'Rejected by administrator'),
          reviewedBy: reviewerName,
          reviewedAt: new Date().toISOString()
        };
      }
      return r;
    });

    this.set('stockRequests', updatedRequests);
    this.logActivity(
      approved ? 'Stock Request Approved' : 'Stock Request Rejected',
      `Request for ${req.productName} at ${req.branchName} was ${approved ? 'approved' : 'rejected'} by ${reviewerName}.`
    );
    return true;
  }

  // Settings
  getSettings() {
    const sets = this.get('settings');
    if (!sets || Array.isArray(sets) || typeof sets !== 'object') {
      return defaultSettings;
    }
    return { ...defaultSettings, ...sets };
  }

  updateSettings(updates) {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      throw new Error("Invalid settings payload");
    }
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    this.set('settings', merged);
    this.logActivity('Store Settings Updated', 'System configurations updated.');
    return merged;
  }

  // Admin Account Security & Password Recovery
  updateAdminPassword(adminEmail, newPassword) {
    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: 'Password must be at least 5 characters.' };
    }

    const targetEmail = (adminEmail || 'admin@sawerasweets.pk').toLowerCase().trim();
    const users = this.get('users');
    let found = false;

    const updatedUsers = users.map(u => {
      if (u.email?.toLowerCase() === targetEmail || u.role === 'owner_admin' || u.role === 'super_admin') {
        found = true;
        return { ...u, password: newPassword };
      }
      return u;
    });

    if (!found) {
      const newAdmin = {
        ...defaultUsers[0],
        email: targetEmail,
        password: newPassword
      };
      updatedUsers.push(newAdmin);
    }

    this.set('users', updatedUsers);

    try {
      localStorage.setItem('sawera_admin_security', JSON.stringify({
        adminEmail: targetEmail,
        password: newPassword,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_settings').upsert({
        id: 'admin_security',
        data: {
          adminEmail: targetEmail,
          password: newPassword,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn("Supabase admin_security sync error:", error.message);
      });
    }

    this.logActivity('Security Updated', 'Admin password changed successfully.');
    this.broadcast();
    return { success: true };
  }

  // Mithai Box Studio & Packaging Options
  getBoxOptions() {
    const list = this.get('boxOptions');
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_BOX_OPTIONS;
  }

  getBoxOptionById(id) {
    return this.getBoxOptions().find(b => b.id === id) || null;
  }

  saveBoxOption(box) {
    const boxes = this.getBoxOptions();
    const idx = boxes.findIndex(b => b.id === box.id);
    let updated;
    if (idx >= 0) {
      updated = [...boxes];
      updated[idx] = { ...updated[idx], ...box };
    } else {
      updated = [box, ...boxes];
    }
    this.set('boxOptions', updated);
    this.logActivity('Box Studio Updated', `Box configuration "${box.name}" updated.`);
    return box;
  }

  deleteBoxOption(id) {
    const boxes = this.getBoxOptions();
    const updated = boxes.filter(b => b.id !== id);
    this.set('boxOptions', updated);
    this.logActivity('Box Option Removed', `Box configuration ID ${id} deleted.`);
    return true;
  }

  // Occasion Collections
  getOccasions() {
    const list = this.get('occasions');
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_OCCASIONS;
  }

  saveOccasion(occasion) {
    const list = this.getOccasions();
    const idx = list.findIndex(o => o.id === occasion.id);
    let updated;
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...updated[idx], ...occasion };
    } else {
      updated = [occasion, ...list];
    }
    this.set('occasions', updated);
    return occasion;
  }

  // Wishlist
  getWishlist() {
    try {
      const item = localStorage.getItem('sawera_wishlist');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  }

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(productId);
  }

  toggleWishlist(productId) {
    let list = this.getWishlist();
    const exists = list.includes(productId);
    if (exists) {
      list = list.filter(id => id !== productId);
    } else {
      list = [productId, ...list];
    }
    try {
      localStorage.setItem('sawera_wishlist', JSON.stringify(list));
      this.broadcast();
    } catch (e) {
      console.warn('Wishlist update error:', e);
    }
    return !exists;
  }

  // Recently Viewed Products
  getRecentlyViewed() {
    try {
      const item = localStorage.getItem('sawera_recently_viewed');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  }

  addRecentlyViewed(productId) {
    if (!productId) return;
    try {
      let list = this.getRecentlyViewed();
      list = [productId, ...list.filter(id => id !== productId)].slice(0, 10);
      localStorage.setItem('sawera_recently_viewed', JSON.stringify(list));
      this.broadcast();
    } catch (e) {
      console.warn('Recently viewed error:', e);
    }
  }

  // Reset to Factory Default
  resetToFactory() {
    localStorage.removeItem('sawera_db_version');
    this.seedInitial();
    localStorage.setItem('sawera_db_version', DB_VERSION);
    return true;
  }
}

export const db = new SaweraDB();
export default db;
