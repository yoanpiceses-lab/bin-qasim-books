import dotenv from 'dotenv';


dotenv.config();

console.log("Supabase URL loaded:", !!process.env.SUPABASE_URL);
console.log("Supabase secret key loaded:", !!process.env.SUPABASE_SECRET_KEY);


import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

import { supabase, supabaseAdmin } from "./lib/supabase";
import { Order } from './src/types';


const PORT = Number(process.env.PORT) || 3000;
const app = express();

// Ensure data directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for image uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/uploads', express.static(UPLOADS_DIR));

// Email notification settings
const NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'yoanpiceses@gmail.com';

// ----------------------------------------------------
// Database Schema & Initialization
// ----------------------------------------------------

  const initialProducts = [
    // Stationery
    {
      id: 'prod-oxford-notebooks',
      name: 'Oxford Broad Line Single Ruled Exercise Notebook (Pack of 6)',
      slug: 'oxford-exercise-notebook-pack-of-6',
      description: 'Premium quality 80gsm white wood-free paper exercise notebooks. Durable laminated soft covers suitable for Karachi school syllabus work.',
      price: 850,
      category: 'Stationery',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-faber-castell-colour-set',
      name: 'Faber-Castell Triangular Colour Pencils (Pack of 24)',
      slug: 'faber-castell-triangular-colour-pencils-24',
      description: 'Rich, smooth lead color pencils with ergonomic triangular grip. High break-resistance and vibrant pigments ideal for school artwork.',
      price: 650,
      category: 'Stationery',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-casio-scientific-calc',
      name: 'Casio FX-991EX ClassWiz Scientific Calculator',
      slug: 'casio-fx-991ex-scientific-calculator',
      description: 'Authentic 552 functions scientific calculator with natural textbook display. Approved for Matric, Intermediate, O/A Levels, and Engineering exams.',
      price: 4250,
      category: 'Stationery',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-dux-geometry-box',
      name: 'Dux Mathematical Instrument Geometry Box Metal Case',
      slug: 'dux-geometry-box-metal-case',
      description: 'Precision compass, divider, 15cm ruler, set squares, and protractor in a sturdy protective tin box for school students.',
      price: 380,
      category: 'Stationery',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-pelikan-fountain-pen',
      name: 'Pelikan Inoxchrom School Fountain Pen with Cartridges',
      slug: 'pelikan-inoxchrom-school-fountain-pen',
      description: 'Smooth medium nib writing fountain pen with ergonomic grip zone and quick-dry blue ink cartridges for calligraphy and neat handwriting.',
      price: 490,
      category: 'Stationery',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // School Bags
    {
      id: 'prod-orthopedic-school-backpack',
      name: 'Ergonomic Waterproof Multi-Pocket Student Backpack',
      slug: 'ergonomic-waterproof-student-backpack',
      description: 'Heavy duty waterproof polyester backpack with padded spine support, breathable shoulder straps, lunchbox compartment, and water bottle slots.',
      price: 2850,
      category: 'School Bags',
      stock: 22,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-kids-trolley-bag',
      name: 'Junior 6-Wheel Rolling Trolley School Bag with Detachable Base',
      slug: 'junior-rolling-trolley-school-bag',
      description: 'Smooth stair-climbing 6-wheel trolley mechanism for elementary and primary school students. High-durability fabric with matching pencil pouch.',
      price: 3600,
      category: 'School Bags',
      stock: 14,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-insulated-lunch-bag',
      name: 'Thermal Insulated School Lunch Bag with Bottle Holder',
      slug: 'thermal-insulated-school-lunch-bag',
      description: 'Food-grade thermal lining keeps meals warm and fresh during school hours. Easy-to-clean water resistant exterior with adjustable carry strap.',
      price: 850,
      category: 'School Bags',
      stock: 28,
      image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Toys
    {
      id: 'prod-educational-solar-robot-kit',
      name: '12-in-1 Educational STEM Solar Powered Robot Building Kit',
      slug: '12-in-1-stem-solar-robot-building-kit',
      description: 'Hands-on scientific STEM kit empowering kids to build 12 motorized robot models powered directly by sunlight. Enhances problem solving and engineering interest.',
      price: 1950,
      category: 'Toys',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-wooden-chess-board-set',
      name: 'Classic Wooden Magnetic Foldable Chess & Checkers Set',
      slug: 'wooden-magnetic-chess-checkers-set',
      description: 'Handcrafted polished wooden board with magnetic Staunton chess pieces. Velvet interior storage slots for convenient travel and family play.',
      price: 1750,
      category: 'Toys',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-speed-cube-3x3',
      name: 'Cyclone Boys Magnetic 3x3 Speed Cube Puzzle',
      slug: 'cyclone-boys-magnetic-speed-cube',
      description: 'Smooth corner cutting with stickerless vivid tiles and adjustable spring tension. Excellent for cognitive focus and speedcubing practice.',
      price: 650,
      category: 'Toys',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Gifts
    {
      id: 'prod-parker-pen-gift-set',
      name: 'Executive Rollerball & Ballpoint Pen Luxury Gift Set in Velvet Box',
      slug: 'executive-pen-luxury-gift-set',
      description: 'Matte black barrel with gold trim accents in an elegant presentation case. Premium gift choice for teachers, graduates, and professionals.',
      price: 1650,
      category: 'Gifts',
      stock: 19,
      image: 'https://images.unsplash.com/photo-1585336261026-418071839977?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-hardcover-leather-journal',
      name: 'Vintage Embossed PU Leather Daily Planner & Journal with Lock',
      slug: 'vintage-leather-journal-with-lock',
      description: 'Antique brass combination lock with refillable 200 pages lined parchment paper. Ideal for personal diary keeping, sketching, and gift giving.',
      price: 1350,
      category: 'Gifts',
      stock: 16,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Sports
    {
      id: 'prod-ca-plus-tape-ball-cricket-bat',
      name: 'CA Plus 15000 Hard Court Tape Ball Cricket Bat',
      slug: 'ca-plus-tape-ball-cricket-bat',
      description: 'Popular Karachi tape-ball cricket bat crafted from balanced popular willow. Heavy stroke blade with rubber grip handle for power hitting.',
      price: 2450,
      category: 'Sports',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-yonex-badminton-racket-set',
      name: 'Twin Badminton Racket Set with 3 Nylon Shuttles and Full Cover',
      slug: 'twin-badminton-racket-set-with-shuttles',
      description: 'Lightweight aluminum alloy frame with high tension stringing and anti-slip sweat absorption grips. Includes 3 durable tournament shuttlecocks.',
      price: 1850,
      category: 'Sports',
      stock: 24,
      image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-fifa-size-5-football',
      name: 'Match Grade Size 5 Hand-Stitched Football with Pump & Needle',
      slug: 'match-grade-size-5-football',
      description: '32-panel durable PU leather casing with butyl bladder for optimal air retention and true flight trajectory on turf or grass pitches.',
      price: 1550,
      category: 'Sports',
      stock: 17,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];





// ----------------------------------------------------
// Email Notification Service
// ----------------------------------------------------

async function createEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Fallback to JSON transport or test ethereal account for development/preview
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

async function sendOrderNotificationEmail(order: Order): Promise<{ success: boolean; log: string }> {
  const itemsText = order.items
    .map((item) => `* ${item.name} × ${item.quantity} (PKR ${item.price.toLocaleString()} each = PKR ${(item.price * item.quantity).toLocaleString()})`)
    .join('\n');

  const subject = `New Order #${order.orderNumber} - Bin Qasim Books & Uniforms`;

  const body = `New Order #${order.orderNumber}

Customer: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail || 'Not provided'}

Delivery Address:
${order.deliveryAddress}, ${order.city}

${order.orderNotes ? `Order Notes: ${order.orderNotes}\n\n` : ''}Items:
${itemsText}

Subtotal: PKR ${order.subtotal.toLocaleString()}
Delivery Fee: ${order.deliveryFee === 0 ? 'Free Delivery' : `PKR ${order.deliveryFee.toLocaleString()}`}
Total: PKR ${order.total.toLocaleString()}

Payment Method: ${order.paymentMethod}
Status: ${order.status}

Order Date:
${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'full', timeStyle: 'medium' })} (PKT)
`;

  try {
    const transporter = await createEmailTransporter();
    const fromAddress = process.env.SMTP_FROM || 'Bin Qasim Books & Uniforms <binqasim564@gmail.com>';
    const recipient = NOTIFICATION_EMAIL;

    const mailOptions = {
      from: fromAddress,
      to: recipient,
      replyTo: order.customerEmail || 'binqasim564@gmail.com',
      subject,
      text: body,
    };

    const info = await transporter.sendMail(mailOptions);
    const logDetails = `[EMAIL DISPATCH] Sent to ${recipient} for Order #${order.orderNumber}. MessageId: ${info.messageId || 'json-mode'}`;
    console.log(logDetails);
    console.log('--- EMAIL CONTENT ---\n' + body + '\n---------------------');

    return { success: true, log: logDetails };
  } catch (err: any) {
    const errorMsg = `[EMAIL ERROR] Failed sending to ${NOTIFICATION_EMAIL}: ${err.message}`;
    console.error(errorMsg);
    return { success: false, log: errorMsg };
  }
}

// ----------------------------------------------------
// Authentication Helpers
// ----------------------------------------------------

async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized: Admin authentication token required',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the Supabase Auth access token
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or expired session. Please log in again.',
      });
    }

    // Make sure this authenticated Supabase user is actually an admin
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, username, name, email, role')
      .eq('id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (profileError) {
      console.error('Admin profile lookup failed:', profileError);

      return res.status(500).json({
        error: 'Failed to verify admin profile',
      });
    }

    if (!adminProfile) {
      return res.status(403).json({
        error: 'Forbidden: Admin access required',
      });
    }

    (req as any).admin = {
      id: adminProfile.id,
      username: adminProfile.username,
      email: adminProfile.email || user.email || '',
      name: adminProfile.name,
      role: adminProfile.role,
    };

    next();
  } catch (err: any) {
    console.error('Admin authentication error:', err);

    return res.status(401).json({
      error: 'Unauthorized: Authentication failed',
    });
  }
}

// ----------------------------------------------------
// Public APIs
// ----------------------------------------------------

    // GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    let products = (data || []).map((p) => ({
  ...p,
  isAvailable: p.isavailable,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
}));


    // Category filter
    const category = req.query.category as string;
    if (category && category !== 'All') {
      products = products.filter(
        (p) =>
          p.category.toLowerCase() === category.toLowerCase() ||
          p.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      );
    }

    // Search query
    const search = (req.query.search as string)?.trim().toLowerCase();
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.description || '').toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    // Availability filter
    if (req.query.inStock === 'true') {
      products = products.filter((p) => p.stock > 0 && p.isavailable);
    }

    // Price range
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;

    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;

    if (minPrice !== undefined && !isNaN(minPrice)) {
      products = products.filter((p) => p.price >= minPrice);
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      products = products.filter((p) => p.price <= maxPrice);
    }

    // Sorting
    const sort = req.query.sort as string;

    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'newest') {
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    } else {
      // Featured default
      products.sort(
        (a, b) =>
          (b.featured ? 1 : 0) -
          (a.featured ? 1 : 0)
      );
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to fetch products: ' + err.message,
    });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${req.params.id},slug.eq.${req.params.id}`)
      .maybeSingle();

    if (productError) {
      throw productError;
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedProduct = {
      ...product,
      isAvailable: product.isavailable,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .eq('isavailable', true)
      .limit(4);

    if (relatedError) {
      throw relatedError;
    }

    const related = (relatedProducts || []).map((p) => ({
      ...p,
      isAvailable: p.isavailable,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    res.json({
      success: true,
      product: formattedProduct,
      related,
    });
  } catch (err: any) {
    console.error('Product details error:', err);

    res.status(500).json({
      error: 'Failed to fetch product: ' + err.message,
    });
  }
});

// GET /api/categories
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    // Get categories from Supabase
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      throw categoriesError;
    }

    // Get products from Supabase to calculate product counts
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('category');

    if (productsError) {
      throw productsError;
    }

    const categoriesWithCount = (categories || []).map((cat) => {
      const count = (products || []).filter(
        (p) =>
          p.category?.toLowerCase() === cat.name?.toLowerCase()
      ).length;

      return {
        ...cat,
        productCount: count,
      };
    });

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (err: any) {
    console.error('❌ Failed to fetch categories:', err);

    res.status(500).json({
      error: 'Failed to fetch categories: ' + (err?.message || 'Unknown error'),
    });
  }
});

// POST /api/orders (Customer checkout)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      orderNotes,
      items,
    } = req.body;

    // Server-side validation
    if (!customerName || !customerPhone || !deliveryAddress || !city) {
      return res.status(400).json({
        error: 'Missing required customer details. Name, Phone, Address, and City are required.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Order must contain at least one item.',
      });
    }

    // ---------------------------------------------
    // 1. Validate products from Supabase
    // ---------------------------------------------

    const validatedItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        return res.status(400).json({
          error: `Product with ID ${item.productId} was not found in our catalog.`,
        });
      }

      if (!product.is_available) {
        return res.status(400).json({
          error: `"${product.name}" is currently unavailable.`,
        });
      }

      const qty = parseInt(item.quantity, 10);

      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          error: `Invalid quantity for product "${product.name}".`,
        });
      }

      if (qty > product.stock) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Requested ${qty}, but only ${product.stock} left in stock.`,
        });
      }

      const itemTotal = Number(product.price) * qty;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: qty,
        image: product.image,
        category: product.category,
        remainingStock: product.stock - qty,
      });
    }

    // ---------------------------------------------
    // 2. Generate next order number
    // ---------------------------------------------

    const { data: latestOrder, error: latestOrderError } = await supabase
      .from('orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestOrderError) {
      throw latestOrderError;
    }

    const orderNumber = latestOrder
      ? Number(latestOrder.order_number) + 1
      : 1024;

    const orderId = `ORD-${orderNumber}`;

    // ---------------------------------------------
    // 3. Calculate total
    // ---------------------------------------------

    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    // ---------------------------------------------
    // 4. Create order in Supabase
    // ---------------------------------------------

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail ? customerEmail.trim() : '',
        delivery_address: deliveryAddress.trim(),
        city: city.trim(),
        order_notes: orderNotes ? orderNotes.trim() : '',
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: 'Cash on Delivery / Pay at Store',
        status: 'New',
        email_notification_sent: false,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // ---------------------------------------------
    // 5. Create order items in Supabase
    // ---------------------------------------------

    const orderItems = validatedItems.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // If items fail, remove the order so we don't leave
      // an incomplete order behind.
      await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      throw itemsError;
    }

    // ---------------------------------------------
    // 6. Deduct product stock in Supabase
    // ---------------------------------------------

    for (const item of validatedItems) {
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock: item.remainingStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.productId);

      if (stockError) {
        throw stockError;
      }
    }

    // ---------------------------------------------
    // 7. Return the newly created order
    // ---------------------------------------------

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });

  } catch (err: any) {
    console.error('❌ Order creation error:', err);

    res.status(500).json({
      error: 'Failed to process order: ' + (err?.message || 'Unknown error'),
    });
  }
});

// GET /api/orders/:id (Customer Order Confirmation)
app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    // Find order in Supabase by either ID or order number
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `);

    if (orderId.startsWith('ORD-')) {
      query = query.eq('id', orderId);
    } else {
      query = query.eq('order_number', parseInt(orderId, 10));
    }

    const { data: order, error } = await query.maybeSingle();

    if (error) {
      console.error('❌ Failed to fetch order:', error);
      throw error;
    }

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    // Convert Supabase order format to the format expected by frontend
    const formattedOrder = {
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      deliveryAddress: order.delivery_address,
      orderNotes: order.order_notes,
      deliveryFee: order.delivery_fee,
      paymentMethod: order.payment_method,
      emailNotificationSent: order.email_notification_sent,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: order.order_items || [],
    };

    res.json({
      success: true,
      order: formattedOrder,
    });
  } catch (err: any) {
    console.error('❌ Failed to fetch order:', err);

    res.status(500).json({
      error: 'Failed to fetch order: ' + (err?.message || 'Unknown error'),
    });
  }
});

// ----------------------------------------------------
// Admin APIs (Protected)
// ----------------------------------------------------

// POST /api/admin/login
app.post('/api/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    const loginIdentifier = username.trim().toLowerCase();

    // Find the admin profile by username or email.
    // This lets the existing login form continue accepting either one.
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, username, name, email, role')
      .or(`username.ilike.${loginIdentifier},email.ilike.${loginIdentifier}`)
      .eq('role', 'admin')
      .maybeSingle();

    if (profileError) {
      console.error('Admin profile lookup failed:', profileError);

      return res.status(500).json({
        error: 'Failed to verify admin account',
      });
    }

    if (!adminProfile || !adminProfile.email) {
      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    // Authenticate against Supabase Auth
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: adminProfile.email,
      password,
    });

    if (authError || !authData.session || !authData.user) {
      console.error('Supabase login failed:', authError?.message);

      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    // Make sure the authenticated Supabase user matches
    // the admin profile we looked up.
    if (authData.user.id !== adminProfile.id) {
      return res.status(403).json({
        error: 'Forbidden: Admin account verification failed',
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',

      // Supabase Auth tokens
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,

      user: {
        id: adminProfile.id,
        username: adminProfile.username,
        email: adminProfile.email,
        name: adminProfile.name,
        role: adminProfile.role,
      },
    });
  } catch (err: any) {
    console.error('Admin login error:', err);

    res.status(500).json({
      error: 'Login failed: ' + err.message,
    });
  }
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).admin;
  res.json({ success: true, user: admin });
});

// POST /api/admin/update-profile
app.post('/api/admin/update-profile', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).admin;
    const { username, name, email } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({
        error: 'Username must be at least 3 characters long',
      });
    }

    const trimmedUsername = username.trim();
    const trimmedName =
      typeof name === 'string' && name.trim()
        ? name.trim()
        : adminUser.name;

    const trimmedEmail =
      typeof email === 'string' && email.trim()
        ? email.trim().toLowerCase()
        : adminUser.email;

    // Check username collision in Supabase admin_profiles.
    const { data: existingUsername, error: usernameCheckError } = await supabaseAdmin
      .from('admin_profiles')
      .select('id')
      .ilike('username', trimmedUsername)
      .neq('id', adminUser.id)
      .maybeSingle();

    if (usernameCheckError) {
      console.error('Username collision check failed:', usernameCheckError);

      return res.status(500).json({
        error: 'Failed to verify username availability',
      });
    }

    if (existingUsername) {
      return res.status(400).json({
        error: 'Username is already taken by another account',
      });
    }

    // Update the Supabase Auth email if it changed.
    if (trimmedEmail !== adminUser.email.toLowerCase()) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        {
          email: trimmedEmail,
        }
      );

      if (authUpdateError) {
        console.error('Supabase Auth email update failed:', authUpdateError);

        return res.status(400).json({
          error: authUpdateError.message || 'Failed to update email address',
        });
      }
    }

    // Update the admin profile in Supabase.
    const { data: updatedProfile, error: profileUpdateError } = await supabaseAdmin
      .from('admin_profiles')
      .update({
        username: trimmedUsername,
        name: trimmedName,
        email: trimmedEmail,
      })
      .eq('id', adminUser.id)
      .select('id, username, name, email, role')
      .single();

    if (profileUpdateError || !updatedProfile) {
      console.error('Admin profile update failed:', profileUpdateError);

      return res.status(500).json({
        error: 'Failed to update admin profile',
      });
    }

    // Keep the existing frontend contract.
    // The current Supabase access token remains valid, so return it
    // rather than generating the old custom JWT.
    const authHeader = req.headers.authorization || '';
    const currentToken = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : '';

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role,
      },
      token: currentToken,
    });
  } catch (err: any) {
    console.error('Admin profile update error:', err);

    res.status(500).json({
      error: 'Failed to update profile: ' + err.message,
    });
  }
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).admin;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long',
      });
    }

    // Verify the current password through Supabase Auth.
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: adminUser.email,
      password: currentPassword,
    });

    if (authError || !authData.user) {
      return res.status(400).json({
        error: 'Current password does not match',
      });
    }

    if (authData.user.id !== adminUser.id) {
      return res.status(403).json({
        error: 'Admin account verification failed',
      });
    }

    // Update the password in Supabase Auth.
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.id,
      {
        password: newPassword,
      }
    );

    if (updateError) {
      console.error('Supabase password update failed:', updateError);

      return res.status(400).json({
        error: updateError.message || 'Failed to update password',
      });
    }

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err: any) {
    console.error('Admin password update error:', err);

    res.status(500).json({
      error: 'Failed to update password: ' + err.message,
    });
  }
});

// GET /api/admin/dashboard
app.get('/api/admin/dashboard', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const [
      { count: totalProducts, error: productsError },
      { count: totalCategories, error: categoriesError },
      { data: orders, error: ordersError },
    ] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true }),

      supabaseAdmin
        .from('categories')
        .select('*', { count: 'exact', head: true }),

      supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }),
    ]);

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    const allOrders = orders || [];

    const newOrders = allOrders.filter((o) => o.status === 'New').length;

    const pendingOrders = allOrders.filter((o) =>
      ['New', 'Confirmed', 'Processing', 'Ready'].includes(o.status)
    ).length;

    const completedOrders = allOrders.filter(
      (o) => o.status === 'Completed'
    ).length;

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const recentOrders = allOrders.slice(0, 5);

    // We need stock values for the out-of-stock count.
    const { data: products, error: stockError } = await supabaseAdmin
      .from('products')
      .select('stock');

    if (stockError) {
      throw new Error(`Failed to fetch product stock: ${stockError.message}`);
    }

    const outOfStockProducts = (products || []).filter(
      (p) => Number(p.stock || 0) <= 0
    ).length;

    res.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        newOrders,
        pendingOrders,
        completedOrders,
        outOfStockProducts,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (err: any) {
    console.error('Admin dashboard error:', err);

    res.status(500).json({
      error: 'Failed to fetch dashboard data: ' + err.message,
    });
  }
});

// POST /api/admin/upload-image
app.post(
  '/api/admin/upload-image',
  requireAdminAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No image file uploaded',
        });
      }

      const file = req.file;
      const ext = path.extname(file.originalname).toLowerCase();

      const fileName =
        `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(fileName);

      res.json({
        success: true,
        imageUrl: publicUrlData.publicUrl,
        filename: fileName,
      });
    } catch (err: any) {
      console.error('❌ Failed to upload image:', err);

      res.status(500).json({
        error: 'Failed to upload image: ' + (err?.message || 'Unknown error'),
      });
    }
  }
);

// POST /api/admin/products
app.post('/api/admin/products', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      additionalImages,
      isAvailable,
      featured,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        error: 'Product name, price, and category are required',
      });
    }

    const id = 'prod-' + Date.now();

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || id;

    const now = new Date().toISOString();

    const newProduct = {
      id,
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      price: parseFloat(price) || 0,
      category: category.trim(),
      stock: parseInt(stock, 10) || 0,
      image:
        image ||
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      additionalImages: Array.isArray(additionalImages)
        ? additionalImages
        : [],
      isavailable: isAvailable !== false,
      featured: Boolean(featured),
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Convert Supabase's lowercase column back to the
    // property name expected by the frontend.
    const product = {
      ...data,
      isAvailable: data.isavailable,
    };

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (err: any) {
    console.error('❌ Failed to add product:', err);

    res.status(500).json({
      error: 'Failed to add product: ' + (err?.message || 'Unknown error'),
    });
  }

});

// PUT /api/admin/products/:id
app.put('/api/admin/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      additionalImages,
      isAvailable,
      featured,
    } = req.body;

    const productId = req.params.id;

    // Get the existing product from Supabase
    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    const updatedProduct: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) {
      const cleanName = name.trim();

      updatedProduct.name = cleanName;

      updatedProduct.slug =
        cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || productId;
    }

    if (description !== undefined) {
      updatedProduct.description = description.trim();
    }

    if (price !== undefined) {
      updatedProduct.price = parseFloat(price) || 0;
    }

    if (category !== undefined) {
      updatedProduct.category = category.trim();
    }

    if (stock !== undefined) {
      updatedProduct.stock = parseInt(stock, 10) || 0;
    }

    if (image !== undefined) {
      updatedProduct.image = image;
    }

    if (additionalImages !== undefined) {
      updatedProduct.additionalImages = Array.isArray(additionalImages)
        ? additionalImages
        : [];
    }

    if (isAvailable !== undefined) {
      updatedProduct.isavailable = Boolean(isAvailable);
    }

    if (featured !== undefined) {
      updatedProduct.featured = Boolean(featured);
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const product = {
      ...data,
      isAvailable: data.isavailable,
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (err: any) {
    console.error('❌ Failed to update product:', err);

    res.status(500).json({
      error: 'Failed to update product: ' + (err?.message || 'Unknown error'),
    });
  }
});

// DELETE /api/admin/products/:id
app.delete('/api/admin/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // Get the product first so we can return its name
    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', productId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    // Delete the product from Supabase
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      message: `Product "${existing.name}" deleted successfully`,
    });
  } catch (err: any) {
    console.error('❌ Failed to delete product:', err);

    res.status(500).json({
      error: 'Failed to delete product: ' + (err?.message || 'Unknown error'),
    });
  }
});

// POST /api/admin/categories
app.post('/api/admin/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Category name is required',
      });
    }

    const cleanName = name.trim();

    const slug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

    const id = 'cat-' + slug;

    // Check whether the category already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', cleanName)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingCategory) {
      return res.status(400).json({
        error: 'A category with this name already exists',
      });
    }

    const newCategory = {
      id,
      name: cleanName,
      slug,
      description: description ? description.trim() : '',
      image:
        image ||
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    };

    const { data, error } = await supabase
      .from('categories')
      .insert(newCategory)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: data,
    });
  } catch (err: any) {
    console.error('❌ Failed to create category:', err);

    res.status(500).json({
      error: 'Failed to create category: ' + (err?.message || 'Unknown error'),
    });
  }
});

// PUT /api/admin/categories/:id
app.put('/api/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const { name, description, image } = req.body;

    // Get existing category
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (fetchError || !existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    const oldName = existingCategory.name;
    const newName = name !== undefined ? name.trim() : oldName;

    if (!newName) {
      return res.status(400).json({
        error: 'Category name is required',
      });
    }

    const slug =
      newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || categoryId;

    // Check for another category with the same name
    if (newName.toLowerCase() !== oldName.toLowerCase()) {
      const { data: duplicateCategory, error: duplicateError } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', newName)
        .neq('id', categoryId)
        .maybeSingle();

      if (duplicateError) {
        throw duplicateError;
      }

      if (duplicateCategory) {
        return res.status(400).json({
          error: 'A category with this name already exists',
        });
      }
    }

    const updatedCategory: any = {
      name: newName,
      slug,
    };

    if (description !== undefined) {
      updatedCategory.description = description.trim();
    }

    if (image !== undefined) {
      updatedCategory.image = image;
    }

    // Update the category
    const { data: updated, error: updateError } = await supabase
      .from('categories')
      .update(updatedCategory)
      .eq('id', categoryId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // If the category was renamed, update products using the old name
    if (oldName.toLowerCase() !== newName.toLowerCase()) {
      const { error: productsError } = await supabase
        .from('products')
        .update({
          category: newName,
          updated_at: new Date().toISOString(),
        })
        .ilike('category', oldName);

      if (productsError) {
        throw productsError;
      }
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (err: any) {
    console.error('❌ Failed to update category:', err);

    res.status(500).json({
      error: 'Failed to update category: ' + (err?.message || 'Unknown error'),
    });
  }
});

// DELETE /api/admin/categories/:id
app.delete('/api/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    // Get the category from Supabase
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', categoryId)
      .single();

    if (fetchError || !category) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    // Check whether products are using this category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, category')
      .ilike('category', category.name);

    if (productsError) {
      throw productsError;
    }

    const hasProducts = (products || []).length > 0;

    // Don't delete a category that has products unless force=true
    if (hasProducts && req.query.force !== 'true') {
      return res.status(400).json({
        error: `Cannot delete category "${category.name}" because there are products assigned to it. Reassign or delete those products first, or pass ?force=true.`,
      });
    }

    // Delete the category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (err: any) {
    console.error('❌ Failed to delete category:', err);

    res.status(500).json({
      error: 'Failed to delete category: ' + (err?.message || 'Unknown error'),
    });
  }
  
});
// GET /api/admin/orders
app.get('/api/admin/orders', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const search = (req.query.search as string)?.trim().toLowerCase();

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.ilike('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    let orders = data || [];

    // Search filtering
    if (search) {
      orders = orders.filter(
        (o) =>
          o.order_number?.toString().toLowerCase().includes(search) ||
          o.customer_name?.toLowerCase().includes(search) ||
          o.customer_phone?.toLowerCase().includes(search) ||
          o.customer_email?.toLowerCase().includes(search) ||
          o.city?.toLowerCase().includes(search)
      );
    }

    // Convert Supabase snake_case fields
    // into the camelCase fields expected by the frontend.
    orders = orders.map((o) => ({
      ...o,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      deliveryAddress: o.delivery_address,
      orderNotes: o.order_notes,
      deliveryFee: o.delivery_fee,
      paymentMethod: o.payment_method,
      emailNotificationSent: o.email_notification_sent,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: any) {
    console.error('❌ Failed to fetch admin orders:', err);

    res.status(500).json({
      error: 'Failed to fetch orders: ' + (err?.message || 'Unknown error'),
    });
  }
});

// GET /api/admin/orders/:id
app.get('/api/admin/orders/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const orderIdentifier = req.params.id;

    let query = supabase
  .from('orders')
  .select('*');

    if (orderIdentifier.startsWith('ORD-')) {
      const numericOrderNumber = Number(
        orderIdentifier.replace('ORD-', '')
      );

      if (!Number.isInteger(numericOrderNumber)) {
        return res.status(400).json({
          error: 'Invalid order number',
        });
      }

      query = query.eq('order_number', numericOrderNumber);
    } else {
      query = query.eq('id', orderIdentifier);
    }

    const { data: order, error } = await query.maybeSingle();

if (error) {
  throw error;
}

if (!order) {
  return res.status(404).json({
    error: 'Order not found',
  });
}

const { data: orderItems, error: itemsError } = await supabase
  .from('order_items')
  .select('*')
  .eq('order_id', order.id);

if (itemsError) {
  throw itemsError;
}

    if (error) {
      throw error;
    }

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    const formattedOrder = {
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      deliveryAddress: order.delivery_address,
      orderNotes: order.order_notes,
      deliveryFee: order.delivery_fee,
      paymentMethod: order.payment_method,
      emailNotificationSent: order.email_notification_sent,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: orderItems || [],
    };

    res.json({
      success: true,
      order: formattedOrder,
    });
  } catch (err: any) {
    console.error('❌ Failed to fetch admin order details:', err);

    res.status(500).json({
      error: 'Failed to fetch order details: ' + (err?.message || 'Unknown error'),
    });
  }
});

// PUT /api/admin/orders/:id/status
app.put('/api/admin/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status, restockOnCancel } = req.body;

    const validStatuses = [
  'New',
  'Confirmed',
  'Processing',
  'Ready',
  'Delivered',
  'Cancelled',
];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Find the order in Supabase by ID or order number
    // Find the order in Supabase by ID or order number
const orderIdentifier = req.params.id;

let orderQuery = supabase
  .from('orders')
  .select('*');

if (orderIdentifier.startsWith('ORD-')) {
  const numericOrderNumber = Number(
    orderIdentifier.replace('ORD-', '')
  );

  if (!Number.isInteger(numericOrderNumber)) {
    return res.status(400).json({
      error: 'Invalid order number',
    });
  }

  orderQuery = orderQuery.eq('order_number', numericOrderNumber);
} else {
  orderQuery = orderQuery.eq('id', orderIdentifier);
}

const { data: order, error: orderError } = await orderQuery.maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    const previousStatus = order.status;

    // Update the order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // If order was cancelled and restocking was requested
    if (
      status === 'Cancelled' &&
      previousStatus !== 'Cancelled' &&
      restockOnCancel
    ) {
      const items = Array.isArray(order.items) ? order.items : [];

      for (const item of items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .maybeSingle();

        if (productError) {
          throw productError;
        }

        if (product) {
          const newStock = Number(product.stock || 0) + Number(item.quantity || 0);

          const { error: stockUpdateError } = await supabase
            .from('products')
            .update({
              stock: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.productId);

          if (stockUpdateError) {
            throw stockUpdateError;
          }
        }
      }
    }

    const formattedOrder = {
      ...updatedOrder,
      orderNumber: updatedOrder.order_number,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
    };

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: formattedOrder,
    });
  } catch (err: any) {
    console.error('Order status update error:', err);

    res.status(500).json({
      error: 'Failed to update order status: ' + err.message,
    });
  }
});

// POST /api/admin/test-email (Allows store owner to test real notification dispatch)
app.post('/api/admin/test-email', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const testOrder: Order = {
      id: 'TEST-1024',
      orderNumber: 1024,
      customerName: 'Ahmed Khan (Test Order)',
      customerPhone: '0333-1234567',
      customerEmail: 'customer.test@gmail.com',
      deliveryAddress: 'House 42, Block 4, Gulshan-e-Iqbal',
      city: 'Karachi',
      orderNotes: 'This is an admin notification system test email.',
      items: [
        {
          productId: 'test-1',
          name: 'Oxford Broad Line Single Ruled Exercise Notebook (Pack of 6)',
          price: 850,
          quantity: 2,
          image: '',
        },
        {
          productId: 'test-2',
          name: 'CA Plus 15000 Hard Court Tape Ball Cricket Bat',
          price: 2450,
          quantity: 1,
          image: '',
        },
      ],
      subtotal: 4150,
      deliveryFee: 0,
      total: 4150,
      paymentMethod: 'Cash on Delivery / Pay at Store',
      status: 'New',
      emailNotificationSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await sendOrderNotificationEmail(testOrder);

    res.json({
      success: true,
      recipient: NOTIFICATION_EMAIL,
      smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      result,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to test email notification: ' + err.message });
  }
});

// GET /api/admin/email-status
app.get('/api/admin/email-status', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    recipient: NOTIFICATION_EMAIL,
    smtpHost: process.env.SMTP_HOST || 'Not configured (using log & simulated delivery)',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER ? 'Configured' : 'Not configured',
    isConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  });
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', business: 'BIN QASIM BOOKS & UNIFORMS', timestamp: new Date().toISOString() });
});

// Explicit JSON 404 fallback for all unmatched /api routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});

// ----------------------------------------------------
// Vite Dev Server / Production Static Serving
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`BIN QASIM BOOKS & UNIFORMS Store Backend Running`);
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`Admin Portal: http://localhost:${PORT}/admin/login`);
    console.log(`Notification Recipient: ${NOTIFICATION_EMAIL}`);
    console.log(`====================================================`);
  });
}
startServer();



