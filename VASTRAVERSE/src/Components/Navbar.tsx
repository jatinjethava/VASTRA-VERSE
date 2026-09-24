import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { logout, activeNav as setNavActive } from "../Redux/authSlice";
import { clearCart } from "../Redux/cartSlice";
import { toast } from "sonner";
import { persistor } from "../Redux/store";
import { FaRegBell, FaRegHeart } from "react-icons/fa";
import { getAllUserNotifications } from "../Hooks/notification";
import '../index.css'
import '../App.css'
import { Bookmark, Shield } from "lucide-react";
import { useLogoutCurrentDevice } from "../Hooks/user";
import { MdOutlineHeadsetMic } from "react-icons/md";

export const Navbar = () => {

    const { data: allnotification } = getAllUserNotifications();
    const { mutate: logoutCurrentDevice } = useLogoutCurrentDevice();

    const user = useSelector((state: any) => state.auth.user);
    const navActive = useSelector((state: any) => state.auth.activeNav);
    const cart = useSelector((state: any) => state.cart.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        try {
            dispatch(logout());
            dispatch(clearCart());
            persistor.purge();
            toast.success("Logout successfully", {
                duration: 1000
            });
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            const err = error as Error;
            toast.error(err.message, {
                duration: 1000
            });
        }
    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

    return (
        <nav className="sticky top-0 z-[999] w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-15">
                    <div className="flex justify-between gap-25 items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="flex items-center transition-opacity duration-300 group-hover:opacity-70">
                                <h1 className="text-sm md:text-base tracking-[0.2em] font-light text-black uppercase">Vastra</h1>
                                <h1 className="text-sm md:text-base tracking-[0.2em] font-bold text-black uppercase">Verse</h1>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-5">
                            <ul className="flex items-center gap-6 text-sm text-gray-500 tracking-wider">
                                <li className="relative">
                                    <Link to="/" onClick={() => dispatch(setNavActive("home"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-2 px-1 flex items-center text-xs uppercase tracking-[0.1em] font-medium ${navActive === "home" ? "text-black" : "text-gray-400 hover:text-black"}`}>
                                        <span className="relative z-10">Home</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-left ${navActive === "home" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to="men" onClick={() => dispatch(setNavActive("men"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-2 px-1 flex items-center text-xs uppercase tracking-[0.1em] font-medium ${navActive === "men" ? "text-black" : "text-gray-400 hover:text-black"}`}>
                                        <span className="relative z-10">Men</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-left ${navActive === "men" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to="women" onClick={() => dispatch(setNavActive("women"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-2 px-1 flex items-center text-xs uppercase tracking-[0.1em] font-medium ${navActive === "women" ? "text-black" : "text-gray-400 hover:text-black"}`}>
                                        <span className="relative z-10">Women</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-left ${navActive === "women" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to="kids" onClick={() => dispatch(setNavActive("kids"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-2 px-1 flex items-center text-xs uppercase tracking-[0.1em] font-medium ${navActive === "kids" ? "text-black" : "text-gray-400 hover:text-black"}`}>
                                        <span className="relative z-10">Kids</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-left ${navActive === "kids" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to="blogs" onClick={() => dispatch(setNavActive("blogs"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-2 px-1 flex items-center text-xs uppercase tracking-[0.1em] font-medium ${navActive === "blogs" ? "text-black" : "text-gray-400 hover:text-black"}`}>
                                        <span className="relative z-10">Blogs</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transition-transform duration-300 origin-left ${navActive === "blogs" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">

                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer">
                                <CiShoppingCart size={24} className="cursor-pointer" />
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                                    {cart?.length || 0}
                                </span>
                            </Link>

                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer">
                                <FaRegHeart size={20} className="cursor-pointer" />
                            </Link>
                        </div>

                        {user ? (
                            <>
                                <div className="flex items-center gap-4 md:gap-7 ml-1 sm:ml-2">
                                    <Link to="/notification" className="relative hidden sm:block text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer">
                                        <FaRegBell size={20} className="cursor-pointer" />
                                        {(allnotification?.notifications?.filter((notifi: any) => notifi?.isRead == false)?.length ?? 0) > 0 && <span className="absolute -top-1 -right-1 bg-black min-w-2 h-2 rounded-full border border-white"></span>}
                                    </Link>

                                    <div className="relative hidden md:block">
                                        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center justify-center transition-opacity duration-300 hover:opacity-70 cursor-pointer">
                                            <div className="h-8 w-8 rounded-full bg-black text-white flex justify-center items-center">
                                                <p className="text-xs font-medium tracking-widest">{user.name[0]}</p>
                                            </div>
                                        </button>
                                    </div>
                                    {isUserDropdownOpen &&
                                        <div className="absolute right-5 top-15 w-60 bg-white luxury-border shadow-2xl hidden md:block overflow-hidden z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="flex flex-col p-6 justify-center items-center gap-2 border-b border-gray-100">
                                                <div className="h-12 w-12 rounded-full bg-black text-white flex justify-center items-center">
                                                    <p className="text-xl font-light uppercase">{user.name[0]}</p>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 tracking-tight">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate w-full text-center">{user.email}</p>
                                            </div>
                                            <ul className="px-2 py-3 space-y-1">
                                                <Link to="profile" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">Profile</li>
                                                </Link>
                                                <Link to="wallet" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">My Wallet</li>
                                                </Link>
                                                <Link to="order-list" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">My Orders</li>
                                                </Link>
                                                <Link to="my-reviews" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">My Reviews</li>
                                                </Link>
                                                <div className="h-px bg-gray-100 my-2 mx-2"></div>
                                                <Link to="save-for-later" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">
                                                        <span>Save for Later</span>
                                                        <Bookmark size={16} className="text-gray-400" />
                                                    </li>
                                                </Link>
                                                <Link to="security" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">
                                                        <span>Security</span>
                                                        <Shield size={16} className="text-gray-400" />
                                                    </li>
                                                </Link>
                                                <Link to="help-center" onClick={() => setIsUserDropdownOpen(false)}>
                                                    <li className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors duration-200">
                                                        <span>Help Center</span>
                                                        <MdOutlineHeadsetMic size={16} className="text-gray-400" />
                                                    </li>
                                                </Link>
                                                <div className="h-px bg-gray-100 my-2 mx-2"></div>
                                                <li onClick={() => { logoutHandler(); logoutCurrentDevice(); setIsUserDropdownOpen(false); }} className="block px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 cursor-pointer">
                                                    Logout
                                                </li>
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-4 ml-4">
                                <Link to="/login">
                                    <button className="text-black text-xs font-medium uppercase tracking-[0.1em] px-2 py-2 hover:text-gray-500 transition-colors cursor-pointer">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="btn-luxury text-[10px] px-6 py-2.5">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}

                        <div className="flex md:hidden items-center ml-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 text-black hover:opacity-70 transition-opacity duration-300 cursor-pointer"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`md:hidden absolute w-full transition-all duration-300 ease-in-out border-b border-gray-100 shadow-xl z-50 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto bg-white' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="px-4 pt-4 pb-6 space-y-1 overflow-y-auto max-h-[85vh]">
                    <div className="space-y-1 mb-4 border-t border-gray-100">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-black hover:text-gray-500 font-medium uppercase tracking-[0.1em] text-xs py-4 px-4 transition-colors border-b border-gray-100"
                        >
                            Home
                        </Link>
                        <Link
                            to="men"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-black hover:text-gray-500 font-medium uppercase tracking-[0.1em] text-xs py-4 px-4 transition-colors border-b border-gray-100"
                        >
                            Men
                        </Link>
                        <Link
                            to="women"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-black hover:text-gray-500 font-medium uppercase tracking-[0.1em] text-xs py-4 px-4 transition-colors border-b border-gray-100"
                        >
                            Women
                        </Link>
                        <Link
                            to="kids"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-black hover:text-gray-500 font-medium uppercase tracking-[0.1em] text-xs py-4 px-4 transition-colors border-b border-gray-100"
                        >
                            Kids
                        </Link>
                        <Link
                            to="blogs"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-black hover:text-gray-500 font-medium uppercase tracking-[0.1em] text-xs py-4 px-4 transition-colors border-b border-gray-100"
                        >
                            Blogs
                        </Link>
                    </div>

                    {user ? (
                        <>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                                <div className="space-y-1">
                                    <Link to="profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        Profile
                                    </Link>
                                    <Link to="wallet" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        My Wallet
                                    </Link>
                                    <Link to="order-list" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        My Orders
                                    </Link>
                                    <Link to="my-reviews" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        My Reviews
                                    </Link>
                                    <Link to="notification" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        <span>Notifications</span>
                                        <FaRegBell size={16} className="text-gray-400" />
                                    </Link>
                                    <Link to="save-for-later" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        <span>Save for Later</span>
                                        <Bookmark size={16} className="text-gray-400" />
                                    </Link>
                                    <Link to="security" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        <span>Security</span>
                                        <Shield size={16} className="text-gray-400" />
                                    </Link>
                                    <Link to="help-center" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                        <span>Help Center</span>
                                        <MdOutlineHeadsetMic size={16} className="text-gray-400" />
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-6 pb-2">
                                <button onClick={() => { logoutHandler(); logoutCurrentDevice(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3.5 font-bold uppercase tracking-wider text-xs transition-all duration-300 cursor-pointer">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2 px-4">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                <button className="w-full text-black bg-white border border-black py-3.5 font-medium uppercase tracking-[0.1em] text-xs hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                <button className="btn-luxury w-full py-3.5 font-medium uppercase tracking-[0.1em] text-xs cursor-pointer">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
