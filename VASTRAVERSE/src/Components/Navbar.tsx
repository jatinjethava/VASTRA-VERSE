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
    const [isMenDropDown, setIsMenDropDown] = useState<boolean>(false);
    const [isWomenDropDown, setIsWomenDropDown] = useState<boolean>(false);
    const [isKidsDropDown, setIsKidsDropDown] = useState<boolean>(false);

    return (
        <nav className="sticky top-0 z-[999] w-full bg-white backdrop-blur-md transition-all duration-300">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-15">
                    <div className="flex justify-between gap-25 items-center">
                        <Link to="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
                            <div className="logo flex items-center gap-1 p-1 bg-gray-50/50 backdrop-blur-sm  border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200">
                                <h1 className="text-[10px] sm:text-[12px] md:text-sm tracking-wider font-bold px-2.5 py-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-sm">VASTRA</h1>
                                <h1 className="text-[10px] sm:text-[12px] md:text-sm tracking-wider font-extrabold pr-2 pl-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-500">VERSE</h1>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-5">
                            <ul className="flex items-center gap-3 text-sm text-gray-500 tracking-wider">
                                <li
                                    className="relative"
                                >
                                    <Link to="/" onClick={() => dispatch(setNavActive("home"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-1.5 px-3 rounded-md flex items-center gap-1.5 font-medium ${navActive === "home" ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900"}`}>
                                        <span className="relative z-10">Home</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                    </Link>
                                </li>

                                <li
                                    className="relative"
                                    onMouseEnter={() => setIsMenDropDown(true)}
                                    onMouseLeave={() => setIsMenDropDown(false)}
                                >
                                    <Link to="men" onClick={() => dispatch(setNavActive("men"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-1.5 px-3 rounded-md flex items-center gap-1.5 font-medium ${navActive === "men" ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900"}`}>
                                        <span className="relative z-10">Men</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                        {/* <svg className={`w-3 h-3 transition-transform duration-300 ${isMenDropDown ? "rotate-180 text-gray-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg> */}
                                    </Link>

                                    {/* <div className="absolute left-0 w-full h-2 top-full" />

                                    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-gray-900 rounded-xl p-1.5 z-50 transition-all duration-300 origin-top ${isMenDropDown
                                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                        : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
                                        }`}>

                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-gray-100 rotate-45" />

                                        <div className="relative flex flex-col gap-0.5">
                                            <Link to="/men" onClick={() => { dispatch(setNavActive("men")); setIsMenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👔</span>
                                                Men
                                            </Link>
                                            <Link to="/women" onClick={() => { dispatch(setNavActive("women")); setIsMenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👗</span>
                                                Women
                                            </Link>
                                            <Link to="/kids" onClick={() => { dispatch(setNavActive("kids")); setIsMenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">🧒</span>
                                                Kids
                                            </Link>
                                        </div>
                                    </div> */}
                                </li>
                                <li
                                    className="relative"
                                    onMouseEnter={() => setIsWomenDropDown(true)}
                                    onMouseLeave={() => setIsWomenDropDown(false)}
                                >
                                    <Link to="women" onClick={() => dispatch(setNavActive("women"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-1.5 px-3 rounded-md flex items-center gap-1.5 font-medium ${navActive === "women" ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900"}`}>
                                        <span className="relative z-10">Women</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                        {/* <svg className={`w-3 h-3 transition-transform duration-300 ${isWomenDropDown ? "rotate-180 text-gray-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg> */}
                                    </Link>

                                    {/* <div className="absolute left-0 w-full h-2 top-full" />

                                    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-gray-900 rounded-xl p-1.5 z-50 transition-all duration-300 origin-top ${isWomenDropDown
                                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                        : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
                                        }`}>

                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-gray-100 rotate-45" />

                                        <div className="relative flex flex-col gap-0.5">
                                            <Link to="/men" onClick={() => { dispatch(setNavActive("men")); setIsWomenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👔</span>
                                                Men
                                            </Link>
                                            <Link to="/women" onClick={() => { dispatch(setNavActive("women")); setIsWomenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👗</span>
                                                Women
                                            </Link>
                                            <Link to="/kids" onClick={() => { dispatch(setNavActive("kids")); setIsWomenDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">🧒</span>
                                                Kids
                                            </Link>
                                        </div>
                                    </div> */}
                                </li>
                                <li
                                    className="relative"
                                    onMouseEnter={() => setIsKidsDropDown(true)}
                                    onMouseLeave={() => setIsKidsDropDown(false)}
                                >
                                    <Link to="kids" onClick={() => dispatch(setNavActive("kids"))}
                                        className={`relative overflow-hidden group transition-all duration-300 py-1.5 px-3 rounded-md flex items-center gap-1.5 font-medium ${navActive === "kids" ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900"}`}>
                                        <span className="relative z-10">Kids</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                        {/* <svg className={`w-3 h-3 transition-transform duration-300 ${isKidsDropDown ? "rotate-180 text-gray-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg> */}
                                    </Link>

                                    {/* <div className="absolute left-0 w-full h-2 top-full" />

                                    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-gray-900 rounded-xl p-1.5 z-50 transition-all duration-300 origin-top ${isKidsDropDown
                                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                        : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
                                        }`}>

                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-gray-100 rotate-45" />

                                        <div className="relative flex flex-col gap-0.5">
                                            <Link to="/men" onClick={() => { dispatch(setNavActive("men")); setIsKidsDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👔</span>
                                                Men
                                            </Link>
                                            <Link to="/women" onClick={() => { dispatch(setNavActive("women")); setIsKidsDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">👗</span>
                                                Women
                                            </Link>
                                            <Link to="/kids" onClick={() => { dispatch(setNavActive("kids")); setIsKidsDropDown(false); }}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                                <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs">🧒</span>
                                                Kids
                                            </Link>
                                        </div>
                                    </div> */}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">

                        <div className="flex items-center gap-3 sm:gap-5">
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer">
                                <CiShoppingCart size={26} className="cursor-pointer hover:scale-105" />
                                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    {cart?.length || 0}
                                </span>
                            </Link>

                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer">
                                <FaRegHeart size={20} className="cursor-pointer hover:scale-105" />
                            </Link>
                        </div>

                        {user ? (
                            <>
                                <div className="flex items-center gap-4 md:gap-7 ml-1 sm:ml-2">
                                    <Link to="/notification" className="relative hidden sm:block text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer">
                                        <FaRegBell size={20} className="cursor-pointer hover:scale-105" />
                                        {allnotification?.notifications?.filter((notifi: any) => notifi?.isRead == false).length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 font-bold min-w-3 h-3 rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm animate-pulse"></span>}
                                    </Link>

                                    <div className="relative hidden md:block">
                                        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center justify-center gap-3 rounded-lg text-gray-700 text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer">
                                            <div className="border border-gray-300 hover:border-gray-500 transition-colors rounded-full p-0.5">
                                                <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex justify-center items-center">
                                                    <p className="text-lg font-semibold">{user.name[0]}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    {isUserDropdownOpen &&
                                        <div className="absolute right-5 top-15 w-60 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] hidden md:block overflow-hidden z-[1000] animate-in fade-in slide-in-from-top-4 duration-200">
                                            <div className="flex flex-col p-5 justify-center items-center gap-1 bg-gray-50/50 border-b border-gray-100">
                                                <div className="border border-gray-300 rounded-full p-0.5 mb-1">
                                                    <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex justify-center items-center">
                                                        <p className="text-xl font-semibold uppercase">{user.name[0]}</p>
                                                    </div>
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
                            <div className="hidden md:flex items-center gap-3 ml-2">
                                <Link to="/login">
                                    <button className="text-gray-700 hover:text-gray-900 text-sm font-bold tracking-wide px-4 py-2 transition-all duration-300 cursor-pointer">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold tracking-wide px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}

                        <div className="flex md:hidden items-center ml-1 sm:ml-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
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
                    <div className="space-y-1 mb-4">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold text-sm py-3 px-4 rounded-xl transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="men"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold text-sm py-3 px-4 rounded-xl transition-colors"
                        >
                            Men
                        </Link>
                        <Link
                            to="women"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold text-sm py-3 px-4 rounded-xl transition-colors"
                        >
                            Women
                        </Link>
                        <Link
                            to="kids"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold text-sm py-3 px-4 rounded-xl transition-colors"
                        >
                            Kids
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
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                <button className="w-full text-gray-900 bg-gray-100 border border-transparent rounded-xl py-3.5 font-bold uppercase tracking-wider text-xs hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                <button className="w-full bg-gray-900 text-white rounded-xl py-3.5 font-bold uppercase tracking-wider text-xs hover:bg-gray-800 transition-all duration-300 cursor-pointer shadow-md">
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
