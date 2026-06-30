import { useState, useMemo } from 'react';
import '../../App.css';
import {
    useSales,
    useSalesByDay,
    useSalesByMonth,
    useSalesByYear,
    useSalesByCategory,
    useSalesByProduct,
    useSalesByCustomer
} from '../../Hooks/report';
import { useFetchAllOrders } from '../../Hooks/order';
import { useGetAllUsers } from '../../Hooks/user';
import { useGetProducts } from '../../Hooks/product';
import { useGetCategories } from '../../Hooks/category';
import { exportReport } from '../../Api/reportApi';

export const SalesReport = () => {
    const [activeTab, setActiveTab] = useState<'day' | 'month' | 'year' | 'category' | 'product' | 'customer'>('day');

    const { data: reportData, isLoading: salesLoading } = useSales();
    const { data: salesByDayData } = useSalesByDay();
    const { data: salesByMonthData } = useSalesByMonth();
    const { data: salesByYearData } = useSalesByYear();
    const { data: salesByCategoryData } = useSalesByCategory();
    const { data: salesByProductData } = useSalesByProduct();
    const { data: salesByCustomerData } = useSalesByCustomer();
    const { data: ordersData, isLoading: ordersLoading } = useFetchAllOrders();
    const { data: users, isLoading: usersLoading } = useGetAllUsers();
    const { data: products } = useGetProducts();
    const { data: allCategories, isLoading: categoriesLoading } = useGetCategories();


    const orders = ordersData?.orders || [];

    const stats = useMemo(() => {
        const totalRevenue = reportData?.totalAmount || 0;
        const totalOrders = reportData?.totalOrders || 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const returnRate = totalOrders > 0 ? ((reportData?.totalReturn || 0) / totalOrders) * 100 : 0;
        const refundAmount = reportData?.totalReturnAmount || 0;

        let maxDate = new Date();
        if (orders.length > 0) {
            const validDates = orders.map((o: any) => new Date(o.createdAt).getTime()).filter((t: number) => !isNaN(t));
            if (validDates.length > 0) {
                maxDate = new Date(Math.max(...validDates));
            }
        }

        const currentYear = maxDate.getFullYear();
        const currentMonth = maxDate.getMonth();
        const monthlyRevenue = new Array(12).fill(0);

        orders.forEach((order: any) => {
            const d = new Date(order.createdAt);
            if (d.getFullYear() === currentYear) {
                monthlyRevenue[d.getMonth()] += order.totalAmount || 0;
            }
        });

        const getMonthName = (m: number) => {
            const date = new Date(2000, m, 1);
            return date.toLocaleString('default', { month: 'short' });
        };

        const m1 = (currentMonth - 2 + 12) % 12;
        const m2 = (currentMonth - 1 + 12) % 12;
        const m3 = currentMonth;

        const maxMonthRev = Math.max(monthlyRevenue[m1], monthlyRevenue[m2], monthlyRevenue[m3], 1);

        const last3Months = [
            { name: getMonthName(m1), revenue: monthlyRevenue[m1], pct: maxMonthRev ? (monthlyRevenue[m1] / maxMonthRev) * 100 : 0 },
            { name: getMonthName(m2), revenue: monthlyRevenue[m2], pct: maxMonthRev ? (monthlyRevenue[m2] / maxMonthRev) * 100 : 0 },
            { name: getMonthName(m3), revenue: monthlyRevenue[m3], pct: maxMonthRev ? (monthlyRevenue[m3] / maxMonthRev) * 100 : 0 },
        ];

        const productStats: Record<string, { units: number, revenue: number, category: string }> = {};
        const categoryRevenue: Record<string, number> = {};
        let totalCalculatedRevenue = 0;

        orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
                const product = products?.find((p: any) => String(p._id) === String(item.productId));
                const prodCategory: any = product?.category;
                const categoryId = (prodCategory && typeof prodCategory === 'object') ? String(prodCategory._id || "") : String(prodCategory || "");
                const categoryFallback = (prodCategory && typeof prodCategory === 'object') ? prodCategory.name : "Others";
                const category = allCategories?.find((c: any) => String(c._id) === categoryId)?.name || categoryFallback || "Others";
                const revenue = item.total;

                categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
                totalCalculatedRevenue += revenue;

                const title = item.title || "Unknown Product";
                if (!productStats[title]) {
                    productStats[title] = { units: 0, revenue: 0, category };
                }
                productStats[title].units += item.quantity || 0;
                productStats[title].revenue += revenue;
            });
        });

        let sortedEntries = Object.entries(categoryRevenue).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length > 4) {
            const top3 = sortedEntries.slice(0, 3);
            const othersRev = sortedEntries.slice(3).reduce((sum, [_, rev]) => sum + rev, 0);
            const othersIndex = top3.findIndex(([name]) => name === "Others");
            if (othersIndex !== -1) {
                top3[othersIndex][1] += othersRev;
                sortedEntries = top3;
            } else {
                sortedEntries = [...top3, ["Others", othersRev]];
            }
        }

        const sortedCategories = sortedEntries.map(([name, revenue]) => ({
            name,
            revenue,
            pct: totalCalculatedRevenue > 0 ? (revenue / totalCalculatedRevenue) * 100 : 0
        }));

        const topProductsList = Object.entries(productStats)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .map(([title, data]) => ({ title, ...data }))
            .slice(0, 5);

        const regionStats: Record<string, number> = {};
        orders.forEach((order: any) => {
            const state = order.shippingAddress?.state || "Others";
            regionStats[state] = (regionStats[state] || 0) + (order.totalAmount || 0);
        });

        const sortedRegions = Object.entries(regionStats)
            .sort((a, b) => b[1] - a[1])
            .map(([name, revenue]) => ({ name, revenue, pct: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0 }))
            .slice(0, 5);

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            returnRate,
            refundAmount,
            last3Months,
            sortedCategories,
            topProductsList,
            sortedRegions,
            totalCustomers: users?.length || 0
        };
    }, [reportData, orders, products, users, allCategories]);

    const formatCurrency = (val: number) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            await exportReport(format);
        } catch (error) {
            console.error(error);
            alert("Failed to export report");
        }
    };

    if (salesLoading || ordersLoading || usersLoading || categoriesLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="dot-spinner">
                    <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                </div>
            </div>
        );
    }

    const colors = ['bg-ink', 'bg-accent', 'bg-slate', 'bg-mist', 'bg-rule'];

    return (
        <>
            <header className="">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium tracking-widest uppercase text-mist">Sales Report</span>
                        <hr className='w-[120%] h-0.5 bg-mist' />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-mist">{new Date().toLocaleString('default', { month: 'short' })} — {new Date().getFullYear()}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleExport('csv')} className="flex items-center gap-1.5 bg-ink text-gray-800 text-xs font-medium px-4 py-1.5 rounded-full hover:shadow-sm transition-shadow cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                                CSV
                            </button>
                            <button onClick={() => handleExport('excel')} className="flex items-center gap-1.5 bg-ink text-gray-800 text-xs font-medium px-4 py-1.5 rounded-full hover:shadow-sm transition-shadow cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                                Excel
                            </button>
                            <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 bg-ink text-gray-800 text-xs font-medium px-4 py-1.5 rounded-full hover:shadow-sm transition-shadow cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                                PDF
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">

                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl text-ink leading-tight">Sales Overview</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

                    <div className="fade-up bg-ink rounded-2xl shadow-md p-6 col-span-2 md:col-span-1 flex flex-col justify-between min-h-20">
                        <p className="text-xs font-medium text-black/50 uppercase tracking-widest">Total Revenue</p>
                        <div>
                            <p className="font-serif text-4xl mt-3">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                    </div>

                    <div className="fade-up bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-20">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest">Orders</p>
                        <div>
                            <p className="font-serif text-4xl mt-3">{stats.totalOrders.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className="fade-up bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-20">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest">Avg. Order Value</p>
                        <div>
                            <p className="font-serif text-4xl mt-3">{formatCurrency(stats.avgOrderValue)}</p>
                        </div>
                    </div>

                    <div className="fade-up bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-20">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest">Return Rate</p>
                        <div className='flex justify-between items-center'>
                            <p className="font-serif text-4xl font-medium text-mist">{formatCurrency(stats.refundAmount)}</p>
                            <p className="font-serif text-sm mt-3 font-bold text-red-500">{stats.returnRate.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs font-medium text-mist uppercase tracking-widest mb-1">Monthly Revenue</p>
                                <p className="font-serif text-2xl">Last 3 Months</p>
                            </div>
                            <span className="text-xs bg-paper border border-rule text-slate px-3 py-1 rounded-full">₹ INR</span>
                        </div>

                        <div className="flex items-end gap-4 h-44">
                            {stats.last3Months.map((m, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <span className={`text-xs ${idx === 2 ? 'font-semibold text-accent' : 'font-medium text-slate'}`}>{formatCurrency(m.revenue)}</span>
                                    <div className="w-full bg-rule rounded-t-lg relative overflow-hidden" style={{ height: '130px' }}>
                                        <div className={`bar absolute bottom-0 w-full ${idx === 2 ? 'bg-accent' : 'bg-ink'} rounded-t-lg transition-all duration-1000`} style={{ height: `${m.pct}%` }}></div>
                                    </div>
                                    <span className={`text-xs ${idx === 2 ? 'font-semibold text-accent' : 'text-mist'}`}>{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest mb-1">By Category</p>
                        <p className="font-serif text-2xl mb-6">Revenue Mix</p>

                        <div className="space-y-4">
                            {stats.sortedCategories.map((cat, idx) => (
                                <div key={cat.name}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate font-medium capitalize">{cat.name}</span>
                                        <span className="text-ink font-semibold">{cat.pct.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 bg-paper rounded-full overflow-hidden">
                                        <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-1000`} style={{ width: `${cat.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            {stats.sortedCategories.length === 0 && <p className="text-sm text-mist text-center mt-10">No data available</p>}
                        </div>

                        {stats.sortedCategories.length > 0 && (
                            <div className="mt-6 pt-5 border-t border-rule grid grid-cols-2 gap-2">
                                {stats.sortedCategories.map((cat, idx) => (
                                    <div key={cat.name} className="flex items-center gap-2 text-xs text-mist capitalize"><span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]} inline-block`}></span>{cat.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-rule">
                        <div>
                            <p className="text-xs font-medium text-mist uppercase tracking-widest mb-0.5">Performance</p>
                            <p className="font-serif text-2xl">Top Products</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-paper text-xs text-mist uppercase tracking-widest border-b border-gray-500">
                                    <th className="px-6 py-3 font-medium">Product</th>
                                    <th className="px-6 py-3 font-medium">Category</th>
                                    <th className="px-6 py-3 font-medium text-right">Units Sold</th>
                                    <th className="px-6 py-3 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stats.topProductsList.map((prod, idx) => (
                                    <tr key={idx} className="hover:bg-paper/60 transition-colors">
                                        <td className="px-6 py-4 font-medium text-ink truncate max-w-50">{prod.title}</td>
                                        <td className="px-6 py-4 text-slate capitalize">{prod.category}</td>
                                        <td className="px-6 py-4 text-right text-slate">{prod.units}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-ink">₹{prod.revenue.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                                {stats.topProductsList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-mist">No products sold yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest mb-1">Geography</p>
                        <p className="font-serif text-2xl mb-6">Regional Breakdown</p>

                        <div className="space-y-5">
                            {stats.sortedRegions.map((region, idx) => (
                                <div key={region.name} className="flex items-center gap-4">
                                    <span className="w-24 text-xs text-slate font-medium shrink-0 truncate">{region.name}</span>
                                    <div className="flex-1 h-2.5 bg-paper rounded-full overflow-hidden">
                                        <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-1000`} style={{ width: `${region.pct}%` }}></div>
                                    </div>
                                    <span className="w-16 text-xs text-right text-ink font-semibold">{formatCurrency(region.revenue)}</span>
                                </div>
                            ))}
                            {stats.sortedRegions.length === 0 && <p className="text-sm text-mist text-center mt-10">No data available</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest mb-1">Execution</p>
                        <p className="font-serif text-2xl mb-6">Target vs Actual</p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate font-medium">Revenue</span>
                                    <span className="text-ink font-semibold">{formatCurrency(stats.totalRevenue)} / ₹2L</span>
                                </div>
                                <div className="relative h-4 bg-paper rounded-full overflow-hidden">
                                    <div className={`h-full ${stats.totalRevenue >= 200000 ? 'bg-up' : 'bg-accent'} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((stats.totalRevenue / 200000) * 100, 100)}%` }}></div>
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-ink/30" style={{ left: '100%' }}></div>
                                </div>
                                <p className={`text-[11px] mt-1 font-semibold ${stats.totalRevenue >= 200000 ? 'text-up' : 'text-slate'}`}>
                                    {((stats.totalRevenue / 200000) * 100).toFixed(1)}% of target {stats.totalRevenue >= 200000 && '✓'}
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate font-medium">Orders</span>
                                    <span className="text-ink font-semibold">{stats.totalOrders.toLocaleString('en-IN')} / 1000</span>
                                </div>
                                <div className="relative h-4 bg-paper rounded-full overflow-hidden">
                                    <div className={`h-full ${stats.totalOrders >= 1000 ? 'bg-up' : 'bg-accent'} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((stats.totalOrders / 1000) * 100, 100)}%` }}></div>
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-ink/30" style={{ left: '100%' }}></div>
                                </div>
                                <p className={`text-[11px] mt-1 font-semibold ${stats.totalOrders >= 1000 ? 'text-up' : 'text-slate'}`}>
                                    {((stats.totalOrders / 1000) * 100).toFixed(1)}% of target {stats.totalOrders >= 1000 && '✓'}
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate font-medium">New Customers</span>
                                    <span className="text-ink font-semibold">{stats.totalCustomers.toLocaleString('en-IN')} / 500</span>
                                </div>
                                <div className="relative h-4 bg-paper rounded-full overflow-hidden">
                                    <div className={`h-full ${stats.totalCustomers >= 500 ? 'bg-up' : 'bg-accent'} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((stats.totalCustomers / 500) * 100, 100)}%` }}></div>
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-ink/30" style={{ left: '100%' }}></div>
                                </div>
                                <p className={`text-[11px] mt-1 font-semibold ${stats.totalCustomers >= 500 ? 'text-up' : 'text-slate'}`}>
                                    {((stats.totalCustomers / 500) * 100).toFixed(1)}% of target {stats.totalCustomers >= 500 && '✓'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10">
                    <div className="px-6 py-5 border-b border-rule">
                        <p className="text-xs font-medium text-mist uppercase tracking-widest mb-0.5">Deep Dive</p>
                        <p className="font-serif text-2xl">Detailed Analytics</p>
                    </div>
                    <div className="flex border-b border-rule overflow-x-auto">
                        <button onClick={() => setActiveTab('day')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'day' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Daily</button>
                        <button onClick={() => setActiveTab('month')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'month' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Monthly</button>
                        <button onClick={() => setActiveTab('year')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'year' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Yearly</button>
                        <button onClick={() => setActiveTab('category')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'category' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Category</button>
                        <button onClick={() => setActiveTab('product')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'product' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Product</button>
                        <button onClick={() => setActiveTab('customer')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'customer' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>Customer</button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-paper text-xs text-mist uppercase tracking-widest border-b border-gray-200">
                                    <th className="px-4 py-3 font-medium">Identifier</th>
                                    <th className="px-4 py-3 font-medium text-right">Orders / Units</th>
                                    <th className="px-4 py-3 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeTab === 'day' && salesByDayData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium">{d._id}</td>
                                        <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.totalSales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {activeTab === 'month' && salesByMonthData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium">{d._id}</td>
                                        <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.totalSales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {activeTab === 'year' && salesByYearData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium">{d._id}</td>
                                        <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.totalSales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {activeTab === 'category' && salesByCategoryData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium capitalize">{d._id}</td>
                                        <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.totalSales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {activeTab === 'product' && salesByProductData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium">{d.title}</td>
                                        <td className="px-4 py-3 text-right">{d.quantitySold} Units</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.sales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {activeTab === 'customer' && salesByCustomerData?.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-paper/50">
                                        <td className="px-4 py-3 font-medium">
                                            {d.name} <span className="text-xs text-mist block">{d.customerId}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{d.quantitySold} Units</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{d.sales?.toLocaleString('en-IN') || 0}</td>
                                    </tr>
                                ))}
                                {((activeTab === 'day' && !salesByDayData?.length) ||
                                    (activeTab === 'month' && !salesByMonthData?.length) ||
                                    (activeTab === 'year' && !salesByYearData?.length) ||
                                    (activeTab === 'category' && !salesByCategoryData?.length) ||
                                    (activeTab === 'product' && !salesByProductData?.length) ||
                                    (activeTab === 'customer' && !salesByCustomerData?.length)) && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-mist">No data available for this view</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="border-t border-rule pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <p className="text-xs text-mist">Generated {new Date().toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} · Vastra Verse Internal Use Only</p>
                    <div className="flex items-center gap-4 text-xs text-mist">
                        <span>Data source: ERP System</span>
                        <span className="w-px h-3 bg-rule"></span>
                        <span>Finance & Analytics Team</span>
                    </div>
                </footer>

            </main>
        </>
    );
};