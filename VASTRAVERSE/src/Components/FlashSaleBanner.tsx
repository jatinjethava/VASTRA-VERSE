import { useState, useEffect } from 'react';
import '../App.css'

interface FlashSaleProps {
    flashSales: any[];
}

export const FlashSaleBanner = ({ flashSales }: FlashSaleProps) => {
    const activeSale = flashSales && flashSales.length > 0 ? flashSales[0] : null;

    const calculateTimeLeft = (endDate: string) => {
        const difference = new Date(endDate).getTime() - new Date().getTime();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(activeSale ? calculateTimeLeft(activeSale.endDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!activeSale) return;

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(activeSale.endDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [activeSale]);

    if (!activeSale || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
        return null;
    }

    return (
        <section className="bg-white text-gray-900 py-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-y border-gray-100 z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 via-white to-orange-50/50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col items-center sm:flex-row px-4 sm:px-6 lg:px-8 xl:px-8 relative z-10 justify-between gap-4">

                <div className="flex flex-col sm:flex-row items-center gap-3 md:flex-row text-center sm:text-left  xl:text-left">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.15)] border border-red-100 text-red-500 text-3xl animate-pulse">
                        <img src={activeSale?.image} className="h-full w-full rounded-full" alt="" />
                    </div>
                    <div className='lg:text-start'>
                        <div className="text-[8px] md:text-[10px] lg:text-[10px] inline-block bg-red-100 text-red-600 font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-red-200 shadow-sm">
                            Flash Sale Live
                        </div>
                        <h2 className="text-sm md:text-2xl lg:text-[25px] xl:text-3xl font-black uppercase tracking-tight text-gray-800 drop-shadow-sm mb-2 leading-none">
                            {activeSale.name}
                        </h2>
                        <p className="text-xs md:text-base lg:text-[15px] xl:text-[15px] font-medium text-gray-500 max-w-lg mx-auto xl:mx-0">
                            {activeSale.description || "Hurry up! Limited stock available at unbeatable prices."}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col items-center sm:items-start gap-4 bg-white p-4 border border-gray-100 shadow-sm">
                        <div className="text-xs sm:text-start md:text-[10px] lg:text-[12px] xl:text-[15px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            Ends In
                        </div>
                        <div className="flex items-center gap-1 md:gap-4">
                            <div className="flex flex-col items-center justify-center w-14 h-16 md:w-16 md:h-20 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm md:text-xl lg:text-[20px] xl:text-2xl font-black text-gray-800">{timeLeft.days.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] md:text-[10px] lg:text-[10px] xl:text-[12px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Days</span>
                            </div>
                            <span className="text-xl md:text-2xl lg:text-[20px] xl:text-2xl font-black text-gray-300 animate-pulse">:</span>
                            <div className="flex flex-col items-center justify-center w-14 h-16 md:w-16 md:h-20 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm md:text-xl lg:text-[20px] xl:text-2xl font-black text-gray-800">{timeLeft.hours.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] md:text-[10px] lg:text-[10px] xl:text-[12px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Hrs</span>
                            </div>
                            <span className="text-xl md:text-2xl lg:text-[20px] xl:text-2xl font-black text-gray-300 animate-pulse">:</span>
                            <div className="flex flex-col items-center justify-center w-14 h-16 md:w-16 md:h-20 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm md:text-xl lg:text-[20px] xl:text-2xl font-black text-gray-800">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] md:text-[10px] lg:text-[10px] xl:text-[12px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">Min</span>
                            </div>
                            <span className="text-xl md:text-2xl lg:text-[20px] xl:text-2xl font-black text-gray-300 animate-pulse">:</span>
                            <div className="flex flex-col items-center justify-center w-14 h-16 md:w-16 md:h-20 bg-red-50 rounded-lg border border-red-100 shadow-sm">
                                <span className="text-sm md:text-2xl lg:text-[20px] xl:text-3xl font-black text-red-600">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-red-400 mt-0.5">Sec</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center mt-2 xl:mt-0">
                        <a href="#menu" className="block text-[10px] sm:text-[8px] sm:p-2 sm:absolute sm:top-2 sm:right-10 sm:rounded-2xl sm:bg-white sm:shadow-none sm:text-gray-800 w-fit text-center lg:pulse-glow-btn bg-gray-900 text-white font-extrabold md:text-[12px] lg:text-[12px] xl:text-[15px] uppercase tracking-widest px-6 py-4 hover:bg-gray-800 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                            Shop {activeSale.discountValue}{activeSale.discountType === 'percentage' ? '%' : '₹'} OFF
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};
