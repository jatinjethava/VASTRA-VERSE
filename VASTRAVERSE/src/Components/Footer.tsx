import ReactGA from "react-ga4";
import { FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useGetCurrentUser, useSubscribeMail } from "../Hooks/user";
import { isAuthenticated } from "../Utils/auth";

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
        <footer className="bg-[#0f0f0f] border-t border-white/[0.06] text-gray-400">

            <div className="border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500">
                        Free shipping on orders above ₹999 &nbsp;·&nbsp; Cash on Delivery available
                    </p>
                    <button
                        onClick={shareProduct}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        Share Vastra Verse
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div>
                            <Link to="/" className="inline-block">
                                <h2 className="text-xl font-black uppercase tracking-[0.25em] text-white">
                                    VASTRA VERSE
                                </h2>
                            </Link>
                            <div className="w-8 h-[2px] bg-white mt-3" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                            The premium streetwear destination for high-quality cotton oversized T‑Shirts — crafted for those who wear their identity.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-9 h-9 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/40 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10">

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">Shop</h3>
                            <ul className="space-y-3.5">
                                {shopLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">Account</h3>
                            <ul className="space-y-3.5">
                                {accountLinks.map((link) => (
                                    <li key={link.to}>
                                        <button
                                            onClick={() => handleAuthLink(link.to)}
                                            className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 font-medium cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">Support</h3>
                            <ul className="space-y-3.5">
                                {supportLinks.map((link) => (
                                    <li key={link.to}>
                                        <button
                                            onClick={() => handleAuthLink(link.to)}
                                            className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 font-medium cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-5">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-1">Newsletter</h3>
                            <div className="w-8 h-[2px] bg-white/20 mb-4" />
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Drop alerts, exclusive offers &amp; new collection announcements — straight to your inbox.
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
                            className="flex flex-col gap-2"
                        >
                            <input
                                type="email"
                                name="email"
                                defaultValue={userData?.email}
                                placeholder="your@email.com"
                                className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all duration-200 font-medium"
                                style={{ borderRadius: 0 }}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-white hover:bg-gray-100 text-black font-black text-[10px] uppercase tracking-[0.2em] py-3 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                                style={{ borderRadius: 0 }}
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-gray-600 text-center sm:text-left">
                        © {new Date().getFullYear()} VASTRA VERSE · All rights reserved · Made with ❤️ by{" "}
                        <a
                            href="https://www.linkedin.com/in/jatin-jethava-7096a42b3/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors font-semibold"
                        >
                            Jatin Jethava
                        </a>
                    </p>
                    <div className="flex gap-6 text-[11px] text-gray-600">
                        <Link to="/help-center" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                        <Link to="/help-center" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
                        <Link to="/help-center" className="hover:text-white transition-colors duration-200">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};