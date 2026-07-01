import ReactGA from "react-ga4";
import { FaWhatsapp } from "react-icons/fa";
import { useGetCurrentUser, useSubscribeMail } from "../Hooks/user";

export const Footer = () => {

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
    }

    return (
        <footer className="relative bg-zinc-950 border-t border-white/5 pt-20 pb-8 px-6 lg:px-12 overflow-hidden text-gray-300">

            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    <div className="lg:col-span-4 flex flex-col space-y-6">
                        <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            VASTRA VERSE
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
                            The premium streetwear destination for high-quality cotton oversized T-Shirts, delivered directly to your doorstep.
                        </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div className="flex flex-col space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-2">Products</h3>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Men's Collection</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Women's Collection</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Accessories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Sale Specials</a></li>
                            </ul>
                        </div>

                        <div className="flex flex-col space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-2">Company</h3>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Press & Media</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Stay Connected</h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            Subscribe to get special offers, free giveaways, and collection drop announcements.
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const email = formData.get("email") as string;
                                if (email) {
                                    subscribeMail(email);
                                }
                                (e.target as HTMLFormElement).reset();
                            }}
                            className="flex flex-col sm:flex-row gap-3 w-full"
                        >
                            <input
                                type="email"
                                name="email"
                                defaultValue={userData?.email}
                                placeholder="Your email address"
                                className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all w-full backdrop-blur-sm"
                                required
                            />
                            <button type="submit" className="bg-white hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Join
                            </button>
                        </form>

                        <div className="pt-6 w-full flex flex-col space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Follow The Brand</h4>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/jatin_jethava_3125/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 hover:border-transparent transform hover:scale-110 transition-all duration-300" aria-label="Instagram">
                                    <i className="fab fa-instagram text-base"></i>
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-600 hover:border-transparent transform hover:scale-110 transition-all duration-300" aria-label="Facebook">
                                    <i className="fab fa-facebook-f text-base"></i>
                                </a>
                                <a href="https://x.com/jethava36641" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-black hover:border-transparent transform hover:scale-110 transition-all duration-300" aria-label="X (Twitter)">
                                    <i className="fab fa-twitter text-base"></i>
                                </a>
                                <a href="https://www.linkedin.com/in/jatin-jethava-7096a42b3/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-500 hover:border-transparent transform hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin-in text-base"></i>
                                </a>
                                <button
                                    onClick={shareProduct}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#25D366] hover:border-transparent transform hover:scale-110 transition-all duration-300"
                                    aria-label="Share on WhatsApp"
                                >
                                    <FaWhatsapp className="text-base" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
                        © {new Date().getFullYear()} VASTRA VERSE. All rights reserved. Crafted with ❤️ by <strong className="text-gray-300 font-semibold hover:text-white transition-colors cursor-pointer">Jatin Jethava</strong>
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs md:text-sm">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}