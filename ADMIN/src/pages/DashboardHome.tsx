import {
  ShoppingCart,
  Users,
  Truck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  X,
  IndianRupee,
  Star,
} from "lucide-react";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getStatusStyles } from '../interface/function'
import { useFetchAllOrders } from "../Hooks/order";
import '../index.css'
import { useNavigate } from "react-router";
import { useGetAllUsers } from "../Hooks/user";
import { useFetchAllReviewsByAdmin } from "../Hooks/review";
import { useState, useMemo } from "react";
import { useGetProducts } from "../Hooks/product";
import { useConversionRate } from "../Hooks/analysis";

function ProgressRing({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  const radius = 36;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 84 84">
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={stroke}
          />
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
          {value}%
        </span>
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}
export default function DashboardHome() {

  const { data: orders, isLoading: orderLoading, error: orderError } = useFetchAllOrders();
  const { data: users, isLoading: userLoading, error: userError } = useGetAllUsers();
  const { data: reviews, isLoading: reviewLoading, error: reviewError } = useFetchAllReviewsByAdmin();
  const { data: product, isLoading: productLoading, error: productError } = useGetProducts();
  const { data: conversionRate } = useConversionRate();

  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<string>("all");

  const topProducts = product?.filter((p: any) => p.soldCount > 0)?.sort((a: any, b: any) => b.soldCount - a.soldCount)?.slice(0, 10);
  const avgOrderValue = (orders?.orders?.reduce((acc: any, order: any) => acc + order.totalAmount, 0) || 0) / (orders?.orders?.length || 1);
  const bestUser = orders?.orders?.reduce((best: any, order: any) => {
    if (best[order.userId]) {
      best[order.userId] += 1;
    } else {
      best[order.userId] = 1;
    }
    return best;
  }, {}) || {};

  const topUser = users?.find((user: any) => user._id === Object.keys(bestUser).sort((a: any, b: any) => bestUser[b] - bestUser[a])[0]);
  const stockLowProdcut = product?.flatMap((p: any) =>
    (p.variants || [])
      .filter((v: any) => v.stock <= 5)
      .map((v: any) => ({ ...p, variant: v }))
  )?.slice(0, 10);

  const chartData = useMemo(() => {
    const dataTemplate = [
      { month: "Jan", revenue: 0, previous: 0 },
      { month: "Feb", revenue: 0, previous: 0 },
      { month: "Mar", revenue: 0, previous: 0 },
      { month: "Apr", revenue: 0, previous: 0 },
      { month: "May", revenue: 0, previous: 0 },
      { month: "Jun", revenue: 0, previous: 0 },
      { month: "Jul", revenue: 0, previous: 0 },
      { month: "Aug", revenue: 0, previous: 0 },
      { month: "Sep", revenue: 0, previous: 0 },
      { month: "Oct", revenue: 0, previous: 0 },
      { month: "Nov", revenue: 0, previous: 0 },
      { month: "Dec", revenue: 0, previous: 0 },
    ];

    if (!orders?.orders || orders.orders.length === 0) return dataTemplate;

    let maxYear = 0;
    orders.orders.forEach((order: any) => {
      const y = new Date(order.createdAt).getFullYear();
      if (y > maxYear) maxYear = y;
    });

    const currentYear = maxYear || new Date().getFullYear();
    const previousYear = currentYear - 1;

    orders.orders.forEach((order: any) => {
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth();

      if (year === currentYear) {
        dataTemplate[month].revenue += order.totalAmount || 0;
      } else if (year === previousYear) {
        dataTemplate[month].previous += order.totalAmount || 0;
      }
    });

    return dataTemplate;
  }, [orders?.orders]);

  const filteredOrders = orders?.orders?.filter((order: any) => {
    if (!dateFilter) return true;

    const orderDate = new Date(order.createdAt);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (dateFilter === "all") {
      return true;
    }

    if (dateFilter === "today") {
      return orderDate >= todayStart;
    }

    if (dateFilter === "week") {
      const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= weekAgo;
    }

    if (dateFilter === "month") {
      const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
      return orderDate >= monthAgo;
    }

    if (dateFilter === "year") {
      const yearAgo = new Date(todayStart.getTime() - 365 * 24 * 60 * 60 * 1000);
      return orderDate >= yearAgo;
    }

    return true;
  });

  const deleveryMatrics = () => {
    if (filteredOrders) {
      const onTimeDelivery = filteredOrders.reduce((acc: any, order: any) => {
        if (order.expectedDeliveryDate >= order.deliveredAt) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const delayedDelivery = filteredOrders.reduce((acc: any, order: any) => {
        if (order.expectedDeliveryDate < order.deliveredAt) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const deliveredOrders = filteredOrders.filter(
        (order: any) => order.deliveredAt
      );

      const avgDeliveryTime =
        deliveredOrders.reduce((acc: number, order: any) => {
          const diffDays =
            (new Date(order.deliveredAt).getTime() -
              new Date(order.createdAt).getTime()) /
            (1000 * 60 * 60 * 24);

          return acc + diffDays;
        }, 0) / (deliveredOrders.length || 1);

      const cancelledDelivery = filteredOrders.filter((order: any) => order.orderStatus === "cancelled").length;
      const success = filteredOrders.filter((order: any) => order.orderStatus === "delivered").length;
      const pending = filteredOrders.filter((order: any) => order.orderStatus === "pending").length;
      const processing = filteredOrders.filter((order: any) => order.orderStatus === "processing").length;
      const outfordelivery = filteredOrders.filter((order: any) => order.orderStatus === "outfordelivery").length;

      return {
        onTimeDelivery,
        delayedDelivery,
        cancelledDelivery,
        avgDeliveryTime,
        success,
        pending,
        processing,
        outfordelivery,
      }
    }

    return {
      onTimeDelivery: 0,
      delayedDelivery: 0,
      cancelledDelivery: 0,
      success: 0,
      pending: 0,
      processing: 0,
      outfordelivery: 0,
      avgDeliveryTime: 0,
    };
  }

  const metrics = deleveryMatrics();
  const totalOrders = filteredOrders?.length || 1;

  const avgReview = (reviews?.data?.reviews || []).reduce((acc: number, review: any) => {
    return acc + review.rating;
  }, 0) / ((reviews?.data?.reviews || []).length || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Welcome back! Here's what's happening with your deliveries today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 rounded-md text-sm bg-gray-100 border border-gray-300 text-gray-800 outline-none focus:border-gray-800 transition-colors cursor-pointer w-full sm:w-auto"
            defaultValue="all"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-accent)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {filteredOrders?.length || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +12.5%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-muted)" }}>
              <ShoppingCart size={22} style={{ color: "var(--color-accent)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-2">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-success)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Revenue
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ₹{filteredOrders?.reduce((acc: number, order: any) => acc + order.totalAmount, 0) || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +8.2%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-success-muted)" }}>
              <IndianRupee size={22} style={{ color: "var(--color-success)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-3">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-info)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Customers
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {userLoading ? (
                  <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
                    <div className="dot-spinner">
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                    </div>
                  </div>
                ) : userError ? (
                  <div className="flex items-center gap-2">
                    <X size={24} style={{ color: "var(--color-danger)" }} />
                    <span className="text-red-500">Error</span>
                  </div>
                ) : (
                  users?.length
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +5.1%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-info-muted)" }}>
              <Users size={22} style={{ color: "var(--color-info)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-4">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-warning)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Active Deliveries
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {filteredOrders?.filter((order: any) => {
                  if (order?.orderStatus !== "delivered" && order?.orderStatus !== "cancel" && order?.orderStatus !== "pending") {
                    return order
                  }
                }).length || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingDown size={14} style={{ color: "var(--color-danger)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
                  -3.4%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-warning-muted)" }}>
              <Truck size={22} style={{ color: "var(--color-warning)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-accent)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Products Sold
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {product?.reduce((acc: any, product: any) => acc + product.soldCount, 0)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +20.5%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-muted)" }}>
              <TbRosetteDiscountCheck size={22} style={{ color: "var(--color-success)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-accent)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Average Order Value
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ₹{avgOrderValue?.toFixed(2)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +20.5%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-muted)" }}>
              <TbRosetteDiscountCheck size={22} style={{ color: "var(--color-success)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-accent)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {conversionRate?.conversionRate || 0}%
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  +20.5%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-muted)" }}>
              <TbRosetteDiscountCheck size={22} style={{ color: "var(--color-success)" }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up-delay-1">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "var(--color-accent)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Best Customer
              </p>
              <p className="text-xl font-bold text-gray-800 tracking-wider capitalize mt-2">
                {topUser?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} style={{ color: "var(--color-success)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  {bestUser[topUser?._id as any]}
                </span>
                <span className="text-xs text-gray-600">Total Orders</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-muted)" }}>
              <img src={topUser?.profileImage} className="w-full h-full object-cover rounded-full" alt="" />
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-100 border border-gray-200 rounded-lg p-5 animate-fade-in-up-delay-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Revenue Overview
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Monthly revenue for the current year
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 opacity-50" />
                <span className="text-gray-600">
                  Previous
                </span>
              </div>
            </div>

          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="#9CA3AF"
                  fill="#D1D5DB"
                  fillOpacity={0.2}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111827"
                  fill="#111827"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 animate-fade-in-up-delay-3">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Delivery Performance
          </h2>
          <p className="text-xs text-gray-600 mb-6">
            Today's delivery metrics
          </p>

          <div className="flex justify-around">
            <ProgressRing
              value={Number(((metrics.onTimeDelivery / totalOrders) * 100).toFixed(1))}
              color="var(--color-success)"
              label="On Time"
            />
            <ProgressRing
              value={Number(((metrics.success / totalOrders) * 100).toFixed(1))}
              color="var(--color-info)"
              label="Fulfilled"
            />
            <ProgressRing
              value={Number(((metrics.onTimeDelivery / (metrics.success || 1)) * 100).toFixed(1))}
              color="var(--color-accent)"
              label="Satisfaction"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-md p-3 text-center border border-gray-200">
              <p className="text-lg font-bold text-gray-800">
                {metrics.avgDeliveryTime.toFixed(2)} days
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Avg. Delivery Time
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-3 text-center border border-gray-200">
              <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
                {avgReview?.toFixed(1)} <Star size={18} className="fill-yellow-500 text-yellow-500" />
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Avg. Rating
              </p>

              {reviewLoading && (
                <div className="dot-spinner">
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                </div>
              )}

              {!reviewLoading && reviewError && (
                <p className="text-red-500 text-xs">Error loading reviews</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-100 border border-gray-200 rounded-lg animate-fade-in-up-delay-3">
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Latest delivery orders
              </p>
            </div>
            <button
              onClick={() => { navigate("/admin/orders") }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-800 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer">
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="relative overflow-x-auto mt-4">

            {orderLoading && (
              <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
                <div className="dot-spinner">
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                </div>
              </div>
            )}

            {orderError && (
              <div className="text-center text-red-500">{orderError.message}</div>
            )}

            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Items
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.orders?.slice(0, 7).map((order) => {
                  const statusStyle = getStatusStyles(order.orderStatus as string);
                  const StatusIcon = statusStyle.Icon;

                  return (
                    <tr
                      key={order?._id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-200 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-start text-gray-400">
                          <p className="text-gray-900"> {order?.orderNumber}</p>
                          <p className="text-xs">#{order?._id?.slice(0, 8) + "..."}</p>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {order?.shippingAddress?.fullName}
                          </p>
                          <p className="text-[11px] text-gray-600">
                            {order?.createdAt}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-sm text-gray-600 max-w-50 truncate">
                          {order?.items?.map((item: any) => item?.title).join(', ')}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹ {order?.totalAmount}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        >
                          <StatusIcon size={12} />
                          {order?.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 animate-fade-in-up-delay-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Top Products
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Best sellers this month
              </p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer border-none bg-transparent">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {productLoading && (
            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
              <div className="dot-spinner">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
              </div>
            </div>
          )}

          {productError && (
            <div className="flex items-center justify-center">
              <p className="text-red-500 text-sm font-medium">{productError.message}</p>
            </div>
          )}

          <div className="space-y-3">
            {topProducts?.map((product, index) => (
              <div
                key={product.title}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 transition-colors group"
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${index === 0
                      ? "bg-orange-200 text-orange-800"
                      : index === 1
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {product?.title}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    {product?.soldCount || 0} orders
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    ₹ {product?.discountPrice && product?.discountPrice !== product?.basePrice ? product?.discountPrice : product?.basePrice}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 line-through">
                    {product?.discountPrice && product?.discountPrice !== product?.basePrice ? `₹ ${product?.basePrice}` : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stockLowProdcut?.length > 0 && (
        <div className="shadow-md rounded-sm bg-gray-100 py-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Variant</th>
                  <th className="text-left p-3">SKU</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3 relative">
                    <p>Status</p>
                    <p className="text-[11px] font-normal text-gray-600">
                      Low Stock Alerts
                    </p>

                    <button
                      onClick={() => { navigate("/admin/products") }}
                      className="absolute top-2 right-2 flex items-center gap-1.5 text-xs font-medium text-gray-800 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer">
                      View All <ArrowUpRight size={14} />
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {stockLowProdcut?.map((item: any, index: number) => (
                  <tr
                    key={`${item._id}-${index}`}
                    className="shadow hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      {item.variant?.size} / {item.variant?.color}
                    </td>

                    <td className="p-3">
                      {item.variant?.sku}
                    </td>

                    <td className="p-3 font-semibold">
                      {item.variant?.stock}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.variant?.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {item.variant?.stock === 0
                          ? "Out of Stock"
                          : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div >
  );
}
