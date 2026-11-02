import { Order, ORDER_STATUSES, toPublicOrder, type OrderStatus } from '../models/order.model';
import { Product, toPublicProduct } from '../models/product.model';
import { User } from '../models/user.model';

const LOW_STOCK_THRESHOLD = 5;
const SALES_DAYS = 7;

export async function getDashboardStats() {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (SALES_DAYS - 1));

  const [revenueAgg, statusAgg, customers, products, lowStock, recentOrders, salesAgg] = await Promise.all([
    Order.aggregate<{ revenue: number; count: number }>([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate<{ _id: OrderStatus; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true, stock: { $lte: LOW_STOCK_THRESHOLD } }).sort({ stock: 1 }).limit(5),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    Order.aggregate<{ _id: string; revenue: number; orders: number }>([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
    ]),
  ]);

  const ordersByStatus = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0])) as Record<
    OrderStatus,
    number
  >;
  for (const row of statusAgg) ordersByStatus[row._id] = row.count;

  // One entry per day, including days without sales
  const salesByDay = new Map(salesAgg.map((row) => [row._id, row]));
  const sales = Array.from({ length: SALES_DAYS }, (_, index) => {
    const day = new Date(since);
    day.setDate(since.getDate() + index);
    const key = day.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    return {
      date: key,
      revenue: salesByDay.get(key)?.revenue ?? 0,
      orders: salesByDay.get(key)?.orders ?? 0,
    };
  });

  return {
    totals: {
      revenue: revenueAgg[0]?.revenue ?? 0,
      orders: Object.values(ordersByStatus).reduce((a, b) => a + b, 0),
      customers,
      products,
    },
    ordersByStatus,
    sales,
    lowStock: lowStock.map(toPublicProduct),
    recentOrders: recentOrders.map(toPublicOrder),
  };
}
