import { useAllBanner } from "../../Hooks/marketing";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import '../../App.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const HomeSlider = () => {

    const { data: Banner, isPending: bannerLoading } = useAllBanner();

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

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 4000,
                    }}
                    loop={Banner && Banner.length > 1}
                    className="w-full h-[55vh] sm:h-[70vh] md:h-[80vh] xl:h-[80vh]"
                >
                    {Banner?.map((banner, index) => (
                        <SwiperSlide
                            key={banner._id || index}
                            id={index === 0 ? "hero" : `hero-${index}`}
                            className="relative w-full h-full flex justify-center items-center bg-cover bg-[center_top] bg-no-repeat overflow-hidden group"
                            style={{ backgroundImage: `url(${banner?.bgImage?.replace(/\\/g, '/')})` }}
                        >

                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0 transition-opacity duration-700"></div>

                            <div className="home-slider flex relative z-10 w-full max-w-[90%] sm:max-w-[90%] lg:max-w-[80%] mx-auto justify-start items-center h-full py-12">

                                <div className="home-slider-content max-w-2xl flex flex-col justify-center text-left space-y-4 sm:space-y-6 lg:space-y-8 p-0 sm:p-4 opacity-0 animate-fade-in-up-delay-1" style={{ animationFillMode: 'forwards' }}>

                                    <div className="inline-flex items-center self-start gap-2 sm:gap-3 px-1">
                                        <span className="w-6 sm:w-8 h-[1px] bg-white/60"></span>
                                        <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[10px] font-medium text-white/90">
                                            Exclusive Collection
                                        </span>
                                    </div>

                                    <h1 className="text-[24px] sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-[1.1] sm:leading-[1.1] tracking-tight drop-shadow-2xl font-serif">
                                        {banner?.title}
                                    </h1>

                                    <p className="text-[10px] tracking-wider w-full sm:text-[14px] lg:text-[16px] text-white/80 leading-relaxed font-light max-w-xl drop-shadow-md">
                                        {banner?.description}
                                    </p>

                                    <div className="flex sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 w-full sm:w-auto">
                                        <a href="#menu" className="relative w-fit text-[10px] overflow-hidden group/btn inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 border border-white bg-white text-black text-xs sm:text-[10px] md:text-[12px] lg:text-[14px] uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:bg-transparent hover:text-white cursor-pointer sm:w-max">
                                            <span className="relative z-10">Discover Now</span>
                                        </a>
                                        <a href="#collection" className="relative w-fit text-[10px] overflow-hidden group/btn inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 border border-white/30 bg-black/20 backdrop-blur-sm text-white text-xs sm:text-[10px] md:text-[12px] lg:text-[14px] uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:bg-white hover:text-black cursor-pointer sm:w-max">
                                            <span className="relative z-10">View Gallery</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    )
}