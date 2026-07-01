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
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-24">

                    <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-6">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-[0.2em]">VASTRA VERSE</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            The premium streetwear destination for high-quality cotton oversized T-Shirts, delivered directly to your doorstep.
                        </p>
                    </div>

                    <div className="lg:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100 mb-6">Products</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Men's Collection</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Women's Collection</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Accessories</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Sale Specials</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100 mb-6">Company</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Press & Media</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-6 w-full">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Stay Connected</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
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
                            className="flex flex-col sm:flex-row gap-3 w-full max-w-md sm:max-w-none"
                        >
                            <input
                                type="email"
                                name="email"
                                defaultValue={userData?.email}
                                placeholder="Your email address"
                                className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors w-full"
                                required
                            />
                            <button type="submit" className="bg-white hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg transition-colors cursor-pointer shrink-0">
                                Join
                            </button>
                        </form>

                        <div className="pt-6 w-full flex flex-col items-center sm:items-start">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Follow The Brand</h4>
                            <div className="flex justify-center sm:justify-start gap-4">
                                <ul className="flex flex-wrap items-center justify-center sm:justify-start gap-5">
                                    <li>
                                        <a href="https://www.instagram.com/jatin_jethava_3125/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 hover:scale-110 transform transition-all duration-300 inline-block" aria-label="Instagram">
                                            <i className="fab fa-instagram text-lg"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 hover:scale-110 transform transition-all duration-300 inline-block" aria-label="Facebook">
                                            <i className="fab fa-facebook-f text-lg"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://x.com/jethava36641" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 hover:scale-110 transform transition-all duration-300 inline-block" aria-label="X (Twitter)">
                                            <i className="fab fa-twitter text-lg"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/in/jatin-jethava-7096a42b3/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 hover:scale-110 transform transition-all duration-300 inline-block" aria-label="YouTube">
                                            <i className="fab fa-linkedin-in text-lg"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={shareProduct}
                                            className="text-gray-400 hover:text-[#25D366] hover:scale-110 transform transition-all duration-300 inline-block"
                                            aria-label="Share on WhatsApp"
                                        >
                                            <FaWhatsapp className="text-lg" />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4">
                    <p className="text-gray-500 text-xs sm:text-sm text-center lg:text-left">
                        © {new Date().getFullYear()} VASTRA VERSE. All rights reserved. Crafted with ❤️ by <strong className="text-gray-300">Jatin Jethava</strong>
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-xs sm:text-sm">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}