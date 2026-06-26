import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Truck,
    BarChart3,
    Settings,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    List,
    PenTool,
    Star,
    Headphones,
    MessageCircleQuestion,
    MessageCircle,
    Tag,
    ChartNoAxesCombined,
    BadgeIndianRupee
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsLogin } from "../redux/authSlice";
import { toast } from "sonner";
import { useAdminNotifications } from "../Hooks/notification";

const sidebarLinks = [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "products", label: "Products", icon: Package },
    { to: "categories", label: "Categories", icon: List },
    { to: "orders", label: "Orders", icon: ShoppingCart },
    { to: "blogs", label: "Blogs", icon: PenTool },
    { to: "customers", label: "Customers", icon: Users },
    { to: "chats", label: "Chats", icon: MessageCircle },
    { to: "reviews", label: "Reviews", icon: Star },
    { to: "qa", label: "QA", icon: MessageCircleQuestion },
    { to: "helpcenter", label: "Help Center", icon: Headphones },
    { to: "coupon", label: "Coupons", icon: Tag },
    { to: "marketing", label: "Marketing", icon: BadgeIndianRupee },
    { to: "sales-report", label: "Sales Report", icon: BarChart3 },
    { to: "revenue-report", label: "Revenue Report", icon: BarChart3 },
    { to: "analytics", label: "Analytics", icon: ChartNoAxesCombined }
];


export const AdminDashboard = () => {

    const { data: notifications } = useAdminNotifications();

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLogin)
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar when route changes
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Please! Login after access Admin Panel!", {
                duration: 1500
            })
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [isLoggedIn]);

    return (
        <div className="flex h-screen overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:relative z-30 h-full flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0 w-55" : "-translate-x-full lg:translate-x-0"
                    } ${collapsed ? "lg:w-18" : "lg:w-55"}`}
            >
                <div className="flex items-center gap-3 px-5 py-4.5 border-b border-gray-800">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Truck size={20} className="text-gray-900" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-white text-base font-bold whitespace-nowrap leading-tight">
                                VASTRA VERSE
                            </h1>
                            <p className="text-gray-400 text-[11px] whitespace-nowrap">
                                Admin Panel
                            </p>
                        </div>
                    )}
                </div>


                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="flex flex-col gap-1">
                        {sidebarLinks.map((link) => {
                            const isActive =
                                location.pathname.endsWith(`/${link.to}`) ||
                                (link.to === "dashboard" && location.pathname === "/admin");
                            const Icon = link.icon;

                            return (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 no-underline
                                            ${isActive
                                                ? "bg-gray-600/30 text-white"
                                                : "text-gray-400 hover:bg-white/8 hover:text-gray-200"
                                            }`}
                                    >
                                        <Icon
                                            size={20}
                                            className={`shrink-0 transition-colors duration-200 ${isActive ? "text-gray-50" : "text-gray-500 group-hover:text-gray-300"}`}
                                        />
                                        {!collapsed && (
                                            <span className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-white" : ""}`}>
                                                {link.label}
                                            </span>
                                        )}
                                        {isActive && !collapsed && (
                                            <div className="animate-pulse ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>


                <div className="border-t border-gray-500 px-3 py-4">
                    <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/8 hover:text-red-400 transition-all duration-200 cursor-pointer border-none bg-transparent">
                        <LogOut size={20} className="shrink-0" />
                        {!collapsed && (
                            <span className="text-sm font-medium">Logout</span>
                        )}
                    </button>
                </div>


                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-15 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer z-10"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>


            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-xl border-b border-gray-200 bg-white/80">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg border border-gray-200 bg-transparent text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>


                        <div className="relative hidden sm:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders, products..."
                                className="w-72 pl-9 pr-4 py-2 text-sm transition-colors duration-200 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-7">

                        <button
                            onClick={() => navigate("/admin/notifications")}
                            className="relative p-2.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                            <Bell size={20} className="text-gray-700" />
                            {notifications?.filter((notifi: any) => notifi?.isRead == false).length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-6 h-6 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold">
                                    {notifications?.filter((notifi: any) => notifi?.isRead == false).length}
                                </span>
                            )}
                        </button>


                        <div className="w-px h-8 bg-gray-300" />


                        <div className="flex items-center gap-3 pl-2 cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-sm font-bold">
                                JJ
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold leading-tight text-gray-800">
                                    Jatin Jethava
                                </p>
                                <p className="text-[11px] text-gray-500">
                                    Owner
                                </p>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};