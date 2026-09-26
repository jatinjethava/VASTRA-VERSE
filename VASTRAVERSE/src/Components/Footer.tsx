import ReactGA from "react-ga4";
import { FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useGetCurrentUser, useSubscribeMail } from "../Hooks/user";
import { isAuthenticated } from "../Utils/auth";
import { ArrowRight, Globe, Shield, RefreshCw, Clock } from "lucide-react";

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
        <div className="w-full">
            <section className="bg-[#050505] mb-20 text-white py-8 border-b border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-4 md:divide-x divide-white/10">
                        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:px-4">
                            <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" strokeWidth={1.2} />
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Global Shipping</span>
                                <span className="block text-[9px] font-light text-neutral-500 uppercase tracking-widest">Standard & Express</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:px-4">
                            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" strokeWidth={1.2} />
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Secure Checkout</span>
                                <span className="block text-[9px] font-light text-neutral-500 uppercase tracking-widest">256-bit Encryption</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:px-4">
                            <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" strokeWidth={1.2} />
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Easy Returns</span>
                                <span className="block text-[9px] font-light text-neutral-500 uppercase tracking-widest">30-Day Policy</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:px-4">
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" strokeWidth={1.2} />
                            <div>
                                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-1">24/7 Atelier Support</span>
                                <span className="block text-[9px] font-light text-neutral-500 uppercase tracking-widest">Client Services</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer
                style={{
                    background: "#ffffff",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                }}
                className="text-neutral-600 relative overflow-hidden"
            >
                <div
                    className="pointer-events-none absolute top-0 left-0 w-96 h-96 opacity-[0.03]"
                    style={{ background: "radial-gradient(ellipse at top left, rgba(0,0,0,0.2) 0%, transparent 70%)" }}
                />
                <div
                    className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 opacity-[0.02]"
                    style={{ background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.2) 0%, transparent 70%)" }}
                />

                <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[9px] uppercase tracking-[0.28em] font-medium text-neutral-500 text-center sm:text-left leading-relaxed">
                            Global Standard Shipping &nbsp;·&nbsp; Atelier Client Services
                        </p>
                        <button
                            onClick={shareProduct}
                            className="group flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-neutral-500 hover:text-black transition-colors duration-300 cursor-pointer"
                        >
                            <FaWhatsapp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                            Share The Archives
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-2 flex items-center gap-4 sm:gap-6">
                    <div
                        className="flex-1 h-px"
                        style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)" }}
                    />
                    <Link to="/" className="flex-shrink-0 text-center">
                        <span className="editorial-text text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] sm:tracking-[0.38em] text-neutral-900 hover:text-neutral-600 transition-colors duration-500">
                            VASTRA<span className="mx-1 sm:mx-2 text-neutral-900/30">·</span>VERSE
                        </span>
                    </Link>
                    <div
                        className="flex-1 h-px"
                        style={{ background: "linear-gradient(to left, transparent, rgba(0,0,0,0.1), transparent)" }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                        <div className="lg:col-span-4 flex flex-col gap-7 items-center sm:items-start text-center sm:text-left">
                            <p className="text-xs leading-relaxed max-w-xs md:max-w-sm font-light tracking-wide text-neutral-600">
                                The definitive destination for premium oversized silhouettes and editorial streetwear.
                                Crafted for those who curate their existence.
                            </p>

                            <div className="flex items-center gap-3 pt-2 justify-center sm:justify-start">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="flex items-center justify-center w-10 h-10 transition-all duration-300 text-neutral-600"
                                        style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.border = "1px solid rgba(0,0,0,0.9)";
                                            el.style.color = "#000000";
                                            el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.border = "1px solid rgba(0,0,0,0.1)";
                                            el.style.color = "";
                                            el.style.boxShadow = "none";
                                        }}
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>

                            <div
                                className="flex items-center gap-2 mt-1 px-4 py-3 w-fit mx-auto sm:mx-0"
                                style={{
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    background: "rgba(0,0,0,0.02)",
                                }}
                            >
                                <span className="text-[8px] uppercase tracking-[0.32em] font-medium text-neutral-600">
                                    Est. 2024 &nbsp;·&nbsp; Luxury Editorial
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12">

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 w-full">
                                    <span className="w-3 h-px bg-black/30" />
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.28em] text-neutral-900">
                                        Shop
                                    </h3>
                                </div>
                                <ul className="space-y-4 w-full flex flex-col items-center sm:items-start">
                                    {shopLinks.map((link) => (
                                        <li key={link.to} className="w-full sm:w-auto">
                                            <Link
                                                to={link.to}
                                                className="group relative flex justify-center sm:justify-start items-center w-full text-center sm:text-left bg-transparent border-none p-0 outline-none whitespace-nowrap text-[10px] uppercase tracking-widest font-medium text-neutral-500 hover:text-black transition-colors duration-300"
                                            >
                                                <span className="absolute left-0 hidden sm:block h-[1px] w-3 bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                                <span className="transform translate-x-0 sm:group-hover:translate-x-5 transition-transform duration-300 ease-out">
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 w-full">
                                    <span className="w-3 h-px bg-black/30" />
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.28em] text-neutral-900">
                                        Account
                                    </h3>
                                </div>
                                <ul className="space-y-4 w-full flex flex-col items-center sm:items-start">
                                    {accountLinks.map((link) => (
                                        <li key={link.to} className="w-full sm:w-auto">
                                            <button
                                                onClick={() => handleAuthLink(link.to)}
                                                className="group relative flex justify-center sm:justify-start items-center w-full text-center sm:text-left bg-transparent border-none p-0 outline-none whitespace-nowrap text-[10px] uppercase tracking-widest font-medium cursor-pointer text-neutral-500 hover:text-black transition-colors duration-300"
                                            >
                                                <span className="absolute left-0 hidden sm:block h-[1px] w-3 bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                                <span className="transform translate-x-0 sm:group-hover:translate-x-5 transition-transform duration-300 ease-out">
                                                    {link.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 w-full">
                                    <span className="w-3 h-px bg-black/30" />
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.28em] text-neutral-900">
                                        Support
                                    </h3>
                                </div>
                                <ul className="space-y-4 w-full flex flex-col items-center sm:items-start">
                                    {supportLinks.map((link) => (
                                        <li key={link.to} className="w-full sm:w-auto">
                                            <button
                                                onClick={() => handleAuthLink(link.to)}
                                                className="group relative flex justify-center sm:justify-start items-center w-full text-center sm:text-left bg-transparent border-none p-0 outline-none whitespace-nowrap text-[10px] uppercase tracking-widest font-medium cursor-pointer text-neutral-500 hover:text-black transition-colors duration-300"
                                            >
                                                <span className="absolute left-0 hidden sm:block h-[1px] w-3 bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                                <span className="transform translate-x-0 sm:group-hover:translate-x-5 transition-transform duration-300 ease-out">
                                                    {link.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-col gap-6 items-center sm:items-start text-center sm:text-left mt-6 lg:mt-0">
                            <div>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 w-full">
                                    <span className="w-3 h-px bg-black/30" />
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.28em] text-neutral-900">
                                        Atelier Dispatches
                                    </h3>
                                </div>
                                <p className="text-[11px] leading-relaxed font-light tracking-wide text-neutral-600 max-w-xs sm:max-w-full mx-auto sm:mx-0">
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
                                className="flex flex-col gap-4 pt-2 w-full max-w-xs sm:max-w-full mx-auto sm:mx-0"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={userData?.email}
                                    placeholder="CLIENT EMAIL"
                                    className="w-full bg-transparent px-0 py-3 text-[10px] text-center sm:text-left text-neutral-900 placeholder-neutral-400 focus:outline-none font-mono tracking-widest transition-colors duration-300"
                                    style={{
                                        borderBottom: "1px solid rgba(0,0,0,0.15)",
                                        caretColor: "#000000",
                                    }}
                                    onFocus={e => ((e.currentTarget as HTMLElement).style.borderBottom = "1px solid rgba(0,0,0,0.8)")}
                                    onBlur={e => ((e.currentTarget as HTMLElement).style.borderBottom = "1px solid rgba(0,0,0,0.15)")}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="group w-full flex items-center justify-center sm:justify-between px-5 py-3 transition-all duration-500 cursor-pointer mt-2"
                                    style={{
                                        background: "#0a0a0a",
                                        color: "#ffffff",
                                        border: "1px solid #0a0a0a",
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "transparent";
                                        el.style.color = "#0a0a0a";
                                        el.style.boxShadow = "none";
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "#0a0a0a";
                                        el.style.color = "#ffffff";
                                        el.style.boxShadow = "none";
                                    }}
                                >
                                    <span className="text-[9px] uppercase tracking-[0.22em] font-bold">Subscribe</span>
                                    <ArrowRight size={14} className="hidden sm:block group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-5">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 text-center sm:text-left">
                            © {new Date().getFullYear()} Vastra Verse &nbsp;·&nbsp; All Rights Reserved
                        </p>
                        <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-[9px] uppercase tracking-widest font-bold">
                            {(["Privacy", "Terms", "Refunds"] as const).map((label) => (
                                <Link
                                    key={label}
                                    to="/help-center"
                                    className="text-neutral-500 hover:text-black transition-colors duration-300"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pb-5 text-center">
                    <p className="text-[8px] uppercase tracking-[0.42em] font-medium text-neutral-400">
                        Crafted with precision &nbsp;·&nbsp; Premium Streetwear Atelier
                    </p>
                </div>
            </footer>
        </div>
    );
};