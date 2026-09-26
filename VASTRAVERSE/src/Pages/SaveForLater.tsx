import { toast } from "sonner";
import { useGetSavedCart, useMoveCart, useRemoveCart } from "../Hooks/cart";

export const SaveForLater = () => {
    const { data: savedCartData, isLoading, refetch } = useGetSavedCart();
    const { mutateAsync: moveCartMutation } = useMoveCart();
    const { mutateAsync: removeCartMutation } = useRemoveCart();

    const totalItems = savedCartData?.length || 0;

    const subtotal = savedCartData?.reduce((acc: number, item: any) => {
        const itemDetail = item.items?.[0] || {};
        const price = itemDetail.discountPrice || itemDetail.basePrice || 0;
        return acc + (price * item.quantity);
    }, 0) || 0;

    const originalTotal = savedCartData?.reduce((acc: number, item: any) => {
        const itemDetail = item.items?.[0] || {};
        const price = itemDetail.basePrice || itemDetail.price || 0;
        return acc + (price * item.quantity);
    }, 0) || 0;

    const totalSaved = originalTotal - subtotal;

    const moveAllToCart = async () => {
        if (!savedCartData || savedCartData.length === 0) return;
        try {
            await Promise.all(savedCartData.map((item: any) => moveCartMutation(item._id)));
            refetch();
            toast.success("All items moved to cart", {
                duration: 1500
            });
        } catch (error) {
            console.error("Error moving to cart", error);
        }
    };

    const handleMoveToCart = async (id: string) => {
        await moveCartMutation(id);
        refetch();
    };

    const handleRemove = async (id: string) => {
        await removeCartMutation(id);
        refetch();
    };

    const handleClearAll = async () => {
        if (!savedCartData || savedCartData.length === 0) return;
        try {
            await Promise.all(savedCartData.map((item: any) => removeCartMutation(item._id)));
            refetch();
        } catch (error) {
            console.error("Error clearing saved items", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
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
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                            Reserved Archives
                        </span>
                        <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
                            Saved For <span className="italic font-serif font-normal">Later</span>
                        </h1>
                        <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                            {totalItems} {totalItems === 1 ? 'garment' : 'garments'} held in reservation for your consideration.
                        </p>
                    </div>
                    {totalItems > 0 && (
                        <button onClick={handleClearAll} className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-400 hover:text-rose-600 flex items-center gap-2 cursor-pointer transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Clear Archive
                        </button>
                    )}
                </div>

                {totalItems > 0 ? (
                    <>
                        <div className="bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-6 sm:mb-8 shadow-sm flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center justify-between">
                            <div className="flex flex-wrap justify-between gap-4 sm:gap-10 w-full md:w-auto">
                                <div>
                                    <p className="text-[8px] sm:text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Reserved</p>
                                    <p className="text-lg sm:text-2xl font-light text-neutral-900">{totalItems} Pieces</p>
                                </div>
                                <div>
                                    <p className="text-[8px] sm:text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Hold Value</p>
                                    <p className="text-lg sm:text-2xl font-light text-neutral-900">₹{subtotal.toLocaleString()}</p>
                                </div>
                                {totalSaved > 0 && (
                                    <div>
                                        <p className="text-[8px] sm:text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Privilege Savings</p>
                                        <p className="text-lg sm:text-2xl font-light text-neutral-900">₹{totalSaved.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 sm:gap-3 items-center w-full md:w-auto">
                                <button onClick={moveAllToCart} className="flex-1 md:flex-none bg-black hover:bg-neutral-800 text-white text-[9px] sm:text-xs font-medium uppercase tracking-[0.15em] px-4 py-3 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-full shadow-lg shadow-black/10 cursor-pointer transition-all hover:scale-105 flex justify-center items-center">
                                    Move All to Atelier Bag →
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 pb-24">
                            {savedCartData?.map((item: any) => {
                                const itemDetail = item.items?.[0] || {};
                                const price = itemDetail.discountPrice || itemDetail.basePrice || itemDetail.price || 0;
                                const basePrice = itemDetail.basePrice || itemDetail.price || 0;
                                const discountPercentage = basePrice > price ? Math.round(((basePrice - price) / basePrice) * 100) : 0;

                                return (
                                    <div key={item._id} className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm hover:shadow-xl hover:border-black/30 transition-all overflow-hidden flex flex-row p-3 sm:p-5 gap-3 sm:gap-6">
                                        <div className="relative w-24 sm:w-36 bg-neutral-100 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                                            <img src={itemDetail.images?.[0] || "https://via.placeholder.com/200"} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt={itemDetail.title || "Garment"} />
                                            {discountPercentage > 0 && (
                                                <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-black text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-full">-{discountPercentage}%</span>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <span className="text-[8px] sm:text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] block mb-0.5 sm:mb-1">{itemDetail.brand || "Vastraverse Atelier"}</span>
                                                <h3 className="editorial-text text-sm sm:text-lg font-light text-neutral-900 leading-snug line-clamp-1 mb-1 sm:mb-2">{itemDetail.title || "Premium Silhouette"}</h3>

                                                <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap mb-1 sm:mb-2">
                                                    <span className="text-sm sm:text-lg font-normal text-neutral-900">₹{price.toLocaleString()}</span>
                                                    {basePrice > price && (
                                                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-light">₹{basePrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                                                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md bg-neutral-100 text-neutral-700 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">
                                                        Size: {item.size}
                                                    </span>
                                                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md bg-neutral-100 text-neutral-700 text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">
                                                        Color: {item.color}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-2.5 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-neutral-100">
                                                <button onClick={() => handleMoveToCart(item._id)} className="flex-1 bg-neutral-100 hover:bg-black text-neutral-800 hover:text-white text-[9px] sm:text-xs font-medium uppercase tracking-[0.15em] px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all">
                                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    <span className="whitespace-nowrap">Move to Bag</span>
                                                </button>
                                                <button onClick={() => handleRemove(item._id)} className="p-2 sm:p-2.5 shrink-0 bg-neutral-50 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded-lg sm:rounded-xl cursor-pointer transition-colors" title="Remove">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-20 pb-24 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-16 max-w-2xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 mb-2">No archived pieces yet</h3>
                        <p className="text-neutral-400 max-w-sm mb-8 text-xs sm:text-sm font-light leading-relaxed">
                            When exploring collections, you may hold pieces in reserve here to review before completing your reservation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}