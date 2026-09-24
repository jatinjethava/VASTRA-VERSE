import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useClearCart, useDecreaseCartQuantity, useGetCart, useIncreaseCartQuantity, useRemoveCart, useSaveForLater } from "../Hooks/cart";
import { clearCart, increaseCartQuantity, decreaseCartQuantity, removeFromCart } from "../Redux/cartSlice";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa6";
import { colorMap } from "../Components/Detail";
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Bookmark } from "lucide-react";

// Notes : if is guest user than fetch data from localstorage otherwise fetch from server

export const Cart = () => {
    const cart = useSelector((state: any) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: cartData, isLoading: cartLoading, isError: cartIsError, error: cartError, refetch: refetchCart } = useGetCart()
    const { mutate: increaseQuantityMutation } = useIncreaseCartQuantity()
    const { mutate: decreaseQuantityMutation } = useDecreaseCartQuantity()
    const { mutate: removeFromCartMutation } = useRemoveCart()
    const { mutateAsync: clearCartMutation } = useClearCart()
    const { mutateAsync: saveForLaterMutation } = useSaveForLater()

    const subtotal = cartData?.reduce((acc: number, item: any) => {
        const itemDetail = item.items?.[0] || {};
        const price = itemDetail.discountPrice || itemDetail.basePrice || 0;
        return acc + (price * item.quantity);
    }, 0) ?? 0;

    const shipping = subtotal > 1000 ? 0 : 99;
    const total = subtotal + shipping;

    const ClearCart = async () => {
        dispatch(clearCart());
        await clearCartMutation();
    }

    const SaveForLater = async () => {
        if (!cartData || cartData.length === 0) return;
        try {
            const itemToMove = cartData.filter((item: any) => item.status !== "save");
            if (!itemToMove || itemToMove.length === 0) return;
            await Promise.all(itemToMove.map((item: any) => saveForLaterMutation({ id: item._id })));
            dispatch(clearCart());
            refetchCart();
            toast.success("All items save for later", {
                duration: 1500
            });
        } catch (error) {
            console.error("Error saving cart for later", error);
        }
    }

    const shareCart = () => {
        if (!cartData?.length) return;

        const lines = [];

        lines.push("🛒 *My Cart Summary*\n");

        cartData.forEach((item: any) => {
            const product = item?.items?.[0] || {};
            const name = product?.name || "Product";
            const price = product?.discountPrice || product?.basePrice || 0;
            const qty = item?.quantity || 1;
            const totalItemPrice = price * qty;

            lines.push(
                `• ${name}\n   Qty: ${qty} × ₹${price} = *₹${totalItemPrice}*`
            );
        });

        lines.push("\n--------------------");
        lines.push(`💰 *Grand Total: ₹${total}*`);
        lines.push("\nThank you for shopping with us 🙌");

        const message = lines.join("\n");

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative bg-[#fafafa]">

            {/* Editorial Page Header */}
            <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-14 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/15 bg-black/[0.03] text-black/80 rounded-full text-[10px] tracking-[0.25em] uppercase font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/70 animate-pulse" />
                    Atelier Bag & Reservations
                </div>
                <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight leading-[1.1]">
                    Shopping <span className="italic font-serif font-normal">Bag</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
                    Review your reserved bespoke drops and curated garments before proceeding to authenticated checkout.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                {/* Left Column: Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center bg-white py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-2">
                        <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">Reserved Items</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black text-white font-mono font-bold">
                                {cartData?.length || 0}
                            </span>
                        </div>
                        {(cartData?.length ?? 0) > 0 && (
                            <button
                                onClick={ClearCart}
                                className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {cartData?.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-10 sm:p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-5 border border-neutral-200/60">
                                <ShoppingBag className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="editorial-text text-xl sm:text-2xl font-light text-black mb-2 tracking-tight">Your bag is empty</h3>
                            <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-sm mb-7 leading-relaxed">
                                No bespoke garments or limited archival pieces are currently reserved in your atelier bag.
                            </p>
                            <Link to="/men">
                                <button className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer">
                                    Explore Collection
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 relative">
                                {cartData?.map((item: any, index: number) => {
                                    const itemDetail = item.items?.[0] || {};
                                    const name = itemDetail.name || "Bespoke Garment";
                                    const images = itemDetail.images || ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"];
                                    const price = itemDetail.discountPrice || itemDetail.basePrice || 0;

                                    return (
                                        <div
                                            key={item._id || index}
                                            className="group relative flex flex-row bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-neutral-200/80 hover:border-black/25 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md gap-4 sm:gap-6 items-stretch transition-all duration-300"
                                        >
                                            {/* Specular hairline top accent */}
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent pointer-events-none" />

                                            {/* Product Image */}
                                            <div className="w-24 sm:w-32 h-28 sm:h-32 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/60 relative">
                                                <img
                                                    src={images[0]}
                                                    alt={name}
                                                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                                />
                                            </div>

                                            {/* Details & Actions */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div className="pr-2 truncate">
                                                            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-0.5">
                                                                Archival Edition
                                                            </span>
                                                            <h3 className="editorial-text font-normal text-black text-sm sm:text-lg leading-tight truncate">
                                                                {name}
                                                            </h3>
                                                        </div>
                                                        <button
                                                            onClick={() => { removeFromCartMutation(item._id); refetchCart(); dispatch(removeFromCart(item._id)) }}
                                                            title="Remove Item"
                                                            className="text-neutral-400 hover:text-black transition-colors p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer shrink-0"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Attributes Pills */}
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-600">
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200/60">
                                                            <span className="text-neutral-400">Size:</span>
                                                            <span className="font-semibold text-black">{item.size || 'L'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200/60">
                                                            <span className="text-neutral-400">Color:</span>
                                                            <div className="flex items-center gap-1">
                                                                <span
                                                                    className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-sm block"
                                                                    style={{ backgroundColor: item.color ? (colorMap[item.color] || item.color) : '#fff' }}
                                                                />
                                                                <span className="text-black font-semibold">{item.color || 'Noir'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stepper & Price Row */}
                                                <div className="flex justify-between items-end mt-3 pt-2.5 border-t border-neutral-100">
                                                    <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden h-7 sm:h-8">
                                                        <button
                                                            onClick={() => { decreaseQuantityMutation(item._id); refetchCart(); dispatch(decreaseCartQuantity(item._id)) }}
                                                            className="w-7 sm:w-8 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors cursor-pointer"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-7 sm:w-9 text-center text-xs font-mono font-semibold text-black select-none">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => { increaseQuantityMutation(item._id); refetchCart(); dispatch(increaseCartQuantity(item._id)) }}
                                                            className="w-7 sm:w-8 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors cursor-pointer"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-mono font-medium text-black text-sm sm:text-lg tracking-tight">
                                                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {cartData && cartData.length > 0 && (
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                                        <button
                                            onClick={() => SaveForLater()}
                                            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors cursor-pointer"
                                        >
                                            <Bookmark className="w-3.5 h-3.5" />
                                            <span>Save All For Later</span>
                                        </button>

                                        <button
                                            onClick={shareCart}
                                            disabled={!cartData?.length}
                                            className="group relative flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
                                        >
                                            <FaWhatsapp className="text-emerald-400 text-sm group-hover:scale-110 transition-transform" />
                                            <span>Share Bag Summary</span>
                                        </button>
                                    </div>
                                )}

                                {cartLoading && (
                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-3xl">
                                        <div className="dot-spinner" />
                                    </div>
                                )}

                                {cartIsError && (
                                    <div className="p-6 bg-neutral-100 rounded-2xl text-center border border-neutral-200">
                                        <p className="text-neutral-600 text-xs font-mono mb-3">{cartError?.message || "Failed to load cart"}</p>
                                        <button
                                            onClick={() => { dispatch(clearCart()); refetchCart() }}
                                            className="text-xs font-mono uppercase tracking-widest text-black underline underline-offset-4 cursor-pointer"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Obsidian Luxury Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-b from-[#0c0c0d] via-[#070708] to-black text-white p-6 sm:p-7 rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sticky top-24 relative overflow-hidden">

                        {/* Top specular hairline */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                            <h3 className="editorial-text text-sm sm:text-base font-light text-white tracking-[0.15em] uppercase">
                                Order Summary
                            </h3>
                            <span className="text-[8px] font-mono px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/15">
                                Verified
                            </span>
                        </div>

                        <div className="space-y-4 text-xs font-light text-neutral-300">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Subtotal</span>
                                <span className="font-mono text-white font-medium text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-neutral-400">White-Glove Courier</span>
                                </div>
                                <span className="font-mono text-white font-medium text-sm">
                                    {shipping > 0 ? `₹${shipping}` : <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider">Complimentary</span>}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Customs & Archival Duty</span>
                                <span className="text-neutral-400 text-[11px] font-mono">Calculated at checkout</span>
                            </div>

                            <div className="h-px bg-white/10 my-4" />

                            <div className="flex justify-between items-baseline pt-1">
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
                                        Estimated Total
                                    </span>
                                    <span className="text-[9px] text-neutral-500 font-mono">Inclusive of all local privileges</span>
                                </div>
                                <span className="text-xl sm:text-2xl font-mono font-medium text-white tracking-tight">
                                    ₹{total.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <button
                            disabled={cart.length === 0}
                            onClick={() => navigate('/checkout')}
                            className={`w-full mt-7 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md ${cart.length > 0
                                ? "bg-white text-black hover:bg-neutral-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.01] cursor-pointer"
                                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                }`}
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
                            <span>Encrypted 256-Bit Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};