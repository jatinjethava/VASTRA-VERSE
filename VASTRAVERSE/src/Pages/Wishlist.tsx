import { useGetWishlistProducts } from "../Hooks/wishList"
import { Card } from "../Components/card";
import { Link } from "react-router-dom";

export const Wishlist = () => {

    const { data } = useGetWishlistProducts();

    return (
        <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Selection</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-500 tracking-tight">
                        YOUR <span className="text-gray-800">FAVORITES</span>
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base font-medium leading-relaxed px-4">
                        Discover your personalized collection of favorite products, carefully curated to match your style and preferences.
                    </p>
                    <div className="w-12 sm:w-16 h-1 bg-gray-900 mx-auto rounded-full mt-4 sm:mt-6"></div>
                </div>

                {data?.data?.finalProduct && data.data.finalProduct.length > 0 ? (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10 md:gap-10 lg:gap-12 mb-20'>
                        {data.data.finalProduct.map((item: any) => (
                            <Card key={item._id} product={item} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] p-8 sm:p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-20">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">Your wishlist is empty</h3>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 px-4">
                            Looks like you haven't added anything to your favorites yet. Start exploring to find premium streetwear you love!
                        </p>
                        <Link to="/men">
                            <button className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-gray-800 transition-all shadow-md shadow-gray-900/10 cursor-pointer">
                                Start Exploring
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}