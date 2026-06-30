import { Link } from "react-router";
import { useFetchAllOrders } from "../../Hooks/order";
import { useCustomerGrowth, useGetAllUsers, useReturningCustomers } from "../../Hooks/user";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export const CustomerAnalysis = () => {


    const { data: users, isLoading: usersLoading } = useGetAllUsers();
    const { data: returningCustomer, isLoading: returningLoading } = useReturningCustomers();
    const { data: orders, isLoading: orderLoading } = useFetchAllOrders();
    const { data: growth, isLoading: growthLoading } = useCustomerGrowth();

    const isLoading = usersLoading || returningLoading || orderLoading || growthLoading;

    const bestUser = orders?.orders?.reduce((best: any, order: any) => {
        if (best[order.userId]) {
            best[order.userId] += 1;
        } else {
            best[order.userId] = 1;
        }
        return best;
    }, {}) || {};
    const sortedUserIds = Object.keys(bestUser).sort((a: any, b: any) => bestUser[b] - bestUser[a]);
    const topUser = users?.find((user: any) => user._id === sortedUserIds[0]);
    const top5Users = sortedUserIds.slice(1, 5).map((id: string) => users?.find((u: any) => u._id === id)).filter(Boolean);

    const newUser = users?.filter((user) => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const userDate = new Date(user.createdAt);
        return userDate >= monthAgo;
    })

    const lastWeek = users?.filter((user) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const userDate = new Date(user.createdAt);
        return userDate >= weekAgo;
    })

    const avgOrder = (orders?.orders?.length || 0) / (users?.length || 1);
    const CLV = (orders?.orders || []).map((order: any) => order.totalAmount).reduce((acc: any, amount: any) => acc + amount, 0) / (users?.length || 1);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
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
        );
    }

    return (
        <div>
            <Link to={"/admin/customers"} className="no-underline text-gray-600 hover:text-gray-900 transition-all duration-300">
                <div className="flex items-center gap-1">
                    <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold">Back</h3>
                </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">
                            Total Users
                        </span>
                    </div>
                    <h2 className="mt-3 text-3xl text-green-600 font-bold">
                        {users?.length || 0}
                    </h2>
                </div>


                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">
                            New Users
                        </span>
                    </div>
                    <h2 className="mt-3 text-3xl text-green-600 font-bold">
                        {newUser?.length || 0}
                    </h2>
                </div>


                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">
                            Last Week Users
                        </span>
                    </div>
                    <h2 className="mt-3 text-3xl text-green-600 font-bold">
                        {lastWeek?.length || 0}
                    </h2>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-5 relative group cursor-help">
                    <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">
                            Returning Customers
                        </span>
                    </div>
                    <h2 className="mt-3 text-3xl text-green-600 font-bold">
                        {returningCustomer?.length || 0}
                    </h2>

                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-52 bg-white border border-gray-200 text-gray-600 text-xs text-center p-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Customers who have placed more than 1 order
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45"></div>
                    </div>
                </div>

            </div>

            {topUser && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl text-gray-800 tracking-tight">Top Customer</h1>
                            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-sm font-semibold rounded-full border border-amber-200">
                                VIP Member
                            </span>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-amber-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-amber-700 text-3xl font-bold">
                                        {topUser.profileImage ? (
                                            <img src={topUser.profileImage} alt={topUser.name} className="w-full h-full object-cover" />
                                        ) : (
                                            topUser.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        #1
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{topUser.name}</h3>
                                    <p className="text-gray-500 font-medium">{topUser.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2.5 py-1 bg-white/60 text-gray-600 text-xs font-semibold rounded-full border border-amber-100 shadow-sm backdrop-blur-sm">
                                            Member since {new Date(topUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:text-right relative z-10 bg-white/40 p-4 rounded-xl border border-amber-100/50 backdrop-blur-sm">
                                <p className="text-sm text-amber-800 font-bold uppercase tracking-wider mb-1">Total Orders</p>
                                <p className="text-4xl font-black text-amber-600 drop-shadow-sm">{bestUser[topUser._id] || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full mt-4 lg:mt-0">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">🏆</span>
                            Top Runners-Up
                        </h2>
                        <div className="flex flex-col gap-3 justify-center">
                            {top5Users.map((user: any, idx: number) => (
                                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                {idx + 2}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{user.name}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-800">{bestUser[user._id]}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-semibold">Orders</div>
                                    </div>
                                </div>
                            ))}
                            {top5Users.length === 0 && (
                                <div className="text-center text-gray-400 py-8 text-sm">
                                    Not enough orders yet to rank runners-up.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="grid grid-cols-5 gap-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700 font-medium">
                                Average Order per User
                            </span>
                        </div>
                        <h2 className="mt-3 text-3xl text-green-600 font-bold">
                            {Math.floor(avgOrder) || 0}
                        </h2>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700 font-medium">
                                CLV - Customer Lifetime Value
                            </span>
                        </div>
                        <h2 className="mt-3 text-3xl text-green-600 font-bold">
                            ₹{CLV.toFixed(2) || 0}
                        </h2>
                    </div>
                </div>

            </div>
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Customer Growth</h1>
                </div>
                <div className="h-80 w-full">
                    {growth && growth.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="users" name="New Customers" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            No growth data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}