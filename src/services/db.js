// Relational Local Storage Database Engine for Sawera Sweets & Bakers
// Manages reactive state across Customer, Staff, Rider, and Admin views with window custom events.

import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { supabase, isSupabaseConfigured } from './supabase';

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
    whatsapp: "0347 1702710",
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
      number: "0348 1702710",
      accountTitle: "Muhammad Akash",
      instructions: "Transfer to Easypaisa Account 0348 1702710 (Muhammad Akash) and upload your payment screenshot."
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
      senderPhone: "0347 1702710",
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
    phone: "0347 1702710",
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
    phone: "0347 1702710",
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
    answer: "We support Cash on Delivery (COD), Easypaisa mobile wallet (0348 1702710 - Muhammad Akash), and direct MCB Bank Transfer with payment proof receipt upload.",
    answerUrdu: "کیش آن ڈلیوری، ایزی پیسہ (0348 1702710) اور ایم سی بی بینک ٹرانسفر کے ذریعے ادائیگی ممکن ہے۔",
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
        // Clear or seed initial collections
        this.seedInitial();
        localStorage.setItem('sawera_db_version', DB_VERSION);
      } else {
        // Migration safeguard: Ensure only 1 branch exists
        const currentBranches = this.get('branches');
        if (!Array.isArray(currentBranches) || currentBranches.length !== 1 || currentBranches[0].id !== 'shop-1') {
          this.set('branches', defaultBranches);
        }
      }

      // Automatically sync and merge catalog products into local storage
      try {
        const currentProds = this.get('products') || [];
        const catalogProds = seedInitialProducts();
        let hasProdsUpdate = false;
        const updatedProds = [...currentProds];

        for (const cp of catalogProds) {
          const foundIdx = updatedProds.findIndex(p => p.id === cp.id);
          if (foundIdx === -1) {
            updatedProds.push(cp);
            hasProdsUpdate = true;
          } else if (updatedProds[foundIdx].image !== cp.image || !updatedProds[foundIdx].urduDescription) {
            updatedProds[foundIdx] = {
              ...cp,
              ...updatedProds[foundIdx],
              image: cp.image,
              urduDescription: cp.urduDescription,
              urduName: cp.urduName,
              variations: cp.variations,
              ingredients: cp.ingredients,
              stocks: updatedProds[foundIdx].stocks || cp.stocks
            };
            hasProdsUpdate = true;
          }
        }

        if (hasProdsUpdate || currentProds.length === 0) {
          this.set('products', updatedProds.length > 0 ? updatedProds : catalogProds);
        }
      } catch (err) {
        console.warn('Catalog merge error in init:', err);
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

      // Supabase Cloud Sync & Realtime Subscription
      if (isSupabaseConfigured && supabase) {
        this.syncFromSupabase();
        this.subscribeToSupabase();
      }
    } catch (e) {
      console.warn('LocalStorage error during init:', e);
      this.seedInitial();
    }
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
    this.set('activityLogs', defaultActivityLogs);
    this.set('contactMessages', []);
    this.broadcast();
  }

  get(collection) {
    try {
      const item = localStorage.getItem(`sawera_${collection}`);
      if (!item) return [];
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${collection}:`, e);
      return [];
    }
  }

  set(collection, data) {
    try {
      localStorage.setItem(`sawera_${collection}`, JSON.stringify(data));
      this.broadcast();

      if (collection === 'settings' && isSupabaseConfigured && supabase) {
        supabase.from('sawera_settings').upsert({
          id: 'settings',
          data,
          updated_at: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.warn("Supabase settings sync error:", error.message);
        });
      }
    } catch (e) {
      console.error(`Error writing ${collection}:`, e);
    }
  }

  async syncFromSupabase() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 1. Fetch Products
      const { data: prods, error: pErr } = await supabase.from('sawera_products').select('*');
      if (!pErr && Array.isArray(prods) && prods.length > 0) {
        const productList = prods.map(p => p.data);
        this.set('products', productList);
      }

      // 2. Fetch Orders
      const { data: ords, error: oErr } = await supabase.from('sawera_orders').select('*');
      if (!oErr && Array.isArray(ords)) {
        const orderList = ords.map(o => o.data);
        this.set('orders', orderList);
      }

      // 3. Fetch Settings
      const { data: sets, error: sErr } = await supabase.from('sawera_settings').select('*').eq('id', 'settings').maybeSingle();
      if (!sErr && sets?.data) {
        this.set('settings', sets.data);
      }
    } catch (err) {
      console.warn('Initial Supabase sync error:', err);
    }
  }

  subscribeToSupabase() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      supabase
        .channel('sawera_cloud_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_products' }, (payload) => {
          const current = this.getProducts();
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = payload.new.data;
            const updated = current.some(p => p.id === item.id)
              ? current.map(p => p.id === item.id ? item : p)
              : [item, ...current];
            this.set('products', updated);
          } else if (payload.eventType === 'DELETE') {
            const filtered = current.filter(p => p.id !== payload.old.id);
            this.set('products', filtered);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_orders' }, (payload) => {
          const current = this.getOrders();
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = payload.new.data;
            const updated = current.some(o => o.id === item.id)
              ? current.map(o => o.id === item.id ? item : o)
              : [item, ...current];
            this.set('orders', updated);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sawera_settings' }, (payload) => {
          if (payload.new?.data) {
            this.set('settings', payload.new.data);
          }
        })
        .subscribe();
    } catch (err) {
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

  // Product Operations
  getProducts() {
    const prods = this.get('products');
    const catalog = seedInitialProducts();
    if (!Array.isArray(prods) || prods.length === 0) {
      return catalog;
    }
    const missing = catalog.filter(c => !prods.some(p => p.id === c.id));
    if (missing.length > 0) {
      return [...prods, ...missing];
    }
    return prods;
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(productData) {
    const products = this.getProducts();
    let productToSave;
    if (productData.id && products.some(p => p.id === productData.id)) {
      productToSave = { ...products.find(p => p.id === productData.id), ...productData };
      const updated = products.map(p => p.id === productData.id ? productToSave : p);
      this.set('products', updated);
      this.logActivity('Product Updated', `Product ${productData.name} updated.`);
    } else {
      productToSave = {
        ...productData,
        id: productData.id || `prd-${Date.now()}`,
        isDemo: false
      };
      this.set('products', [productToSave, ...products]);
      this.logActivity('Product Added', `New product ${productToSave.name} added.`);
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

    return true;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    const filtered = products.filter(p => p.id !== id);
    this.set('products', filtered);
    this.logActivity('Product Deleted', `Product ${product?.name || id} was deleted.`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_products').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn("Supabase product delete error:", error.message);
      });
    }

    return true;
  }

  // Order Operations & Single-Branch Fulfillment
  getOrders() {
    return this.get('orders');
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const products = this.getProducts();
    const branches = this.getBranches().filter(b => !b.isArchived);
    const assignedBranch = branches[0] || defaultBranches[0];

    // Deduct stock from the store (shop-1)
    const updatedProducts = products.map(p => {
      const cartItem = orderData.items.find(i => i.id === p.id);
      if (cartItem && p.stocks) {
        const currentStock = p.stocks[assignedBranch.id] || 0;
        return {
          ...p,
          stocks: {
            ...p.stocks,
            [assignedBranch.id]: Math.max(0, currentStock - cartItem.quantity)
          }
        };
      }
      return p;
    });
    this.set('products', updatedProducts);

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

    this.set('orders', [newOrder, ...orders]);
    this.logActivity('New Order Placed', `Order ${newOrder.id} placed for Rs. ${newOrder.total} assigned to ${assignedBranch.name}.`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_orders').insert({
        id: newOrder.id,
        data: newOrder,
        created_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn("Supabase order insert error:", error.message);
      });
    }

    // Award loyalty points if registered customer
    if (orderData.customer?.email) {
      const users = this.get('users');
      const userIdx = users.findIndex(u => u.email === orderData.customer.email);
      if (userIdx !== -1) {
        const earnedPoints = Math.floor(newOrder.total / 100);
        users[userIdx].loyaltyPoints = (users[userIdx].loyaltyPoints || 0) + earnedPoints;
        this.set('users', users);
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
    return this.get('settings') || defaultSettings;
  }

  updateSettings(updates) {
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    this.set('settings', merged);
    this.logActivity('Store Settings Updated', 'System configurations updated.');
    return merged;
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
