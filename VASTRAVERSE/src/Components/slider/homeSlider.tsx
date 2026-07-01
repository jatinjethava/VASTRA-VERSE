import { useState } from "react";
import { useAllBanner } from "../../Hooks/marketing";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import '../../App.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const HomeSlider = () => {

    const { data: Banner, isPending: bannerLoading } = useAllBanner();

    const hasVideo = true;
    const [videoError, setVideoError] = useState(false);

    if (!bannerLoading && (!Banner || Banner.length === 0)) {
        return null;
    }

    return (
        <>
            {bannerLoading ? (
                <section id="hero" className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 min-h-[80vh]">
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                                poster={Banner?.[0]?.bgImage?.replace(/\\/g, '/')}
                                onError={() => setVideoError(true)}
                            >
                                <source src="/home.mp4" type="video/mp4" onError={() => setVideoError(true)} />
                                Your browser does not support the video tag.
                            </video>

                            <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10 pointer-events-none"></div>

                            <div className="relative z-20 flex w-full max-w-[92%] sm:max-w-[90%] lg:max-w-[80%] mx-auto justify-start items-center h-full py-10 sm:py-12">
                                <div className="max-w-2xl flex flex-col justify-center text-left space-y-3 sm:space-y-5 lg:space-y-7 p-0 sm:p-4 opacity-0 animate-fade-in-up-delay-1" style={{ animationFillMode: 'forwards' }}>

                                    <div className="inline-flex items-center self-start gap-2 sm:gap-3 px-1">
                                        <span className="w-6 sm:w-8 h-[1px] bg-white/60"></span>
                                        <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] font-medium text-white/90">
                                            Exclusive Collection
                                        </span>
                                    </div>

                                    <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-2xl font-serif">
                                        {Banner?.[0]?.title || 'Discover Your Style'}
                                    </h1>

                                    <p className="w-full max-w-xl text-[12px] sm:text-sm lg:text-base tracking-wide text-white/80 leading-relaxed font-light drop-shadow-md line-clamp-3 sm:line-clamp-none">
                                        {Banner?.[0]?.description || 'Explore our latest collection of premium fashion.'}
                                    </p>

                                    <div className="flex flex-wrap gap-4 sm:gap-6 pt-3 sm:pt-6 w-full sm:w-auto">
                                        <a href="#menu" className="relative w-fit whitespace-nowrap overflow-hidden group/btn inline-flex items-center justify-center px-7 sm:px-10 py-3 sm:py-4 border border-white bg-white text-black text-[11px] sm:text-xs md:text-[13px] lg:text-sm uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:bg-transparent hover:text-white cursor-pointer">
                                            <span className="relative z-10">Discover Now</span>
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
                                loop={Banner && Banner.length > 1}
                                className="w-full h-full !pb-8 sm:!pb-0 [&_.swiper-pagination-bullet]:!bg-white/60 [&_.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination]:!bottom-4 sm:[&_.swiper-pagination]:!bottom-6"
                            >
                                {Banner?.map((banner, index) => (
                                    <SwiperSlide
                                        key={banner._id || index}
                                        id={index === 0 ? "hero" : `hero-${index}`}
                                        className="relative w-full h-full flex justify-center items-center group bg-cover bg-center bg-no-repeat"
                                        style={{ backgroundImage: `url(${banner?.bgImage?.replace(/\\/g, '/')})` }}
                                    >
                                        <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-0 pointer-events-none transition-opacity duration-700"></div>
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