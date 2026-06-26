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
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-6 relative min-h-[80vh]">
            <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
                <div className="flex items-end justify-between flex-wrap gap-3">
                    <div>
                        <p className="text-[9px] sm:text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">Your Collection</p>
                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-800">Saved for Later</h1>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">{totalItems} items waiting for you</p>
                    </div>
                    {totalItems > 0 && (
                        <button onClick={handleClearAll} className="text-xs sm:text-sm text-gray-400 hover:text-rose-500 flex items-center gap-1.5 font-medium cursor-pointer transition-colors">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {totalItems > 0 ? (
                <>
                    <div className="max-w-6xl mx-auto px-4 mb-6 sm:mb-8">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center justify-between">
                            <div className="flex flex-wrap justify-between gap-4 sm:gap-8 w-full md:w-auto">
                                <div>
                                    <p className="text-[8px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">Items Saved</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-700">{totalItems}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Value</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-700">₹{subtotal.toLocaleString()}</p>
                                </div>
                                {totalSaved > 0 && (
                                    <div>
                                        <p className="text-[8px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">You Save</p>
                                        <p className="text-lg sm:text-xl font-bold text-emerald-600">₹{totalSaved.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 sm:gap-3 items-center w-full md:w-auto">
                                <button className="flex-1 md:flex-none border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex justify-center items-center gap-1 sm:gap-2 cursor-pointer transition-colors">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    Share
                                </button>
                                <button onClick={moveAllToCart} className="flex-1 md:flex-none bg-gray-800 hover:bg-gray-900 text-white text-[10px] sm:text-sm font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md shadow-gray-200 cursor-pointer transition-colors flex justify-center items-center">
                                    Move All to Cart →
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 pb-24">
                        {savedCartData?.map((item: any) => {
                            const itemDetail = item.items?.[0] || {};
                            const price = itemDetail.discountPrice || itemDetail.basePrice || itemDetail.price || 0;
                            const basePrice = itemDetail.basePrice || itemDetail.price || 0;
                            const discountPercentage = basePrice > price ? Math.round(((basePrice - price) / basePrice) * 100) : 0;

                            return (
                                <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-row">
                                    <div className="relative w-28 sm:w-36 bg-slate-50 flex items-center justify-center p-2 sm:p-3 shrink-0">
                                        <img src={itemDetail.images?.[0] || "https://via.placeholder.com/200"} className="w-full h-full object-cover rounded-xl" alt={itemDetail.title || "Product"} />
                                        {discountPercentage > 0 && (
                                            <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-rose-500 tracking-wide text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">-{discountPercentage}%</span>
                                        )}
                                    </div>
                                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mb-0.5 tracking-wider">{itemDetail.brand || "Vastra Verse"}</p>
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 mb-1 sm:mb-2 tracking-wider">{itemDetail.title || "Premium Product"}</h3>

                                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                                                <span className="text-sm sm:text-lg font-extrabold text-slate-900">₹{price.toLocaleString()}</span>
                                                {basePrice > price && (
                                                    <span className="text-[10px] sm:text-sm text-slate-400 line-through">₹{basePrice.toLocaleString()}</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1 tracking-wider">Size: {item.size} · Color: {item.color}</p>
                                            <p className="text-[10px] sm:text-xs text-slate-400">Added on {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                            <button onClick={() => handleMoveToCart(item._id)} className="flex-1 border border-gray-400 tracking-wide text-gray-700 hover:text-white hover:bg-gray-700 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-colors">
                                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                <span className="truncate">Move to Cart</span>
                                            </button>
                                            <button onClick={() => handleRemove(item._id)} className="p-1.5 sm:p-2 shrink-0 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer transition-colors" title="Remove">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <p className="text-sm text-slate-600 lg:col-span-2"><span className="font-bold text-slate-900">{totalItems}</span> items saved</p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center pt-20 pb-24 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No saved items yet</h3>
                    <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
                        When you see something you like but aren't quite ready to buy, save it here to keep track of it.
                    </p>
                </div>
            )}
        </div>
    );
}