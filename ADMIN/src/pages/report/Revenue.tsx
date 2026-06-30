import { useState } from 'react';
import {
    useRevenueOverview,
    useRevenueCharts,
    useRevenueByRegion,
    useRevenueByPaymentMethod
} from '../../Hooks/revenue';
import { useSalesByCategory, useSalesByProduct } from '../../Hooks/report';
import {
    IndianRupee,
    TrendingUp,
    Percent,
    RotateCcw,
    Truck,
    Receipt,
    PieChart
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { exportRevenue } from '../../Api/revenueApi';
import { toast } from 'sonner';

export const RevenueReport = () => {
    const [activeTab, setActiveTab] = useState<'product' | 'category' | 'region' | 'payment'>('product');

    const { data: overview, isLoading: overviewLoading } = useRevenueOverview();
    const { data: chartsData, isLoading: chartsLoading } = useRevenueCharts();
    const { data: regionData } = useRevenueByRegion();
    const { data: paymentData } = useRevenueByPaymentMethod();
    const { data: categoryData } = useSalesByCategory();
    const { data: productData } = useSalesByProduct();

    if (overviewLoading || chartsLoading) {
        return <div className="flex h-[80vh] items-center justify-center">Loading revenue data...</div>;
    }

    const formatCurrency = (value: number) => `₹${value?.toLocaleString('en-IN')}`;

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            await exportRevenue(format);
            toast.success(`Report exported successfully in ${format.toUpperCase()} format`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to export report");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <header className="mt-5 mb-8">
                <div className="flex justify-between items-center gap-1">
                    <span className="text-xs font-medium tracking-widest uppercase text-mist">Revenue Analytics</span>
                    <div className="flex items-center gap-3 mb-2">
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
                <hr className='w-full h-0.5 bg-mist' />
                <h1 className="text-3xl mt-4 text-ink">Revenue Reports</h1>
                <p className="text-mist text-sm mt-1">Comprehensive breakdown of your financials, expenses, and margins.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {[
                    { label: 'Gross Revenue', value: overview?.grossRevenue, icon: <TrendingUp size={18} /> },
                    { label: 'Net Revenue', value: overview?.netRevenue, icon: <IndianRupee size={18} /> },
                    { label: 'Profit', value: overview?.profit, icon: <PieChart size={18} /> },
                    { label: 'Discounts', value: overview?.totalDiscounts, icon: <Percent size={18} /> },
                    { label: 'Shipping Rev', value: overview?.shippingRevenue, icon: <Truck size={18} /> },
                    { label: 'Tax Collected', value: overview?.taxCollected, icon: <Receipt size={18} /> },
                    { label: 'Refunds', value: overview?.refunds, icon: <RotateCcw size={18} /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 text-mist mb-2">
                            {stat.icon}
                            <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-lg font-bold text-ink">{formatCurrency(stat.value || 0)}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-serif text-xl mb-6">Revenue Overview</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartsData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-serif text-xl mb-6">Profit vs Expenses</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartsData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip formatter={(value: any) => formatCurrency(value)} cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="profit" stackId="a" fill="#10b981" />
                                <Bar dataKey="expenses" stackId="a" fill="#f43f5e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6 mb-10">
                <div className="px-6 py-5 border-b border-rule">
                    <p className="font-serif text-2xl">Segment Reports</p>
                </div>
                <div className="flex border-b border-rule overflow-x-auto">
                    <button onClick={() => setActiveTab('product')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'product' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>By Product</button>
                    <button onClick={() => setActiveTab('category')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'category' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>By Category</button>
                    <button onClick={() => setActiveTab('region')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'region' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>By Region</button>
                    <button onClick={() => setActiveTab('payment')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'payment' ? 'border-ink text-ink' : 'border-transparent text-mist hover:text-slate'}`}>By Payment Method</button>
                </div>
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-paper text-xs text-mist uppercase tracking-widest border-b border-gray-200">
                                <th className="px-4 py-3 font-medium">Segment</th>
                                <th className="px-4 py-3 font-medium text-right">Orders / Units</th>
                                <th className="px-4 py-3 font-medium text-right">Gross Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeTab === 'product' && productData?.map((d: any, i: number) => (
                                <tr key={i} className="hover:bg-paper/50">
                                    <td className="px-4 py-3 font-medium">{d.title}</td>
                                    <td className="px-4 py-3 text-right">{d.quantitySold} Units</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.sales || 0)}</td>
                                </tr>
                            ))}
                            {activeTab === 'category' && categoryData?.map((d: any, i: number) => (
                                <tr key={i} className="hover:bg-paper/50">
                                    <td className="px-4 py-3 font-medium capitalize">{d._id}</td>
                                    <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.totalSales || 0)}</td>
                                </tr>
                            ))}
                            {activeTab === 'region' && regionData?.map((d: any, i: number) => (
                                <tr key={i} className="hover:bg-paper/50">
                                    <td className="px-4 py-3 font-medium capitalize">{d._id}</td>
                                    <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.totalRevenue || 0)}</td>
                                </tr>
                            ))}
                            {activeTab === 'payment' && paymentData?.map((d: any, i: number) => (
                                <tr key={i} className="hover:bg-paper/50">
                                    <td className="px-4 py-3 font-medium uppercase">{d._id}</td>
                                    <td className="px-4 py-3 text-right">{d.totalOrders} Orders</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.totalRevenue || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};