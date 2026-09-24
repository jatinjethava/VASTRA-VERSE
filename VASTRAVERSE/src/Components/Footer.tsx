import ReactGA from "react-ga4";
import { FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useGetCurrentUser, useSubscribeMail } from "../Hooks/user";
import { isAuthenticated } from "../Utils/auth";
import { ArrowRight } from "lucide-react";

export const Footer = () => {

    const navigate = useNavigate();
    const { data: user } = useGetCurrentUser();
    const { mutate: subscribeMail } = useSubscribeMail();
    const userData = (user?.data as any)?.user;

    const shareProduct = () => {
        try {
            ReactGA.event({
                category: "Share Website",
                action: "Share Website",
                label: "footer",
            });
            navigator.share({
                title: "VASTRA VERSE",
                text: "Welcome to VASTRA VERSE",
                url: window.location.href,
            });
        } catch (error) {
            console.error("Error sharing website:", error);
        }
    };

    const handleAuthLink = (to: string) => {
        if (!isAuthenticated()) {
            navigate("/login");
        } else {
            navigate(to);
        }
    };

    const shopLinks = [
        { label: "Men's Collection", to: "/men" },
        { label: "Women's Collection", to: "/women" },
        { label: "Kids' Collection", to: "/kids" },
        { label: "Blogs", to: "/blogs" },
    ];

    const accountLinks = [
        { label: "My Profile", to: "/profile" },
        { label: "My Orders", to: "/order-list" },
        { label: "Wishlist", to: "/wishlist" },
        { label: "My Reviews", to: "/my-reviews" },
        { label: "Wallet", to: "/wallet" },
    ];

    const supportLinks = [
        { label: "Help Center", to: "/help-center" },
        { label: "Security", to: "/security" },
        { label: "Cart", to: "/cart" },
        { label: "Notifications", to: "/notification" },
    ];

    const socialLinks = [
        {
            label: "Instagram",
            href: "https://www.instagram.com/jatin_jethava_3125/",
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            label: "X (Twitter)",
            href: "https://x.com/jethava36641",
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/jatin-jethava-7096a42b3/",
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-[#050505] border-t border-neutral-900 text-neutral-400">

            <div className="border-b border-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-medium text-neutral-500">
                        Global Standard Shipping &nbsp;·&nbsp; Atelier Client Services
                    </p>
                    <button
                        onClick={shareProduct}
                        className="group flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                        <FaWhatsapp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                        Share The Archives
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div>
                            <Link to="/" className="inline-block">
                                <h2 className="editorial-text text-2xl font-light tracking-[0.3em] text-white">
                                    VASTRA VERSE
                                </h2>
                            </Link>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-500 max-w-xs font-light tracking-wide">
                            The definitive destination for premium oversized silhouettes and editorial streetwear. Crafted for those who curate their existence.
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="group relative flex items-center justify-center w-10 h-10 border border-neutral-800 rounded-none text-neutral-500 hover:text-white hover:border-white transition-all duration-300"
                                >
                                    <span className="relative z-10">{s.icon}</span>
                                    <div className="absolute inset-0 bg-white scale-0 group-hover:scale-100 transition-transform duration-300 origin-center opacity-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-12">

                        <div>
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">Shop</h3>
                            <ul className="space-y-4">
                                {shopLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="group flex items-center whitespace-nowrap text-[10px] text-neutral-500 hover:text-white transition-colors duration-300 uppercase tracking-widest font-medium"
                                        >
                                            <span className="h-[1px] w-0 bg-white mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">Account</h3>
                            <ul className="space-y-4">
                                {accountLinks.map((link) => (
                                    <li key={link.to}>
                                        <button
                                            onClick={() => handleAuthLink(link.to)}
                                            className="group flex items-center whitespace-nowrap text-[10px] text-neutral-500 hover:text-white transition-colors duration-300 uppercase tracking-widest font-medium cursor-pointer text-left"
                                        >
                                            <span className="h-[1px] w-0 bg-white mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">Support</h3>
                            <ul className="space-y-4">
                                {supportLinks.map((link) => (
                                    <li key={link.to}>
                                        <button
                                            onClick={() => handleAuthLink(link.to)}
                                            className="group flex items-center whitespace-nowrap text-[10px] text-neutral-500 hover:text-white transition-colors duration-300 uppercase tracking-widest font-medium cursor-pointer text-left"
                                        >
                                            <span className="h-[1px] w-0 bg-white mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300" />
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div>
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">Atelier Dispatches</h3>
                            <p className="text-[11px] text-neutral-500 leading-relaxed font-light tracking-wide">
                                Subscribe for private access to exclusive drops, editorial insights, and unreleased archives.
                            </p>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const email = formData.get("email") as string;
                                if (email) subscribeMail(email);
                                (e.target as HTMLFormElement).reset();
                            }}
                            className="flex flex-col gap-4 pt-2"
                        >
                            <input
                                type="email"
                                name="email"
                                defaultValue={userData?.email}
                                placeholder="CLIENT EMAIL"
                                className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors duration-300 font-mono tracking-widest"
                                required
                            />
                            <button
                                type="submit"
                                className="group w-full flex items-center justify-between border border-white bg-white text-black px-5 py-3 transition-all duration-300 hover:bg-black hover:border-neutral-700 hover:text-white cursor-pointer mt-2"
                            >
                                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Subscribe</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest text-center sm:text-left">
                        © {new Date().getFullYear()} VASTRA VERSE · ALL RIGHTS RESERVED
                    </p>
                    <div className="flex gap-8 text-[9px] uppercase tracking-widest font-bold text-neutral-600">
                        <Link to="/help-center" className="hover:text-white transition-colors duration-300">Privacy</Link>
                        <Link to="/help-center" className="hover:text-white transition-colors duration-300">Terms</Link>
                        <Link to="/help-center" className="hover:text-white transition-colors duration-300">Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};