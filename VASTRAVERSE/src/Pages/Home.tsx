import { Card } from '../Components/card';
import '../Pages/CSS/home.css';
import '../index.css'
import { GiClothes, GiLoincloth, GiRolledCloth } from "react-icons/gi";
import { useGetAllProducts, useViewProduct } from '../Hooks/product';
import type { Product } from '../Api/productApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAllreviews } from '../Hooks/review';
import type { Review } from '../Api/reviewApi';
import { ArrowRight, Heart } from 'lucide-react';
import { useGetRecentlyViewed, useRecentlyViewed } from '../Hooks/user';
import { useFlashCampaigns, useMarketingCampaigns } from '../Hooks/marketing';
import { FlashSaleBanner } from '../Components/FlashSaleBanner';
import { HomeSlider } from '../Components/slider/homeSlider';
import { useGetCoupons } from '../Hooks/help';

export const Home = () => {

    const { data, isLoading, isError } = useGetAllProducts();
    const { data: allreviews, isLoading: reviewLoading, isError: reviewError } = useAllreviews();
    const { data: recentlyViewed, isLoading: recentlyViewedLoading } = useGetRecentlyViewed();
    const { mutateAsync: view } = useViewProduct();
    const { mutate: AddRecentlyViewed } = useRecentlyViewed();
    const { data: campaigns } = useMarketingCampaigns();
    const { data: flashCampaigns } = useFlashCampaigns();
    const { data: coupons } = useGetCoupons();

    const navigate = useNavigate();

    const showProduct = async (id: string) => {
        const product = data?.find((p: Product) => p._id === id)
        navigate(`/more-details`, { state: { product: product } })
    }

    const LimitedEditionProduct = data?.filter((p: Product) => p.limitedEdition);

    const fiveStartReview = allreviews?.filter((r: Review) => r.rating === 5).slice(0, 10)

    return (
        <div className="min-h-screen overflow-x-hidden">

            <HomeSlider />

            {
                flashCampaigns && flashCampaigns.length > 0 && (
                    <FlashSaleBanner flashSales={flashCampaigns} />
                )
            }

            {
                campaigns && campaigns.length > 0 && (
                    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
                        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Limited Time Only</span>
                            <h2 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
                                Exclusive <span className="text-gray-500">Offers</span>
                            </h2>
                            <p className="text-sm text-gray-600">
                                Grab these exclusive deals before they are gone. Premium streetwear at unbeatable prices.
                            </p>
                        </div>
                        <div className="flex flex-col gap-12">
                            {campaigns?.map((campaign) => (
                                <div
                                    key={campaign._id}
                                    className="group bg-white overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100/50 flex flex-col md:flex-row items-stretch relative"
                                >
                                    <div className="relative w-full md:w-2/5 min-h-50 md:min-h-60 overflow-hidden shrink-0">
                                        <img
                                            src={campaign.image}
                                            alt={campaign.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 from-black/60 via-black/10 to-transparent opacity-80" />

                                        <span className="absolute top-4 left-4 bg-linear-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
                                            {campaign.discountValue}% OFF
                                        </span>
                                    </div>
                                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center flex-1 bg-white relative z-10 -mt-6 md:mt-0 rounded-t-[2.5rem] md:rounded-none">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 border border-red-100 px-4 py-1.5 rounded-full shadow-sm">Hot Deal</span>
                                        </div>
                                        <h2 className="text-xl md:text-4xl lg:text-5xl font-extrabold text-gray-700 mb-2 tracking-tight leading-tight">
                                            {campaign.name}
                                        </h2>
                                        <p className="text-gray-500 text-[12px] md:text-lg lg:text-xl mb-5 leading-relaxed max-w-2xl">
                                            {campaign.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 mb-10">
                                            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 border border-gray-100 flex-1 min-w-20">
                                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-gray-700">
                                                    ⏳
                                                </div>
                                                <div>
                                                    <p className="text-[8px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Valid From</p>
                                                    <p className="font-semibold text-gray-800 text-xs">
                                                        {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 border border-gray-100 flex-1 min-w-20">
                                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-red-500">
                                                    🔥
                                                </div>
                                                <div>
                                                    <p className="text-[8px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Ends On</p>
                                                    <p className="font-bold text-red-500 text-xs">
                                                        {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="campaign-btn flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto">
                                            <a href="#menu" className="pulse-glow-btn bg-gray-700 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-3 hover:bg-gray-800 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1 w-full sm:w-auto text-center">
                                                Shop Collection
                                            </a>
                                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-50 px-6 py-3 border border-gray-100 w-full sm:w-auto text-center">
                                                Get Up To {campaign.discountValue}% OFF Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }


            {
                !recentlyViewedLoading && recentlyViewed.length > 0 && (
                    <section className="w-full max-w-7xl mx-auto py-15 px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <div className="flex items-center gap-3">

                                <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-800">
                                    Recently <span className="text-gray-500">Viewed</span>
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-gray-500 tracking-wide">
                                Continue exploring products you've viewed recently.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                            {recentlyViewed.map((item: Product) => (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/more-details`, { state: { product: item } })}
                                    className="recent group bg-white overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                                >
                                    <div className="relative h-48 sm:h-72 overflow-hidden">
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        {item.material && (
                                            <span className="absolute top-3 left-3 px-3 py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-sm">
                                                {item.material}
                                            </span>
                                        )}

                                        {item.basePrice > item.discountPrice && item.discountPrice !== 0 && (
                                            <span className="absolute top-3 right-3 px-2.5 py-1 text-[8px] sm:text-[10px] font-bold bg-linear-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-sm">
                                                {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-5">
                                        <h3 className="font-semibold text-gray-800 text-[10px] sm:text-sm leading-snug line-clamp-2 sm:line-clamp-1 group-hover:text-gray-950 transition-colors duration-300">
                                            {item.title}
                                        </h3>

                                        <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
                                            <span className="font-bold text-sm sm:text-lg text-gray-900">
                                                ₹{item.discountPrice === 0 ? item.basePrice : item.discountPrice}
                                            </span>
                                            {item.discountPrice !== 0 && item.basePrice > item.discountPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₹{item.basePrice}
                                                </span>
                                            )}
                                        </div>

                                        <button onClick={() => { showProduct(item._id as string), view(item._id as string), AddRecentlyViewed(item._id as string) }} className="w-full mt-3 sm:mt-4 py-1.5 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-semibold tracking-wider cursor-pointer text-gray-500 hover:text-gray-600 hover:underline hover:underline-offset-4 transition-all duration-300 flex items-center gap-1 sm:gap-2 justify-start">
                                            View Product
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            <section id="menu" className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-5">
                    <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">Satisfy Your Craving</span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-500 tracking-tight">
                        Our <span className="text-gray-700">Signature Menu</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base xl:text-lg text-gray-600">
                        Explore our handcrafted masterpieces. From fiery flame-grilled gourmet patties to crispy hand-cut sides and thick velvet shakes.
                    </p>
                </div>

                <div className="flex justify-center items-center gap-4 mb-12">
                    <button
                        className={`px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-sm font-extrabold uppercase tracking-widest hover:bg-gray-700 hover:text-white transition-all duration-300 cursor-pointer text-gray-700 border border-gray-700`}
                    >
                        shop
                    </button>
                </div>

                <div className='relative mt-1.5 min-h-50'>
                    {isLoading ?
                        (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
                                <div className="dot-spinner">
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {
                                    isError ? (
                                        <>
                                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50" >
                                                <div className='flex flex-col items-center gap-5'>
                                                    <h1 className='text-sm font-bold text-red-500 tracking-tight mb-5'>Something went wrong...</h1>
                                                </div>
                                            </div>
                                        </>
                                    ) : (

                                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-10 place-content-center place-items-center'>
                                            {data?.map((product: Product) => {
                                                if (product.isBestSeller || product.isNewArrival) {
                                                    return <Card key={product._id} product={product} />;
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                </div>

            </section >

            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
                    <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-widest">Unmatched Quality</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-400 tracking-tight">
                        What Makes a <span className="text-gray-800">Premium <br /> T-Shirt</span> Unforgettable?
                    </h2>
                    <p className="text-xs sm:text-sm md:text-lg text-gray-600">
                        We don't make fast fashion; we craft an artisanal journey using premium ingredients and express temperature-controlled logistics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="glass-card p-8 rounded-lg space-y-2">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-800 text-3xl font-semibold border border-gray-600/20">
                            <GiClothes />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">100% Certified Cotton</h3>
                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
                            Our T-shirt is made from 100% certified cotton. It is soft, comfortable, and breathable. It is also durable and long-lasting.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-lg space-y-2">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-800 text-3xl font-semibold border border-gray-500/20 shadow-inner">
                            <GiLoincloth />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">30-Min Thermo Delivery</h3>
                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
                            Express dispatch matching advanced route algorithms. Hand-packed in insulated custom thermo-foil bags ensuring your burger arrives sizzling hot.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-lg space-y-2">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-800 text-3xl font-semibold border border-gray-500/20 shadow-inner">
                            <GiRolledCloth />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Michelin-Inspired Chefs</h3>
                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
                            Recipes meticulously researched, balanced, and prepared by dedicated culinary experts with a deep understanding of flavor harmonies.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-0 -translate-y-1/3 w-80 h-80 bg-gray-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="glass-card rounded-lg p-6 sm:p-10 lg:p-16 relative overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                    {(LimitedEditionProduct?.length ?? 0) > 0 && LimitedEditionProduct?.map((item: Product, index: number) => (
                        <div key={item._id || index} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${index !== LimitedEditionProduct.length - 1 ? 'mb-2 pb-10 lg:mb-10 lg:pb-20 border-b border-white/10' : ''}`}>

                            <div className={`lg:col-span-5 flex justify-center relative order-first ${index % 2 !== 0 ? 'lg:order-last' : 'lg:order-first'}`}>
                                <div className="relative group">
                                    <img
                                        src={item.images?.[0] || "/placeholder.jpg"}
                                        className="w-full max-w-70 sm:max-w-md lg:max-w-full h-auto aspect-4/5 object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5 group-hover:scale-[1.02] transition-transform duration-300"
                                        alt={item.title}
                                    />
                                    <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-gray-900 bg-white/90 backdrop-blur-sm font-extrabold text-[9px] sm:text-xs uppercase tracking-widest px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg">
                                        ★ Limited Edition
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-6 text-left">
                                <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">{item.material || "Premium Quality"} · {item.fit || "Standard Fit"}</span>
                                <h2 className="text-xl sm:text-3xl font-extrabold text-gray-700 tracking-tight leading-tight">
                                    {item.title}
                                </h2>
                                <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
                                    {item.description}
                                </p>

                                <ul className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-medium text-gray-300">
                                    {item.tags && item.tags.length > 0 ? (
                                        item.tags.map((tag, i) => (
                                            <li key={i} className="flex items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-3">
                                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-700 text-xs shrink-0">✓</span>
                                                {tag}
                                            </li>
                                        ))
                                    ) : (
                                        <>
                                            <li className="flex items-center text-gray-500 gap-2 sm:gap-3">
                                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-700 text-xs shrink-0">✓</span>
                                                Premium {item.material || "Fabric"}
                                            </li>
                                            <li className="flex items-center text-gray-500 gap-2 sm:gap-3">
                                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-700 text-xs shrink-0">✓</span>
                                                {item.fit || "Comfort"} Fit
                                            </li>
                                            <li className="flex items-center text-gray-500 gap-2 sm:gap-3">
                                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-700 text-xs shrink-0">✓</span>
                                                Exceptional Quality
                                            </li>
                                            <li className="flex items-center text-gray-500 gap-2 sm:gap-3">
                                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-700 text-xs shrink-0">✓</span>
                                                Exclusive Design
                                            </li>
                                        </>
                                    )}
                                </ul>

                                <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-semibold">Special Pricing</span>
                                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-700 mt-1">
                                            ₹ {item.discountPrice > 0 ? item.discountPrice : item.basePrice}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate("/more-details", { replace: true, state: { product: item } })}
                                        className="pulse-glow-btn bg-gray-900 text-white font-bold text-[11px] sm:text-sm uppercase tracking-wider px-5 py-3 sm:px-8 sm:py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            <section id="testimonials" className="overflow-hidden py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
                    <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">Real Reviews</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                        Loved by <span className="text-gray-500">Gourmet Enthusiasts</span>
                    </h2>
                    <p className="text-sm md:text-lg text-gray-500">
                        Don't just take our word for it. Here is what real cloths critics and cloths lovers have to say about the <span className="text-gray-800">TEE T-Shirt</span> experience.
                    </p>
                </div>

                <div className="relative">
                    {reviewLoading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
                            <div className="dot-spinner">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                        </div>
                    )}

                    {reviewError && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
                            <div className="dot-spinner">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                        </div>
                    )}

                    <div className="flex w-max animate-scroll hover:[animation-play-state:paused] gap-4 sm:gap-6 md:gap-8 py-4">
                        {...(fiveStartReview || [])?.map((item: Review, index: number) => (
                            <div key={`${item._id}-${index}`} className="w-[280px] sm:w-[320px] md:w-[400px] lg:w-[450px] shrink-0 glass-card glow-card-orange p-5 sm:p-6 md:p-8 rounded-lg flex flex-col justify-between space-y-3 sm:space-y-4">

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <span key={i} className="text-yellow-500 text-sm sm:text-lg">★</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                                        <Heart className="text-red-500" size={14} />
                                        <span>{item?.likes}</span>
                                    </div>
                                </div>
                                <p className='text-sm sm:text-base tracking-wider font-semibold text-gray-900'>{item?.title}</p>
                                <p className="text-gray-600 leading-relaxed tracking-wide text-xs sm:text-sm whitespace-normal">
                                    {item.comment}
                                </p>
                                <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center text-white font-extrabold text-xs overflow-hidden">
                                        <img src={item?.images?.[0] || "./profile.png"} className="h-full w-full object-cover" alt="profile images" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">{item?.user?.name}</h4>
                                        <p className="text-[10px] sm:text-xs tracking-wider text-gray-500 truncate">{item?.user?.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => showProduct(item?.productId)}
                                        className="group tracking-wider hover:underline hover:underline-offset-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        View Product

                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative">
                <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-20">
                    <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">Download The App</span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-500 tracking-tight">For Exclusive Offers</h3>
                </div>

                <div className="from-indigo-950/30 to-purple-950/30 border border-indigo-500/10 rounded-xl p-6 sm:p-10 lg:p-16 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-5 sm:space-y-6 text-center lg:text-left lg:max-w-xl z-10 w-full">
                        <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest">Exclusive Mobile Rewards</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-500 tracking-tight leading-tight">
                            Get <span className="text-gray-900">20% Off</span> Your <br className="hidden sm:block" />
                            First Order on Mobile!
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700">
                            Download the new Vastraverse App today to unlock direct order-tracking, fast checkouts, special mobile-only collections, and earn fashion loyalty points.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 w-full">
                            <button
                                onClick={() => toast.info("😅 Sorry App store is under construction.")}
                                className="w-full sm:w-auto justify-center bg-white hover:bg-gray-100 text-black font-extrabold text-sm uppercase tracking-wider px-8 py-3.5 rounded-2xl flex items-center gap-3 transition-colors duration-300 cursor-pointer"
                            >
                                <span>App Store</span>
                            </button>
                            <button
                                onClick={() => toast.info("🤗 Sorry Google Play store is under construction.")}
                                className="w-full sm:w-auto justify-center bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 font-extrabold text-sm uppercase tracking-wider px-8 py-3.5 rounded-2xl flex items-center gap-3 transition-colors duration-300 cursor-pointer"
                            >
                                <span>Google Play</span>
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-center w-full lg:w-auto z-10 my-4 lg:my-0'>
                        <div className='relative w-[280px] sm:w-72 h-[500px] sm:h-[550px] bg-slate-900 rounded-[30px] sm:rounded-[40px] border-[6px] sm:border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shrink-0'>

                            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-5 sm:h-6 bg-slate-800 rounded-b-xl sm:rounded-b-2xl z-20 flex items-center justify-center gap-1.5'>
                                <div className='w-10 sm:w-12 h-1 bg-slate-900 rounded-full' />
                                <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-900 rounded-full' />
                            </div>

                            <div className='flex-1 bg-gray-50 p-3 sm:p-4 pt-8 sm:pt-10 flex flex-col justify-between relative z-10'>
                                <div className='space-y-3 sm:space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider'>VASTRAVERSE App</span>
                                        <span className='text-[10px] sm:text-xs bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5 sm:px-2.5 font-bold'>OFFERS</span>
                                    </div>
                                    <div className='h-28 sm:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-3 sm:p-4 text-white flex flex-col justify-between shadow-lg shadow-indigo-200'>
                                        <p className='text-xs sm:text-sm font-bold uppercase tracking-wider'>Mega Wardrobe Deal</p>
                                        <div>
                                            <p className='text-xl sm:text-2xl font-black'>50% OFF</p>
                                            <p className='text-[9px] sm:text-[10px] text-indigo-50 font-medium'>Use Code: BUNDLE50</p>
                                        </div>
                                    </div>
                                    <div className='space-y-2 sm:space-y-2.5'>
                                        <p className='text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider'>Popular Collections</p>
                                        <div className='flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-100'>
                                            <img src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80' alt='tshirt' className='w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg object-cover' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-[10px] sm:text-xs font-bold text-slate-800 truncate'>Classic Cotton T-Shirt</p>
                                                <p className='text-[9px] sm:text-[10px] text-emerald-600 font-bold'>₹ 499</p>
                                            </div>
                                            <button className='bg-indigo-500 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-bold'>Add</button>
                                        </div>
                                        <div className='flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-100'>
                                            <img src='https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=100&q=80' alt='jacket' className='w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg object-cover' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-[10px] sm:text-xs font-bold text-slate-800 truncate'>Premium Denim Jacket</p>
                                                <p className='text-[9px] sm:text-[10px] text-emerald-600 font-bold'>₹ 1299</p>
                                            </div>
                                            <button className='bg-indigo-500 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-bold'>Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='pt-3 sm:pt-4 border-t border-slate-200 flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 font-medium'>
                                    <span>Home</span>
                                    <span className='text-indigo-500 font-bold'>Cart (2)</span>
                                    <span>Profile</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full sm:max-w-sm lg:max-w-xs relative z-10 flex flex-col items-center">
                        <div className="glass-card p-5 sm:p-6 border border-white/10 text-center w-full shadow-2xl shadow-indigo-500/5 rounded-2xl bg-white/5 backdrop-blur-xl">
                            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">Promo Coupon Code</span>
                            <div className="border border-dashed border-gray-500/30 bg-gray-500/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 mt-2 sm:mt-3 text-lg sm:text-2xl font-mono font-extrabold text-gray-600 tracking-widest select-all break-all">
                                {coupons?.map((c: any) => c.code).join(", ") || "VASTRA20"}
                            </div>
                            <p className="text-[9px] sm:text-[11px] text-gray-600 mt-2 sm:mt-3 leading-relaxed tracking-wider">
                                Enter coupon code at checkout on our mobile app to redeem your first fashion gift.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </div >
    );
};