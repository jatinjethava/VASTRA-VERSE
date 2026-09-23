import { useState, useEffect } from "react";
import { useAllBanner } from "../../Hooks/marketing";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import '../../App.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const DEFAULT_BANNERS = [
    {
        _id: "default-1",
        title: "Wear Confidence. Define Your Style.",
        description: "Discover premium fashion designed for comfort, quality, and everyday confidence. From oversized streetwear to timeless essentials, explore collections crafted to elevate your wardrobe.",
        bgImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80",
        isActive: true,
    },
    {
        _id: "default-2",
        title: "Autumn & Winter Minimalist Drop",
        description: "Crafted from 100% heavyweight certified organic cotton. Modern cuts and tailored silhouettes engineered to stand the test of time.",
        bgImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=2000&q=80",
        isActive: true,
    },
    {
        _id: "default-3",
        title: "Exclusive Urban Streetwear",
        description: "Unmatched craftsmanship meets contemporary edge. Redefine your aesthetic with our newest signature capsule collection.",
        bgImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=80",
        isActive: true,
    }
];

export const getBannerImageUrl = (path?: string): string => {
    if (!path) return DEFAULT_BANNERS[0].bgImage;
    const cleaned = path.replace(/\\/g, '/');
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned;
    }
    const backendUrl = import.meta.env.VITE_URL || "";
    const base = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const rel = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    return `${base}${rel}`;
};

export const HomeSlider = () => {

    const { data: Banner, isPending: bannerLoading } = useAllBanner();

    const hasVideo = false;
    const [videoError, setVideoError] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const hasApiBanners = Array.isArray(Banner) && Banner.length > 0;
    const showLoader = bannerLoading && !timedOut && !hasApiBanners;
    const activeBanners = hasApiBanners ? Banner : DEFAULT_BANNERS;

    return (
        <>
            {showLoader ? (
                <section id="hero" className="relative w-full h-[62vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="absolute inset-0 hero-shimmer-overlay" />

                    <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 pointer-events-none" />

                    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
                        <div className="hero-particle hero-particle-1" />
                        <div className="hero-particle hero-particle-2" />
                        <div className="hero-particle hero-particle-3" />
                    </div>

                    <div className="relative z-20 flex w-full max-w-[92%] sm:max-w-[90%] lg:max-w-[80%] mx-auto justify-start items-center h-full py-10 sm:py-12">
                        <div className="max-w-2xl flex flex-col justify-center text-left space-y-5 sm:space-y-7 p-0 sm:p-4">

                            <div className="flex items-center gap-3 hero-skeleton-fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="w-8 h-[1px] bg-white/20 rounded-full" />
                                <div className="h-3 w-28 sm:w-36 rounded-full bg-white/10 hero-skeleton-pulse" />
                                <div className="w-8 h-[1px] bg-white/20 rounded-full" />
                            </div>

                            <div className="space-y-3 hero-skeleton-fade-in" style={{ animationDelay: '0.25s' }}>
                                <div className="h-7 sm:h-10 md:h-12 lg:h-14 w-[90%] rounded-lg bg-white/8 hero-skeleton-pulse" style={{ animationDelay: '0.1s' }} />
                                <div className="h-7 sm:h-10 md:h-12 lg:h-14 w-[70%] rounded-lg bg-white/6 hero-skeleton-pulse" style={{ animationDelay: '0.2s' }} />
                            </div>

                            <div className="space-y-2.5 hero-skeleton-fade-in" style={{ animationDelay: '0.4s' }}>
                                <div className="h-3 sm:h-4 w-full max-w-xl rounded-full bg-white/6 hero-skeleton-pulse" style={{ animationDelay: '0.3s' }} />
                                <div className="h-3 sm:h-4 w-[85%] max-w-lg rounded-full bg-white/5 hero-skeleton-pulse" style={{ animationDelay: '0.4s' }} />
                                <div className="h-3 sm:h-4 w-[60%] max-w-md rounded-full bg-white/4 hero-skeleton-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>

                            <div className="flex gap-4 sm:gap-6 pt-2 hero-skeleton-fade-in" style={{ animationDelay: '0.55s' }}>
                                <div className="h-10 sm:h-12 w-32 sm:w-40 rounded-sm bg-white/10 hero-skeleton-pulse border border-white/10" style={{ animationDelay: '0.6s' }} />
                                <div className="h-10 sm:h-12 w-32 sm:w-40 rounded-sm bg-white/15 hero-skeleton-pulse border border-white/5" style={{ animationDelay: '0.7s' }} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/30 hero-skeleton-pulse" />
                        <div className="w-2 h-2 rounded-full bg-white/15 hero-skeleton-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-white/15 hero-skeleton-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </section>
            ) : (
                <div className="relative w-full h-[62vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] overflow-hidden">

                    {hasVideo && !videoError ? (
                        <>
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover z-0"
                                poster={getBannerImageUrl(activeBanners?.[0]?.bgImage)}
                                onError={() => setVideoError(true)}
                            >
                                <source src="/home.mp4" type="video/mp4" onError={() => setVideoError(true)} />
                                Your browser does not support the video tag.
                            </video>

                            <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10 pointer-events-none"></div>

                            <div className="relative z-20 flex w-full px-2 sm:px-0 mx-auto justify-center items-center h-full">
                                <div className="flex flex-col justify-center text-center space-y-3 sm:space-y-5 lg:space-y-7 p-0 sm:p-4 opacity-0 animate-fade-in-up-delay-1" style={{ animationFillMode: 'forwards' }}>

                                    <div className="inline-flex items-center self-center gap-2 sm:gap-3 px-1">
                                        <span className="w-6 sm:w-8 h-[1px] bg-white/60"></span>
                                        <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] font-medium text-white/90">
                                            Exclusive Collection
                                        </span>
                                        <span className="w-6 sm:w-8 h-[1px] bg-white/60"></span>
                                    </div>

                                    <h1 className="text-[20px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-2xl font-serif">
                                        Wear Confidence. Define Your Style.
                                    </h1>

                                    <p className="w-full text-[10px] sm:text-sm lg:text-base tracking-wide text-white/80 leading-relaxed font-light drop-shadow-md line-clamp-3 sm:line-clamp-none">
                                        Discover premium fashion designed for comfort, quality, and everyday confidence. From oversized streetwear to timeless essentials, explore collections crafted to elevate your wardrobe.
                                    </p>

                                    <div className="flex justify-center gap-2 sm:gap-5 pt-4 sm:pt-7 w-full sm:w-auto">
                                        <a
                                            href="/men"
                                            className="hero-btn opacity-0 animate-fade-in-up-delay-2 inline-flex items-center justify-center px-1 sm:px-7 py-1.5 sm:py-3.5 border border-white/80 text-white text-[7px] sm:text-xs md:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.18em] font-semibold transition-colors duration-500 hover:text-gray-900 cursor-pointer backdrop-blur-sm"
                                            style={{ animationFillMode: 'forwards' }}
                                        >
                                            <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                                Discover Men
                                                <svg className="hero-btn-arrow w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </a>
                                        <a
                                            href="/women"
                                            className="hero-btn hero-btn-filled opacity-0 animate-fade-in-up-delay-3 inline-flex items-center justify-center px-1 sm:px-7 py-1.5 sm:py-3.5 border border-white text-gray-900 text-[7px] sm:text-xs md:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.18em] font-semibold transition-colors duration-500 hover:text-white cursor-pointer"
                                            style={{ animationFillMode: 'forwards' }}
                                        >
                                            <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                                Discover Women
                                                <svg className="hero-btn-arrow w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </a>
                                        <a
                                            href="/kids"
                                            className="hero-btn opacity-0 animate-fade-in-up-delay-4 inline-flex items-center justify-center px-1 sm:px-7 py-1.5 sm:py-3.5 border border-white/80 text-white text-[7px] sm:text-xs md:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.18em] font-semibold transition-colors duration-500 hover:text-gray-900 cursor-pointer backdrop-blur-sm"
                                            style={{ animationFillMode: 'forwards' }}
                                        >
                                            <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                                Discover Kids
                                                <svg className="hero-btn-arrow w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (

                        <div className="relative z-30 w-full h-full">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 4000,
                                }}
                                loop={activeBanners && activeBanners.length > 1}
                                className="w-full h-full pb-8! sm:pb-0! [&_.swiper-pagination-bullet]:bg-white/60! [&_.swiper-pagination-bullet-active]:bg-white! [&_.swiper-pagination]:bottom-4! sm:[&_.swiper-pagination]:bottom-6!"
                            >
                                {activeBanners.map((banner, index) => (
                                    <SwiperSlide
                                        key={banner._id || index}
                                        id={index === 0 ? "hero" : `hero-${index}`}
                                        className="relative w-full h-full flex justify-center items-center group bg-cover bg-top bg-no-repeat"
                                        style={{ backgroundImage: `url(${getBannerImageUrl(banner?.bgImage)})` }}
                                    >
                                        <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-2/3 bg-linear-to-r from-black/80 via-black/60 to-transparent z-0 pointer-events-none transition-opacity duration-700"></div>
                                        <div className="home-slider flex relative z-10 w-full max-w-[92%] sm:max-w-[90%] lg:max-w-[80%] mx-auto justify-start items-center h-full py-10 sm:py-12">
                                            <div className="home-slider-content max-w-2xl flex flex-col justify-center text-left space-y-3 sm:space-y-5 lg:space-y-7 p-0 sm:p-4 opacity-0 animate-fade-in-up-delay-1" style={{ animationFillMode: 'forwards' }}>

                                                <div className="inline-flex items-center self-start gap-2 sm:gap-3 px-1">
                                                    <span className="w-6 sm:w-8 h-[1px] bg-white/60"></span>
                                                    <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] font-medium text-white/90">
                                                        Exclusive Collection
                                                    </span>
                                                </div>

                                                <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-2xl font-serif">
                                                    {banner?.title}
                                                </h1>

                                                <p className="w-full max-w-xl text-[12px] sm:text-sm lg:text-base tracking-wide text-white/80 leading-relaxed font-light drop-shadow-md line-clamp-3 sm:line-clamp-none">
                                                    {banner?.description}
                                                </p>

                                                <div className="flex flex-wrap gap-4 sm:gap-6 pt-3 sm:pt-6 w-full sm:w-auto">
                                                    <a href="#menu" className="relative w-fit whitespace-nowrap overflow-hidden group/btn inline-flex items-center justify-center px-7 sm:px-10 py-3 sm:py-4 border border-white bg-white text-black text-[11px] sm:text-xs md:text-[13px] lg:text-sm uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:bg-transparent hover:text-white cursor-pointer">
                                                        <span className="relative z-10">Discover Now</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}