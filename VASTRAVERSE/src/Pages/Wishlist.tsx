import { useGetWishlistProducts } from "../Hooks/wishList"
import { Card } from "../Components/card";
import { Link } from "react-router-dom";

export const Wishlist = () => {

    const { data } = useGetWishlistProducts();

    return (
        <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 space-y-3">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block">
                        Private Selection & Archives
                    </span>
                    <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
                        Curated <span className="italic font-serif font-normal">Favorites</span>
                    </h1>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto">
                        Your personalized collection of atelier garments and luxury streetwear silhouettes reserved for future wardrobe curation.
                    </p>
                    <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-4"></div>
                </div>

                {data?.data?.finalProduct && data.data.finalProduct.length > 0 ? (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-20'>
                        {data.data.finalProduct.map((item: any) => (
                            <Card key={item._id} product={item} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl p-8 sm:p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-20 relative overflow-hidden">
                        
                        {/* Top specular hairline */}
                        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-5">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h3 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 mb-2 tracking-tight">
                            Your curation is empty
                        </h3>
                        <p className="text-neutral-400 text-xs sm:text-sm font-light mb-8 max-w-md">
                            You have not saved any editorial pieces to your favorites yet. Explore the contemporary ateliers to discover signature silhouettes.
                        </p>
                        <Link to="/men">
                            <button className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full font-medium uppercase tracking-[0.15em] text-xs transition-all shadow-lg shadow-black/10 hover:scale-105 cursor-pointer">
                                Explore Collections
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}