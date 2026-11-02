/**
 * Seeds the database with an admin account, demo products and sample orders.
 * Safe to run multiple times:  npm run seed
 */
import mongoose from 'mongoose';

import { connectDatabase } from '../config/database';
import { Order, type OrderStatus } from '../models/order.model';
import { Product, type IProduct } from '../models/product.model';
import { User } from '../models/user.model';

const ADMIN = {
  name: process.env.ADMIN_NAME ?? 'Store Admin',
  email: (process.env.ADMIN_EMAIL ?? 'admin@gmail.com').toLowerCase(),
  password: process.env.ADMIN_PASSWORD ?? 'admin@123',
};

const DEMO_CUSTOMER = {
  name: 'Demo Customer',
  email: 'demo@devcommerce.app',
  password: 'Demo@1234',
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

type SeedProduct = Omit<IProduct, 'createdAt' | 'updatedAt' | 'isActive'>;

const products: SeedProduct[] = [
  {
    name: 'Aura Pro Wireless Headphones',
    brand: 'Sonic Lab',
    category: 'audio',
    price: 12999,
    originalPrice: 17999,
    rating: 4.8,
    reviews: 2341,
    image: unsplash('1505740420928-5e560c06d30e'),
    badge: 'Bestseller',
    description:
      'Studio-grade sound with adaptive noise cancellation, 40-hour battery life and plush memory-foam cushions built for all-day comfort.',
    highlights: ['Adaptive ANC', '40h battery', 'Bluetooth 5.4', 'Fast charge: 10 min = 5h'],
    stock: 42,
  },
  {
    name: 'Chrono Classic Watch',
    brand: 'Tempo',
    category: 'wearables',
    price: 8499,
    originalPrice: 10999,
    rating: 4.6,
    reviews: 892,
    image: unsplash('1523275335684-37898b6baf30'),
    description:
      'A timeless minimalist watch with sapphire-coated glass, Japanese quartz movement and a genuine leather strap.',
    highlights: ['Sapphire-coated glass', '5 ATM water resistant', 'Genuine leather', '2-year warranty'],
    stock: 25,
  },
  {
    name: 'Velocity Runner Sneakers',
    brand: 'Stride',
    category: 'footwear',
    price: 6999,
    originalPrice: 8999,
    rating: 4.7,
    reviews: 1520,
    image: unsplash('1542291026-7eec264c27ff'),
    badge: 'Trending',
    description:
      'Featherlight running shoes with responsive foam, breathable knit upper and a grippy rubber outsole for every surface.',
    highlights: ['Responsive foam', 'Breathable knit', 'Only 240 g', 'Reflective details'],
    stock: 60,
  },
  {
    name: 'Retro Instant Camera',
    brand: 'Lumen',
    category: 'electronics',
    price: 15499,
    rating: 4.5,
    reviews: 431,
    image: unsplash('1526170375885-4d8ecf77b99f'),
    badge: 'New',
    description:
      'Capture moments with vintage character. Interchangeable lens, manual controls and a bright optical viewfinder.',
    highlights: ['24 MP sensor', 'Interchangeable lens', '4K video', 'Wi-Fi transfer'],
    stock: 4,
  },
  {
    name: 'Horizon Polarized Sunglasses',
    brand: 'Solace',
    category: 'accessories',
    price: 3299,
    originalPrice: 4499,
    rating: 4.4,
    reviews: 678,
    image: unsplash('1572635196237-14b3f281503f'),
    description:
      'Polarized lenses with full UV400 protection in a lightweight acetate frame that looks great with everything.',
    highlights: ['Polarized lenses', 'UV400 protection', 'Acetate frame', 'Hard case included'],
    stock: 80,
  },
  {
    name: 'Pulse Smartwatch Series 5',
    brand: 'Tempo',
    category: 'wearables',
    price: 24999,
    originalPrice: 27999,
    rating: 4.7,
    reviews: 1104,
    image: unsplash('1546868871-7041f2a55e12'),
    badge: 'New',
    description:
      'Track health, workouts and sleep with an always-on AMOLED display, built-in GPS and up to 7 days of battery.',
    highlights: ['Always-on AMOLED', 'Built-in GPS', 'Heart rate & SpO2', '7-day battery'],
    stock: 18,
  },
  {
    name: 'Studio Over-Ear Headphones',
    brand: 'Sonic Lab',
    category: 'audio',
    price: 9999,
    rating: 4.5,
    reviews: 765,
    image: unsplash('1583394838336-acd977736f90'),
    description:
      'Reference-tuned headphones for creators: flat response, detachable cable and foldable design for travel.',
    highlights: ['Studio tuning', 'Detachable cable', 'Foldable', 'Memory-foam pads'],
    stock: 30,
  },
  {
    name: 'Nomad Leather Backpack',
    brand: 'Atlas & Co',
    category: 'accessories',
    price: 5499,
    originalPrice: 6999,
    rating: 4.6,
    reviews: 389,
    image: unsplash('1553062407-98eeb64c6a62'),
    description:
      'Water-resistant everyday backpack with a padded 16" laptop sleeve, hidden anti-theft pocket and ergonomic straps.',
    highlights: ['Fits 16" laptop', 'Water resistant', 'Anti-theft pocket', 'USB charging port'],
    stock: 22,
  },
  {
    name: 'UltraBook Air 14',
    brand: 'Nimbus',
    category: 'electronics',
    price: 89999,
    originalPrice: 99999,
    rating: 4.8,
    reviews: 512,
    image: unsplash('1496181133206-80ce9b88a853'),
    badge: 'Bestseller',
    description:
      'Ultra-thin aluminium laptop with a 2.8K display, all-day battery and the performance to handle serious development work.',
    highlights: ['14" 2.8K display', '16 GB RAM · 1 TB SSD', '18h battery', 'Only 1.2 kg'],
    stock: 9,
  },
  {
    name: 'Pixel Edge Smartphone',
    brand: 'Nimbus',
    category: 'electronics',
    price: 54999,
    rating: 4.6,
    reviews: 2210,
    image: unsplash('1511707171634-5f897ff02aa9'),
    description:
      'Edge-to-edge OLED display, pro-grade triple camera and a battery that comfortably lasts two days.',
    highlights: ['6.7" 120Hz OLED', '50 MP triple camera', '5000 mAh', '5G ready'],
    stock: 15,
  },
  {
    name: 'Essential Fleece Hoodie',
    brand: 'Northwear',
    category: 'fashion',
    price: 2499,
    originalPrice: 3299,
    rating: 4.5,
    reviews: 954,
    image: unsplash('1556821840-3a63f95609a7'),
    description:
      'Heavyweight brushed-fleece hoodie with a relaxed fit, double-lined hood and ribbed cuffs. Built to last.',
    highlights: ['400 GSM cotton', 'Relaxed fit', 'Pre-shrunk', 'Machine washable'],
    stock: 75,
  },
  {
    name: 'Court Classic Sneakers',
    brand: 'Stride',
    category: 'footwear',
    price: 5999,
    rating: 4.4,
    reviews: 845,
    image: unsplash('1491553895911-0055eca6402d'),
    description:
      'Clean low-top sneakers with premium leather upper and cushioned insole — your everyday go-to pair.',
    highlights: ['Leather upper', 'Cushioned insole', 'Durable cupsole', 'Unisex sizing'],
    stock: 3,
  },
  {
    name: 'AirBeats True Wireless Earbuds',
    brand: 'Sonic Lab',
    category: 'audio',
    price: 4999,
    originalPrice: 6999,
    rating: 4.5,
    reviews: 3120,
    image: unsplash('1590658268037-6bf12165a8df'),
    badge: 'Trending',
    description:
      'Pocket-sized earbuds with punchy bass, active noise cancellation, wireless charging case and 30 hours of total playtime.',
    highlights: ['Active noise cancellation', '30h with case', 'IPX5 sweat resistant', 'Wireless charging'],
    stock: 120,
  },
  {
    name: 'BoomBox Go Portable Speaker',
    brand: 'Sonic Lab',
    category: 'audio',
    price: 7499,
    originalPrice: 8999,
    rating: 4.6,
    reviews: 1408,
    image: unsplash('1608043152269-423dbba4e7e1'),
    description:
      'Rugged waterproof speaker with 360° sound, deep bass and 20 hours of battery — made for beaches, treks and parties.',
    highlights: ['IP67 waterproof', '20h battery', '360° sound', 'Pair two for stereo'],
    stock: 35,
  },
  {
    name: 'Everyday Organic Cotton Tee',
    brand: 'Northwear',
    category: 'fashion',
    price: 999,
    originalPrice: 1299,
    rating: 4.3,
    reviews: 2087,
    image: unsplash('1521572163474-6864f9cf17ab'),
    badge: 'New',
    description:
      'Soft, breathable 100% organic cotton crew-neck tee with a modern regular fit. The essential layer for every wardrobe.',
    highlights: ['100% organic cotton', '180 GSM', 'Regular fit', 'Bio-washed'],
    stock: 150,
  },
  {
    name: 'Aero Max Lifestyle Sneakers',
    brand: 'Stride',
    category: 'footwear',
    price: 8999,
    originalPrice: 10999,
    rating: 4.7,
    reviews: 667,
    image: unsplash('1600185365483-26d7a4cc7519'),
    description:
      'Iconic visible-air cushioning meets a lightweight mesh upper. All-day comfort with bold street style.',
    highlights: ['Visible air unit', 'Breathable mesh', 'Rubber waffle outsole', 'Padded collar'],
    stock: 0,
  },
];

async function upsertUser(details: { name: string; email: string; password: string }, role: 'admin' | 'customer') {
  let user = await User.findOne({ email: details.email }).select('+password');

  if (!user) {
    user = new User({ ...details, role });
  } else {
    // Keep credentials in sync with the seed values
    user.name = details.name;
    user.password = details.password;
    user.role = role;
  }

  await user.save();
  return user;
}

async function seedOrders(customerId: mongoose.Types.ObjectId) {
  if (await Order.exists({ user: customerId })) {
    console.log('   • Sample orders already exist — skipped');
    return;
  }

  const catalog = await Product.find({ isActive: true });
  const byName = (name: string) => catalog.find((p) => p.name === name)!;

  const samples: { daysAgo: number; status: OrderStatus; lines: [string, number][] }[] = [
    { daysAgo: 6, status: 'delivered', lines: [['Aura Pro Wireless Headphones', 1], ['Everyday Organic Cotton Tee', 2]] },
    { daysAgo: 5, status: 'delivered', lines: [['Velocity Runner Sneakers', 1]] },
    { daysAgo: 4, status: 'shipped', lines: [['Pulse Smartwatch Series 5', 1]] },
    { daysAgo: 3, status: 'cancelled', lines: [['Horizon Polarized Sunglasses', 1]] },
    { daysAgo: 2, status: 'confirmed', lines: [['UltraBook Air 14', 1], ['Nomad Leather Backpack', 1]] },
    { daysAgo: 1, status: 'pending', lines: [['AirBeats True Wireless Earbuds', 2]] },
    { daysAgo: 0, status: 'pending', lines: [['Essential Fleece Hoodie', 1], ['BoomBox Go Portable Speaker', 1]] },
  ];

  for (const [index, sample] of samples.entries()) {
    const items = sample.lines.map(([name, quantity]) => {
      const product = byName(name);
      return {
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        quantity,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const createdAt = new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000);

    // timestamps: false keeps the back-dated createdAt for the sales chart
    await new Order({
      orderNumber: `DCDEMO${String(index + 1).padStart(3, '0')}`,
      user: customerId,
      items,
      shippingAddress: {
        fullName: DEMO_CUSTOMER.name,
        phone: '9876543210',
        line: '221B MG Road, Indiranagar',
        city: 'Bengaluru',
        pincode: '560038',
      },
      paymentMethod: (['upi', 'card', 'cod'] as const)[index % 3],
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: sample.status,
      createdAt,
      updatedAt: createdAt,
    }).save({ timestamps: false });
  }

  console.log(`   • Created ${samples.length} sample orders`);
}

async function seed() {
  await connectDatabase();

  console.log('\n👤 Users');
  const admin = await upsertUser(ADMIN, 'admin');
  console.log(`   • Admin ready: ${admin.email}`);
  const customer = await upsertUser(DEMO_CUSTOMER, 'customer');
  console.log(`   • Demo customer ready: ${customer.email}`);

  console.log('\n🛍️  Products');
  let created = 0;
  for (const product of products) {
    // Matched by name: re-running refreshes details but keeps admin stock edits
    const { stock, ...details } = product;
    const result = await Product.updateOne(
      { name: product.name },
      { $set: { ...details, isActive: true }, $setOnInsert: { stock } },
      { upsert: true },
    );
    if (result.upsertedCount) created += 1;
  }
  console.log(`   • ${created} created, ${products.length - created} updated`);

  console.log('\n📦 Orders');
  await seedOrders(customer._id);

  console.log('\n✅ Seed complete\n');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('❌ Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
