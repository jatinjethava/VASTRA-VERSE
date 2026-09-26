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
import { useState } from 'react';
import { ArrowRight, Heart, Copy, Check, Sparkles, ShieldCheck, Search, ShoppingBag, Wifi } from 'lucide-react';
import { useGetRecentlyViewed, useRecentlyViewed } from '../Hooks/user';
import { useFlashCampaigns, useMarketingCampaigns } from '../Hooks/marketing';
import { useFetchBlogs } from '../Hooks/blog';
import type { IBlog } from '../Api/blogApi';
import { FlashSaleBanner } from '../Components/FlashSaleBanner';
import { HomeSlider } from '../Components/slider/homeSlider';
import { useGetCoupons } from '../Hooks/help';
import { motion } from 'framer-motion';

export const Home = () => {

    const { data, isLoading, isError } = useGetAllProducts();
    const { data: allreviews, isLoading: reviewLoading, isError: reviewError } = useAllreviews();
    const { data: recentlyViewed, isLoading: recentlyViewedLoading } = useGetRecentlyViewed();
    const { mutateAsync: view } = useViewProduct();
    const { mutate: AddRecentlyViewed } = useRecentlyViewed();
    const { data: campaigns } = useMarketingCampaigns();
    const { data: flashCampaigns } = useFlashCampaigns();
    const { data: coupons } = useGetCoupons();
    const { data: blogsData } = useFetchBlogs();
    const [copiedCode, setCopiedCode] = useState(false);

    const latestBlogs = blogsData?.data?.blog?.slice(0, 3) || [];

    const primaryCouponCode = (coupons && coupons.length > 0 && coupons[0]?.code) ? coupons[0].code : "VASTRA20";

    const handleCopyPromoCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        toast.success(`Archival Passcode "${code}" copied to clipboard`);
        setTimeout(() => setCopiedCode(false), 2200);
    };

    const navigate = useNavigate();

    const showProduct = async (id: string) => {
        const product = data?.find((p: Product) => p._id === id)
        navigate(`/more-details`, { state: { product: product } })
    }

    const LimitedEditionProduct = data?.filter((p: Product) => p.limitedEdition || (p as any).isLimitedEdition);

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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center max-w-3xl mx-auto space-y-2 mb-16"
                        >
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Limited Time Only</span>
                            <h2 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
                                Exclusive <span className="text-gray-500">Offers</span>
                            </h2>
                            <p className="text-sm text-gray-600">
                                Grab these exclusive deals before they are gone. Premium streetwear at unbeatable prices.
                            </p>
                        </motion.div>
                        <div className="flex flex-col gap-12">
                            {campaigns?.map((campaign) => (
                                <motion.div
                                    key={campaign._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
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
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )
            }


            {
                !recentlyViewedLoading && (recentlyViewed?.length ?? 0) > 0 && (
                    <section className="w-full max-w-7xl mx-auto py-15 px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-8"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] block">
                                    Your History
                                </span>
                            </div>
                            <h2 className="editorial-text text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-black mt-1">
                                Recently <span className="italic">Viewed</span>
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-gray-500 font-light">
                                Continue exploring garments you have previously inspected.
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {recentlyViewed?.map((item: Product) => (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/more-details`, { state: { product: item } })}
                                    className="recent group bg-white border border-black/10 hover:border-black transition-all duration-500 cursor-pointer flex flex-col justify-between"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        {item.material && (
                                            <span className="absolute top-2 sm:top-3 left-2 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[6px] sm:text-[9px] font-medium uppercase tracking-[0.2em] bg-black text-white">
                                                {item.material}
                                            </span>
                                        )}

                                        {item.basePrice > item.discountPrice && item.discountPrice !== 0 && (
                                            <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 text-[6px] sm:text-[9px] font-medium tracking-wider bg-white text-black border border-black">
                                                {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
                                        <h3 className="font-normal text-black text-[10px] sm:text-sm leading-snug line-clamp-3 sm:line-clamp-2 uppercase tracking-wide group-hover:text-gray-600 transition-colors">
                                            {item.title}
                                        </h3>

                                        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                                            <span className="font-medium text-xs sm:text-base text-black">
                                                ₹{item.discountPrice === 0 ? item.basePrice.toLocaleString('en-IN') : item.discountPrice.toLocaleString('en-IN')}
                                            </span>
                                            {item.discountPrice !== 0 && item.basePrice > item.discountPrice && (
                                                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                    ₹{item.basePrice.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                showProduct(item._id as string);
                                                view(item._id as string);
                                                AddRecentlyViewed(item._id as string);
                                            }}
                                            className="w-full mt-4 py-2 border-t border-black/5 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-black hover:text-gray-500 transition-colors flex items-center justify-between"
                                        >
                                            <span>Inspect</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            <section id="menu" className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 border-t border-black/10">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Couture Archive</span>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                        The Signature <span className="italic">Collection</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
                        Explore our core collection of minimalist essentials, bespoke outerwear, and tailored silhouettes crafted for everyday distinction.
                    </p>
                </div>

                <div className="flex justify-center items-center gap-4 mb-16">
                    <button
                        className="px-8 py-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] bg-black text-white hover:bg-neutral-800 transition-all duration-300 cursor-pointer shadow-sm"
                    >
                        All Creations
                    </button>
                </div>

                <div className='relative mt-1.5 min-h-50'>
                    {isLoading ?
                        (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-10 place-content-center place-items-center">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-full bg-white overflow-hidden border border-gray-100 shadow-sm hero-skeleton-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                                        <div className="relative h-48 sm:h-72 bg-gray-100 overflow-hidden">
                                            <div className="absolute inset-0 product-skeleton-shimmer" />
                                        </div>
                                        <div className="p-3 sm:p-5 space-y-3">
                                            <div className="h-3 sm:h-4 w-3/4 rounded-full bg-gray-100 hero-skeleton-pulse" />
                                            <div className="flex items-baseline gap-2">
                                                <div className="h-4 sm:h-5 w-16 rounded-full bg-gray-100 hero-skeleton-pulse" style={{ animationDelay: '0.15s' }} />
                                                <div className="h-3 w-12 rounded-full bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.3s' }} />
                                            </div>
                                            <div className="h-8 sm:h-10 w-full rounded-lg bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </div>
                                ))}
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

            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Craft & Philosophy</span>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                        The Anatomy of <span className="italic">Timeless Essentials</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
                        We discard fast fashion cycles in favor of permanent silhouettes, ethically sourced long-staple fibers, and meticulous tailoring.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between space-y-6 hover:border-black transition-colors duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">01 / FIBER</span>
                                <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-black text-xl">
                                    <GiClothes />
                                </div>
                            </div>
                            <h3 className="editorial-text text-xl sm:text-2xl font-normal text-black leading-snug">
                                100% Organic Heavyweight Jersey
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                                Spun from certified extra-long staple cotton into a dense 280 GSM knit that provides an immaculate drape, unparalleled breathability, and lifelong softness.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between space-y-6 hover:border-black transition-colors duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">02 / STRUCTURE</span>
                                <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-black text-xl">
                                    <GiLoincloth />
                                </div>
                            </div>
                            <h3 className="editorial-text text-xl sm:text-2xl font-normal text-black leading-snug">
                                Precision Tailoring & Draping
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                                Engineered with calibrated drop-shoulders and reinforced double-needle collar ribbing designed to hold its architectural geometry wear after wear.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between space-y-6 hover:border-black transition-colors duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">03 / ATELIER</span>
                                <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-black text-xl">
                                    <GiRolledCloth />
                                </div>
                            </div>
                            <h3 className="editorial-text text-xl sm:text-2xl font-normal text-black leading-snug">
                                Small-Batch Ethical Craft
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                                Manufactured in restricted artisan quantities to eradicate deadstock waste, utilizing eco-certified non-toxic dyes and fair-wage craftsmanship.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-24">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Curated Capsule</span>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                        The Limited Edition <span className="italic">Archive</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
                        Exclusively numbered production runs. Once the allocation sells out, patterns and textile blends are permanently retired.
                    </p>
                </div>

                <div className="space-y-16 sm:space-y-28">
                    {(LimitedEditionProduct?.length ?? 0) > 0 && LimitedEditionProduct?.map((item: Product, index: number) => (
                        <div key={item._id || index} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center border-b border-black/10 pb-16 sm:pb-24 last:border-b-0 last:pb-0">

                            <div className={`lg:col-span-5 relative ${index % 2 !== 0 ? 'lg:order-last' : 'lg:order-first'}`}>
                                <div className="relative group overflow-hidden bg-[#fafafa] border border-black/10 aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                                    <img
                                        src={item.images?.[0] || "/placeholder.jpg"}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        alt={item.title}
                                    />
                                    <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] uppercase tracking-[0.25em] font-medium px-3.5 py-1.5 shadow-sm">
                                        ARCHIVE · LIMITED RUN
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-6 text-left">
                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                                    <span>{item.material || "ORGANIC HEAVYWEIGHT"}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{item.fit || "RELAXED SILHOUETTE"}</span>
                                </div>

                                <h3 className="editorial-text text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-black tracking-tight leading-snug">
                                    {item.title}
                                </h3>

                                <p className="text-xs sm:text-sm md:text-base text-gray-600 font-light leading-relaxed max-w-xl">
                                    {item.description}
                                </p>

                                <div className="border-t border-b border-black/10 py-5 my-6">
                                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3.5">
                                        Garment Specifications
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                                        {item.tags && item.tags.length > 0 ? (
                                            item.tags.map((tag, i) => (
                                                <div key={i} className="flex items-center gap-2.5 text-[11px] sm:text-xs font-light text-gray-700 uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                                                    <span className="truncate">{tag}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-light text-gray-700 uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                                                    <span>Dense 280 GSM</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-light text-gray-700 uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                                                    <span>Pre-Shrunk Yarn</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-light text-gray-700 uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-black shrink-0" />
                                                    <span>Artisan Finish</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-end justify-between gap-6 pt-2">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium block mb-1">
                                            Edition Valuation
                                        </span>
                                        <div className="text-2xl sm:text-3xl font-light text-black tracking-tight">
                                            ₹ {(item.discountPrice > 0 ? item.discountPrice : item.basePrice).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate("/more-details", { replace: true, state: { product: item } })}
                                        className="group inline-flex items-center gap-4 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium px-8 py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer shadow-sm"
                                    >
                                        <span>Acquire Piece</span>
                                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            <section id="testimonials" className="overflow-hidden py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Client Dialogue</span>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                        Voices of <span className="italic">Distinction</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
                        Reflections from style connoisseurs and discerning patrons across the world wearing Vastraverse.
                    </p>
                </div>

                <div className="relative">
                    {reviewLoading && (
                        <div className="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto max-h-[450px] sm:max-h-none gap-4 sm:gap-6 md:gap-8 py-4 pr-1 sm:pr-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 sm:[&::-webkit-scrollbar]:w-0 sm:hide-scrollbar">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full sm:w-[320px] md:w-[400px] lg:w-[450px] shrink-0 p-5 sm:p-6 md:p-8 rounded-lg border border-gray-100 bg-white shadow-sm space-y-4 hero-skeleton-fade-in" style={{ animationDelay: `${i * 0.12}s` }}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1.5">
                                            {[...Array(5)].map((_, s) => (
                                                <div key={s} className="w-4 h-4 rounded-full bg-yellow-100 hero-skeleton-pulse" style={{ animationDelay: `${s * 0.1}s` }} />
                                            ))}
                                        </div>
                                        <div className="w-8 h-4 rounded-full bg-gray-100 hero-skeleton-pulse" />
                                    </div>
                                    <div className="h-4 w-2/3 rounded-full bg-gray-100 hero-skeleton-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full rounded-full bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.1s' }} />
                                        <div className="h-3 w-[90%] rounded-full bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.2s' }} />
                                        <div className="h-3 w-[70%] rounded-full bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex items-center gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hero-skeleton-pulse" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3 w-24 rounded-full bg-gray-100 hero-skeleton-pulse" />
                                            <div className="h-2.5 w-32 rounded-full bg-gray-50 hero-skeleton-pulse" style={{ animationDelay: '0.15s' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {reviewError && (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                                    <span className="text-red-400 text-lg">!</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500">Unable to load reviews</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto snap-y sm:snap-x snap-mandatory max-h-[450px] sm:max-h-none gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 pr-1 sm:pr-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 sm:[&::-webkit-scrollbar]:w-0 sm:hide-scrollbar">
                        {...(fiveStartReview || [])?.map((item: Review, index: number) => (
                            <div key={`${item._id}-${index}`} className="w-full sm:w-[360px] md:w-[400px] lg:w-[450px] shrink-0 snap-center bg-white border border-black/10 p-5 sm:p-8 md:p-10 flex flex-col justify-between space-y-4 sm:space-y-6">

                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2 sm:gap-2.5">
                                        <div className="flex items-center gap-1.5">
                                            {[...Array(item.rating || 5)].map((_, i) => (
                                                <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-[8px] sm:text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                                            Verified Buyer
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-widest text-gray-500 uppercase">
                                        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
                                        <span>{item?.likes}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <h4 className="editorial-text text-base sm:text-xl md:text-2xl font-light text-black leading-snug tracking-wide line-clamp-2">
                                        "{item?.title}"
                                    </h4>
                                    <p className="text-xs sm:text-base text-gray-600 leading-relaxed font-light line-clamp-4">
                                        {item.comment}
                                    </p>
                                </div>

                                <div className="pt-4 sm:pt-8 mt-auto border-t border-black/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-black/5">
                                            <img src={item?.images?.[0] || "./profile.png"} className="h-full w-full object-cover" alt="profile image" />
                                        </div>
                                        <div>
                                            <h4 className="text-[9px] sm:text-[11px] font-bold text-black uppercase tracking-[0.15em]">{item?.user?.name}</h4>
                                            <p className="text-[8px] sm:text-[10px] tracking-[0.15em] text-gray-400 uppercase mt-0.5 sm:mt-1 line-clamp-1">{item?.user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => showProduct(item?.productId)}
                                        className="group shrink-0 inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-black/10 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                                    >
                                        <ArrowRight size={14} strokeWidth={1.5} className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {latestBlogs.length > 0 && (
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20">
                        <div className="space-y-3">
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Editorial Insights</span>
                            <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                                The <span className="italic">Journal</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-light max-w-md">
                                Explore our latest styling guides, editorial lookbooks, and brand philosophy.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/blogs')}
                            className="shrink-0 group inline-flex items-center gap-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium px-6 py-3 hover:bg-neutral-800 transition-all duration-300 shadow-sm"
                        >
                            <span>View All Articles</span>
                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                        {latestBlogs.map((blog: IBlog) => (
                            <div
                                key={blog._id}
                                onClick={() => navigate(`/blogs/detail?id=${blog._id}`, { state: { blog } })}
                                className="group cursor-pointer flex flex-col gap-5"
                            >
                                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-gray-100 border border-black/10">
                                    <img
                                        src={blog.featuredImage || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"}
                                        alt={blog.title}
                                        className="w-full h-full object-cover grayscale contrast-110 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-4 left-4 bg-black text-white text-[8px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
                                        {blog.category || "Editorial"}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="editorial-text text-xl sm:text-2xl font-normal text-black leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-light line-clamp-2">
                                        {blog.description}
                                    </p>
                                    <div className="pt-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium">
                                        <span>{blog.author || "Atelier Editor"}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative overflow-hidden">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Community Archive</span>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
                        Spotted in <span className="italic">Vastraverse</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-light">
                        Join the movement. Tag @vastraverse on Instagram to be featured.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    {[
                        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&q=80",
                        "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=500&q=80",
                        "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=500&q=80",
                        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80"
                    ].map((img, i) => (
                        <div
                            key={i}
                            onClick={() => window.open("https://www.instagram.com/jatin_jethava_3125/", "_blank")}
                            className="group relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-pointer"
                        >
                            <img
                                src={img}
                                alt="Social post"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale contrast-125 hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 relative">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/15 bg-black/[0.03] text-black/80 rounded-full text-[10px] tracking-[0.25em] uppercase font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-black/70 animate-pulse" />
                        Digital Atelier & Mobile Concierge
                    </div>
                    <h2 className="editorial-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight leading-[1.1]">
                        Private Access <span className="italic font-serif font-normal">Everywhere</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
                        Seamlessly transition from archival catalog reservations to private white-glove checkout with the dedicated Vastraverse mobile application.
                    </p>
                </div>

                <div className="relative rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-[#0c0c0d] via-[#070708] to-[#000000] border border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden p-5 sm:p-10 lg:p-14">

                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                    <div className="absolute -top-32 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/[0.03] rounded-full blur-2xl sm:blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/[0.02] rounded-full blur-2xl sm:blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">

                        <div className="lg:col-span-5 space-y-5 sm:space-y-7 text-center lg:text-left">
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-mono">
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80" />
                                Mobile Concierge Privileges
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <h3 className="editorial-text text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.12]">
                                    Elevate Your Everyday <br className="hidden sm:block" />
                                    <span className="italic font-serif font-normal text-white/90">Wardrobe</span>
                                </h3>
                                <p className="text-[11px] sm:text-[15px] text-neutral-400 font-light leading-relaxed max-w-sm sm:max-w-md mx-auto lg:mx-0">
                                    Download the Vastraverse digital concierge for real-time private courier tracking, bespoke size reservations, and invitation-only archive sales.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 text-left max-w-sm sm:max-w-md mx-auto lg:mx-0">
                                <div className="p-2.5 sm:p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg sm:rounded-xl flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 sm:mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-medium text-white tracking-wide">Real-Time Telemetry</p>
                                        <p className="text-[9px] sm:text-[10px] text-neutral-400 font-light">White-glove private dispatch</p>
                                    </div>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg sm:rounded-xl flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 sm:mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-medium text-white tracking-wide">Archive Access</p>
                                        <p className="text-[9px] sm:text-[10px] text-neutral-400 font-light">Secret vaults & limited capsules</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2">
                                <button
                                    onClick={() => toast.info("App Store release scheduled shortly. Add to whitelist.")}
                                    className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-black px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.02] cursor-pointer group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 170 170">
                                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.68-7.75-11.93-14.14-5.2-7.8-9.43-16.7-12.7-26.69-3.26-10-4.9-19.68-4.9-29.04 0-14.35 3.65-26.06 10.96-35.13 7.3-9.08 16.48-13.68 27.52-13.8 4.8 0 10.15 1.25 16.05 3.75 5.91 2.5 9.77 3.86 11.6 4.08 1.42-.32 5.37-1.74 11.83-4.24 6.46-2.51 11.96-3.66 16.5-3.46 12.56.76 22.42 5.48 29.58 14.16-10.99 6.64-16.36 15.77-16.12 27.38.25 9.15 3.75 16.85 10.5 23.09 6.75 6.24 14.65 9.77 23.7 10.6-2.07 6.18-4.59 12.3-7.56 18.36zM119.22 33.04c0-7.3 2.66-14.11 7.97-20.44 5.31-6.32 11.85-10.42 19.62-12.3.87 7.08-1.44 14.07-6.93 20.97-5.49 6.9-12.37 10.9-20.66 11.77z" />
                                    </svg>
                                    <div className="text-left leading-tight">
                                        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-500 font-semibold block">Download on</span>
                                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-black font-bold block">Apple iOS</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => toast.info("Google Play release scheduled shortly. Add to whitelist.")}
                                    className="w-full sm:w-auto bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/20 hover:border-white/40 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0 text-white/90" viewBox="0 0 24 24">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186c-.37-.34-.61-.83-.61-1.39V3.204c0-.56.24-1.05.609-1.39zm11.24 11.24l2.484-2.485-12.01-6.934 9.526 9.419zm0 1.892l-9.526 9.419 12.01-6.934-2.484-2.485zm1.485-1.485l3.232 1.866c.86.497.86 1.309 0 1.806l-3.232 1.866-1.06-1.06 1.06-1.06 1.06-1.06-1.06-1.06 1.06-1.06-1.06-1.06z" />
                                    </svg>
                                    <div className="text-left leading-tight">
                                        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold block">Get it on</span>
                                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white font-bold block">Google Play</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex justify-center py-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent rounded-full blur-2xl transform scale-75 pointer-events-none" />

                            <div className="relative w-[280px] sm:w-[300px] h-[550px] sm:h-[570px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black p-[10px] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col shrink-0">

                                <div className="absolute -left-[2px] top-24 w-[2px] h-8 bg-neutral-600 rounded-l" />
                                <div className="absolute -left-[2px] top-36 w-[2px] h-11 bg-neutral-600 rounded-l" />
                                <div className="absolute -left-[2px] top-50 w-[2px] h-11 bg-neutral-600 rounded-l" />
                                <div className="absolute -right-[2px] top-32 w-[2px] h-14 bg-neutral-600 rounded-r" />

                                <div className="relative w-full h-full bg-[#0a0a0a] rounded-[40px] overflow-hidden flex flex-col justify-between border border-neutral-800/90 select-none">

                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] pointer-events-none z-30" />

                                    <div className="pt-2 px-5 pb-1 relative z-20 flex flex-col items-center">
                                        <div className="w-full flex items-center justify-between text-[11px] font-semibold text-white/70 tracking-tight font-mono">
                                            <span>09:41</span>
                                            <div className="flex items-center gap-1.5 text-white/70">
                                                <Wifi className="w-3 h-3 text-white/80" />
                                                <div className="w-4 h-2 border border-white/60 rounded-[2px] p-[1px] flex items-center">
                                                    <div className="w-2.5 h-full bg-white rounded-[1px]" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-24 h-5 bg-black rounded-full mt-1 flex items-center justify-between px-2 border border-white/10 shadow-inner">
                                            <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700/60" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                                        </div>
                                    </div>

                                    <div className="flex-1 px-4 py-2 flex flex-col justify-between overflow-hidden relative z-10">
                                        <div className="space-y-3.5">
                                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="editorial-text text-xs text-white tracking-[0.18em] font-semibold">VASTRAVERSE</span>
                                                </div>
                                                <span className="text-[8px] bg-white text-black px-2 py-0.5 font-bold uppercase tracking-wider rounded-sm shadow-sm">
                                                    VIP Concierge
                                                </span>
                                            </div>

                                            <div className="relative rounded-xl p-3.5 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-white/20 shadow-lg overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.04] rounded-full blur-xl pointer-events-none" />
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 block font-mono">Inaugural Access</span>
                                                        <p className="editorial-text text-base sm:text-lg font-light text-white tracking-tight">20% PRIVILEGE</p>
                                                    </div>
                                                    <div className="w-7 h-5 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                                                        <Sparkles className="w-3.5 h-3.5 text-white/80" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                                    <span className="text-[9px] font-mono text-white/80 tracking-widest uppercase">CODE: {primaryCouponCode}</span>
                                                    <span className="text-[7px] text-white/50 uppercase tracking-widest font-mono">Active Tier 01</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-semibold text-white/50 uppercase tracking-[0.2em]">Curated Capsule</span>
                                                    <span className="text-[8px] font-mono text-neutral-400">2 Items Saved</span>
                                                </div>

                                                <div className="flex items-center gap-2.5 p-2 bg-neutral-950/80 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                                                    <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded overflow-hidden shrink-0">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80"
                                                            alt="Heavyweight Tee"
                                                            className="w-full h-full object-cover grayscale contrast-125"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] font-medium text-white truncate">Heavyweight Tee</p>
                                                            <span className="text-[7px] px-1 py-0.5 bg-white/10 text-white/70 rounded">Reserved</span>
                                                        </div>
                                                        <p className="text-[8px] text-neutral-400">Bespoke Fit / Noir</p>
                                                        <p className="text-[9px] text-white font-mono font-medium">₹ 1,050</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 p-2 bg-neutral-950/80 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                                                    <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded overflow-hidden shrink-0">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=150&q=80"
                                                            alt="Tailored Overshirt"
                                                            className="w-full h-full object-cover grayscale contrast-125"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[10px] font-medium text-white truncate">Tailored Overshirt</p>
                                                            <span className="text-[7px] px-1 py-0.5 bg-white/10 text-white/70 rounded">Reserved</span>
                                                        </div>
                                                        <p className="text-[8px] text-neutral-400">Italian Gabardine</p>
                                                        <p className="text-[9px] text-white font-mono font-medium">₹ 1,890</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-white/10 flex justify-around items-center text-[8px] text-neutral-400 uppercase tracking-widest">
                                            <div className="flex flex-col items-center gap-0.5 text-white">
                                                <div className="w-1 h-1 rounded-full bg-white mb-0.5" />
                                                <span className="font-semibold">Atelier</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer">
                                                <Search className="w-3 h-3 text-neutral-400" />
                                                <span>Search</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5 hover:text-white transition-colors cursor-pointer relative">
                                                <ShoppingBag className="w-3 h-3 text-neutral-400" />
                                                <span>Bag (2)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1 flex justify-center">
                                        <div className="w-24 h-1 bg-white/40 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-col items-center">
                            <div className="w-full bg-gradient-to-b from-neutral-900/90 via-[#0d0d0d]/90 to-black border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden shadow-2xl">

                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-white/80" />
                                            <span className="text-[10px] text-white font-semibold uppercase tracking-[0.2em]">
                                                Privilege Pass
                                            </span>
                                        </div>
                                        <span className="text-[8px] font-mono px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/15">
                                            Tier 01
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-mono block">
                                            Archival Passcode
                                        </span>

                                        <button
                                            onClick={() => handleCopyPromoCode(primaryCouponCode)}
                                            title="Click to copy passcode"
                                            className="w-full mt-2.5 p-3.5 bg-black/70 hover:bg-black/90 border border-dashed border-white/30 hover:border-white/60 rounded-xl transition-all duration-300 flex items-center justify-between group cursor-pointer"
                                        >
                                            <div className="text-left min-w-0 flex-1 mr-2">
                                                <span className="text-base sm:text-lg font-mono font-semibold text-white tracking-[0.14em] block">
                                                    {primaryCouponCode}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono block mt-0.5">
                                                    20% Off Inaugural Order
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 group-hover:bg-white text-white group-hover:text-black transition-all duration-200 text-[10px] uppercase font-bold tracking-wider shrink-0">
                                                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedCode ? "Copied" : "Copy"}</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-2 pt-1 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-light">
                                            <span className="w-1 h-1 rounded-full bg-white/80" />
                                            <span>20% off your entire inaugural order</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-light">
                                            <span className="w-1 h-1 rounded-full bg-white/80" />
                                            <span>Complimentary white-glove courier</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-light">
                                            <span className="w-1 h-1 rounded-full bg-white/80" />
                                            <span>Priority archive drop reservations</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center gap-2 text-[9px] text-neutral-400 font-mono">
                                        <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse inline-block" />
                                        <span>Authenticated & ready at checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div >
    );
};