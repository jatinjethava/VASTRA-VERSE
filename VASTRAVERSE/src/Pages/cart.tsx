import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useClearCart, useDecreaseCartQuantity, useGetCart, useIncreaseCartQuantity, useRemoveCart, useSaveForLater } from "../Hooks/cart";
import { clearCart, increaseCartQuantity, decreaseCartQuantity, removeFromCart } from "../Redux/cartSlice";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa6";

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
    }, 0);

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
        <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative bg-gray-50/50">

            <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Selection</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-500 tracking-tight">SHOPPING <span className="text-gray-800">CART</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-medium leading-relaxed px-4">
                    Review your items and proceed to checkout to secure your premium drops.
                </p>
                <div className="w-12 sm:w-16 h-1 bg-gray-900 mx-auto rounded-full mt-4 sm:mt-6"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center bg-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-2">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
                            {cartData?.length} {cartData?.length === 1 ? 'Item' : 'Items'}
                        </h2>
                        {cartData?.length > 0 && (
                            <button
                                onClick={ClearCart}
                                className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer">
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {cartData?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h3>
                            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-6">Looks like you haven't added any premium streetwear yet.</p>
                            <Link to="/men">
                                <button className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-gray-800 transition-all shadow-md shadow-gray-900/10 cursor-pointer">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (

                        <>
                            <div className="space-y-4 relative">
                                {cartData?.map((item: any, index: number) => {
                                    const itemDetail = item.items?.[0] || {};
                                    const name = itemDetail.name || "Premium Streetwear";
                                    const images = itemDetail.images || ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"];
                                    const price = itemDetail.discountPrice || itemDetail.basePrice || 0;

                                    return (
                                        <div key={item._id || index} className="flex flex-row bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] gap-3 sm:gap-6 items-stretch">
                                            <div className="w-24 sm:w-32 h-28 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 group">
                                                <img src={images[0]} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div className="pr-2 truncate">
                                                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1 block">Streetwear</span>
                                                            <h3 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight truncate">{name}</h3>
                                                        </div>
                                                        <button
                                                            onClick={() => { removeFromCartMutation(item._id); refetchCart(); dispatch(removeFromCart(item._id)) }}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 sm:p-1.5 hover:bg-red-50 rounded-lg cursor-pointer shrink-0">
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                                            <span>Size:</span>
                                                            <span className="bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded text-gray-900">{item.size || 'L'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                                            <span>Color:</span>
                                                            <div className="flex items-center gap-1">
                                                                <span
                                                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-200 shadow-sm block"
                                                                    style={{ backgroundColor: item.color || '#fff' }}
                                                                />
                                                                <span className="text-gray-900 hidden sm:inline">{item.color || 'White'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end mt-2 sm:mt-0 pt-2 border-t border-gray-50 sm:border-0 sm:pt-0">
                                                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden h-7 sm:h-8">
                                                        <button
                                                            onClick={() => { decreaseQuantityMutation(item._id); refetchCart(); dispatch(decreaseCartQuantity(item._id)) }}
                                                            className="w-7 sm:w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all font-medium cursor-pointer">−</button>
                                                        <span className="w-6 sm:w-8 text-center text-[10px] sm:text-xs font-bold text-gray-900 select-none">{item.quantity}</span>
                                                        <button
                                                            onClick={() => { increaseQuantityMutation(item._id); refetchCart(); dispatch(increaseCartQuantity(item._id)) }}
                                                            className="w-7 sm:w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all font-medium cursor-pointer">+</button>
                                                    </div>
                                                    <p className="font-extrabold text-gray-900 text-sm sm:text-lg">₹{price * item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {cartData && cartData.length > 0 && (
                                    <div className="flex justify-between items-center mt-6">
                                        <button
                                            onClick={() => SaveForLater()}
                                            className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer">
                                            Save for later
                                        </button>

                                        <button
                                            onClick={shareCart}
                                            disabled={!cartData?.length}
                                            className="group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#25D366] text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaWhatsapp className="text-sm sm:text-base md:text-lg group-hover:rotate-12 transition-transform duration-200" />

                                            <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider">Share Cart</span>
                                            <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />
                                        </button>
                                    </div>
                                )}

                                {cartLoading && (
                                    <div className="absolute top-40 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-black/30">
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

                                {cartIsError && (
                                    <div className="absolute top-40 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-black/30">
                                        <div className="bg-white p-4 rounded-md text-center">
                                            <p className="text-gray-500 font-medium mb-2">{cartError?.message}</p>
                                            <button onClick={() => { dispatch(clearCart()); refetchCart() }} className="text-sm font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer">
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sticky top-24">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 uppercase tracking-wide mb-5 sm:mb-6">Order Summary</h3>

                        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium text-gray-500">
                            <div className="flex justify-between items-center">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-bold">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Shipping estimate</span>
                                <span className="text-gray-900 font-bold">{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Tax estimate</span>
                                <span className="text-gray-900 font-bold">Calculated at checkout</span>
                            </div>

                            <div className="h-px bg-gray-100 my-3 sm:my-4" />

                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="font-bold text-gray-900 uppercase tracking-wider">Total</span>
                                <span className="text-base sm:text-xl font-extrabold text-gray-900">₹{total}</span>
                            </div>
                        </div>

                        <button
                            disabled={cart.length === 0}
                            onClick={() => navigate('/checkout')}
                            className={`w-full mt-6 sm:mt-8 py-3 sm:py-3.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${cart.length > 0
                                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/10 cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-emerald-600">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};