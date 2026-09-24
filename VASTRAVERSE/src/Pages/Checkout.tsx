import { useEffect, useState } from "react"
import '../index.css'
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrder } from "../Hooks/order";
import { useGetCart, useRemoveCart, useApplyDiscountCode } from "../Hooks/cart";
import { toast } from "sonner";
import { removeFromCart } from '../Redux/cartSlice'
import { useNavigate } from "react-router";
import { useCreatePaymentOrder, useFailReason, useVerifyPayment } from "../Hooks/payment";
import ReactGA from "react-ga4";
import { useGetDefaultAddress, useGetAllAddresses } from "../Hooks/user"


export const Checkout = () => {

    useEffect(() => {
        document.title = "Checkout | Vastra Verse";
    }, []);

    const navigate = useNavigate();
    const { mutateAsync: createUserOrder, isPending: userOrderPending } = useCreateOrder();
    const { data: userCart, isLoading: userCartLoading, error: userCartError, refetch: refetchCart } = useGetCart();
    const { mutate: removeFromCartMutation } = useRemoveCart()
    const { mutate: applyCouponMutation, isPending: applyCouponPending } = useApplyDiscountCode()
    const { mutateAsync: createPaymentOrder } = useCreatePaymentOrder();
    const { mutateAsync: verifyPaymentMutation } = useVerifyPayment();
    const { mutateAsync: paymentFaildReason } = useFailReason();
    const { data: defaultAddress } = useGetDefaultAddress();
    const { data: allAddress } = useGetAllAddresses();

    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();

    const [payment, serPayment] = useState(false);
    const [order, setOrder] = useState<any>({
        fullName: user?.name,
        email: user?.email,
        phone: null,
        addressId: defaultAddress?._id || null,
        addressLine1: defaultAddress?.addressLine1 || "",
        addressLine2: defaultAddress?.addressLine2 || "",
        city: defaultAddress?.city || "",
        state: defaultAddress?.state || "",
        country: defaultAddress?.country || "",
        pincode: defaultAddress?.pincode || null,
        isAgree: null,
    });

    useEffect(() => {
        if (defaultAddress) {
            setOrder((prev: any) => ({
                ...prev,
                addressId: defaultAddress._id,
                addressLine1: defaultAddress.addressLine1 || "",
                addressLine2: defaultAddress.addressLine2 || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                country: defaultAddress.country || "",
                pincode: defaultAddress.pincode || null,
            }));
        }
    }, [defaultAddress]);

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" ? e.target.checked : undefined;
        const newValue = type === "checkbox" ? checked : value;

        setOrder({
            ...order,
            [name]: newValue,
        });
    }

    const gst: number = 18;
    const subtotal = userCart?.reduce((acc: number, item: any) => {
        const itemDetail = item.items?.[0] || {};
        const price = itemDetail.discountPrice || itemDetail.basePrice || 0;
        return acc + (price * item.quantity);
    }, 0) || 0;
    const shipping = subtotal > 1000 ? 0 : 99;
    const gstAmount = subtotal * (gst / 100);
    const discount = (userCart?.[0]?.discountAmount || 0);
    const total = Math.ceil(subtotal + shipping + gstAmount - discount);

    const resetForm = () => {
        setOrder({
            fullName: "",
            email: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            isAgree: null,
        });
    };

    const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {

            const orderPayload = {
                items: (userCart || []).map((cart: any) => {
                    const product = cart.items?.[0] || {};
                    return {
                        productId: cart.productId,
                        title: product.title || product.name,
                        color: cart.color,
                        size: cart.size,
                        quantity: cart.quantity,
                        discountPrice: product.discountPrice || product.basePrice,
                    };
                }),
                shippingAddress: {
                    fullName: order.fullName,
                    email: order.email,
                    phone: Number(order.phone),
                    addressLine1: order.addressLine1,
                    addressLine2: order.addressLine2,
                    city: order.city,
                    state: order.state,
                    country: order.country,
                    pincode: Number(order.pincode),
                },
                paymentMethod: payment ? "razorpay" : "cod",
                subtotal: subtotal,
                shippingFee: shipping,
                totalAmount: total,
                totalItems: userCart?.length || 0,
                discount: discount,
                gst: gst,
                gstAmount: gstAmount,
                isAgree: order.isAgree,
            };


            const res = await createUserOrder(orderPayload as any);
            console.log("Res : ", res)
            if (orderPayload.paymentMethod === "cod") {
                resetForm();
                refetchCart();
                setTimeout(() => {
                    navigate('/order-list');
                }, 2000);
                return;
            }

            const payRes = await createPaymentOrder({
                orderId: res.data.order._id,
                amount: total,
                currency: "INR",
            });

            const payData = payRes.data;
            const rzpOrder = payData.razorpayOrder;

            const rzpKey = import.meta.env.VITE_RAZORPAY_TEST_APIKEY;
            if (!rzpKey) {
                toast.error("Razorpay API key is missing. Please check your .env file and restart the server.", { duration: 3000 });
                return;
            }

            const options: any = {
                key: rzpKey,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || "INR",
                name: "Vastra Verse",
                description: "Payment for order",
                image: `${window.location.origin}/vastraverse.png`,
                order_id: rzpOrder.id,
                handler: async (response: any) => {
                    try {
                        await verifyPaymentMutation({
                            orderId: res.data.order._id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        toast.success("Payment verified successfully!", { duration: 1500 });
                        resetForm();
                        refetchCart();
                        setTimeout(() => {
                            navigate('/order-list');
                        }, 2000);
                    } catch (err: any) {
                        toast.error(err.message || "Payment verification failed", { duration: 2000 });
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: order.phone,
                },
                notes: {
                    address: order.addressLine1,
                },
                theme: {
                    color: "#181818",
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled. Your order is saved — you can retry from My Orders.", { duration: 3000 });
                        refetchCart();
                        navigate('/order-list');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async (response: any) => {
                toast.error(response.error.description || "Payment failed", { duration: 2000 });
                await paymentFaildReason(response.error.description);
            });
            rzp.open();

            ReactGA.event({
                category: "Checkout",
                action: "Initiate Payment",
            });

        } catch (error: any) {
            toast.error(error.message || "Something went wrong", {
                duration: 2000
            })

            ReactGA.event({
                category: "Error",
                action: "Payment Failed",
                label: error?.message || "Unknown Error",
            });
        }
    }

    const [apply, setApply] = useState<boolean>(false);
    const [coupon, setCoupon] = useState<string>("");
    const applyCoupon = () => {
        try {
            applyCouponMutation({ id: userCart?.[0]?._id as string, coupon: coupon });
            refetchCart();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", {
                duration: 2000
            })
        }
    }

    const handleAddressChange = (e: any) => {
        const { value, checked } = e.target;
        if (checked) {
            const selectedAddress = allAddress?.find((address: any) => address._id === value);
            setOrder((prev: any) => ({
                ...prev,
                addressId: value,
                mobileNumber: selectedAddress?.mobileNumber,
                addressLine1: selectedAddress?.addressLine1,
                addressLine2: selectedAddress?.addressLine2,
                city: selectedAddress?.city,
                state: selectedAddress?.state,
                country: selectedAddress?.country,
                pincode: selectedAddress?.pincode,
            }));
        }
    }

    return (
        <>
            <div className="min-h-screen bg-[#fafafa] py-10 sm:py-16 relative flex justify-center items-start">
                <div className="flex flex-col lg:flex-row w-[95%] sm:w-[90%] max-w-7xl mx-auto gap-8 lg:gap-10">
                    <form onSubmit={handleOrderSubmit} className="w-full lg:w-2/3 relative bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-sm overflow-hidden">

                        {/* Top specular hairline */}
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                        <div className="mb-8">
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                Concierge Finalization
                            </span>
                            <h1 className="editorial-text text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight">
                                Atelier <span className="italic font-serif font-normal">Checkout</span>
                            </h1>
                            <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">
                                Confirm destination coordinates and complete your luxury garment reservation.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em]">Shipping Coordinates</p>
                                {allAddress && allAddress.length > 0 && (
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-light">Saved Presets Available</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full name"
                                        name="fullName"
                                        value={order.fullName ?? ""}
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Email Address</label>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        name="email"
                                        value={order.email ?? ""}
                                        readOnly
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-100 font-medium text-neutral-600 transition-all cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="Mobile contact number"
                                    name="phone"
                                    required
                                    value={order.phone}
                                    onChange={handleOrderChange}
                                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                />
                            </div>

                            {allAddress && allAddress.length > 0 && (
                                <div className="my-2">
                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2 block">Select Saved Preset</span>
                                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                        {allAddress?.map((address: any) => (
                                            <label
                                                key={address._id}
                                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${order.addressId === address._id
                                                    ? 'border-black bg-black text-white shadow-sm'
                                                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    onChange={handleAddressChange}
                                                    checked={order.addressId === address._id}
                                                    className="sr-only"
                                                />
                                                <span className="capitalize">{address.label || "Address"}</span>
                                                <span className={`text-[10px] opacity-75 ${order.addressId === address._id ? 'text-white' : 'text-neutral-400'}`}>({address.city})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Address Line 1</label>
                                <input
                                    type="text"
                                    placeholder="Street address, building, suite"
                                    name="addressLine1"
                                    required
                                    value={order.addressLine1}
                                    onChange={handleOrderChange}
                                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Apartment, unit, floor"
                                    name="addressLine2"
                                    value={order.addressLine2}
                                    onChange={handleOrderChange}
                                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">City</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        name="city"
                                        required
                                        value={order.city}
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">State</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        required
                                        value={order.state}
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        name="country"
                                        required
                                        value={order.country}
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="6-digit postal code"
                                        name="pincode"
                                        maxLength={6}
                                        required
                                        value={order.pincode}
                                        onChange={handleOrderChange}
                                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium text-neutral-900 transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-100">
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] block mb-3">Settlement Method</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${!payment ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 bg-white hover:border-neutral-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        className="accent-black w-4 h-4"
                                        onClick={() => serPayment(false)}
                                        onChange={handleOrderChange}
                                    />
                                    <div>
                                        <span className="text-xs sm:text-sm font-medium text-neutral-900 block">Cash on Delivery</span>
                                        <span className="text-[10px] text-neutral-400 font-light">Pay upon doorstep receipt</span>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${payment ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 bg-white hover:border-neutral-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        className="accent-black w-4 h-4"
                                        onClick={() => serPayment(true)}
                                        onChange={handleOrderChange}
                                    />
                                    <div>
                                        <span className="text-xs sm:text-sm font-medium text-neutral-900 block">Razorpay Concierge</span>
                                        <span className="text-[10px] text-neutral-400 font-light">Cards, UPI & NetBanking</span>
                                    </div>
                                </label>
                            </div>

                            {payment && (
                                <button
                                    type="button"
                                    onClick={handleOrderSubmit}
                                    disabled={userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode}
                                    className={`w-full bg-black text-white py-3.5 px-6 rounded-full mt-5 text-xs font-medium uppercase tracking-[0.15em] transition shadow-lg shadow-black/10 ${userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800 hover:scale-[1.01] cursor-pointer"}`}
                                >
                                    PROCEED TO SECURE PAYMENT <span className="ml-1">→</span>
                                </button>
                            )}
                        </div>

                        {userOrderPending && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
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
                    </form>

                    {/* Obsidian Order Summary Card */}
                    <div className="w-full lg:w-1/3 lg:sticky rounded-3xl lg:top-24 h-fit p-6 sm:p-8 shadow-2xl order-1 lg:order-2 bg-[#0a0a0b] text-white border border-white/10 relative overflow-hidden">

                        {/* Top specular highlight hairline */}
                        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.25em] block mb-0.5">Summary</span>
                                <h2 className="editorial-text text-xl sm:text-2xl font-light text-white tracking-tight">Reservation Bag</h2>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
                                {userCart?.length || 0} {userCart?.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 no-scrollbar mb-5">
                            {(!userCart || userCart.length === 0) && !userCartError && !userCartLoading && (
                                <p className="text-center text-xs py-6 tracking-wider border border-white/10 rounded-2xl text-white/40 font-light">No garments in reservation</p>
                            )}
                            {userCart && userCart?.map((item: any, index: number) => {
                                const itemDetail = item.items?.[0] || {};
                                const name = itemDetail.title || itemDetail.name || "Signature Garment";
                                const images = itemDetail.images || ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"];
                                const price = itemDetail.discountPrice || itemDetail.basePrice || 0;

                                return (
                                    <div key={item._id || index} className="flex justify-between items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={images[0]} className="w-14 h-14 rounded-xl object-cover shrink-0" alt={name} />
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-xs font-normal text-white truncate">{name}</p>
                                                <p className="text-[10px] text-white/50 font-light">
                                                    {item.size || 'M'} · {item.color || 'Obsidian'} · Qty: {item.quantity}
                                                </p>
                                                <p className="text-xs font-medium text-white/90 mt-0.5">₹{(price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { dispatch(removeFromCart(item._id)), removeFromCartMutation(item._id) }}
                                            className="text-white/40 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                                            title="Remove"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Price Breakdown Ledger */}
                        <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-white/70">
                            <div className="flex justify-between font-light">
                                <span>Subtotal</span>
                                <span className="font-normal text-white">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-light">
                                <span>Shipping</span>
                                <span className="font-normal text-white">
                                    {shipping === 0 ? <span className="text-emerald-400 font-medium">Complimentary</span> : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-light">
                                <span>Estimated GST ({gst}%)</span>
                                <span className="font-normal text-white">₹{Math.round(gstAmount).toLocaleString()}</span>
                            </div>
                            {userCart?.[0]?.code && (
                                <div className="flex justify-between text-emerald-400 font-light">
                                    <span>Privilege Code ({userCart[0].code})</span>
                                    <span className="font-medium">-₹{Math.round(discount).toLocaleString()}</span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                                <span className="editorial-text text-base font-light text-white">Total</span>
                                <span className="editorial-text text-2xl font-light text-white">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        {userCart?.[0]?.code ? (
                            <div className="flex justify-between items-center p-3 mt-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest">Privilege '{userCart[0].code}' Active</span>
                                <span className="text-xs font-bold">-{userCart[0].discountAmount}%</span>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="w-full py-1 text-[11px] font-medium transition cursor-pointer text-left uppercase tracking-wider text-white/60 hover:text-white underline underline-offset-4"
                                    onClick={() => setApply(!apply)}>
                                    {apply ? "Close Code Entry" : "+ Enter Privilege Passcode"}
                                </button>
                                {apply && (
                                    <div className="flex items-center gap-2 p-1.5 border border-white/15 bg-white/5 rounded-xl mt-2">
                                        <input
                                            type="text"
                                            className="bg-transparent border-none text-white text-xs px-2.5 py-1 focus:outline-none w-full placeholder:text-white/30 uppercase tracking-widest font-mono"
                                            onChange={(e) => setCoupon(e.target.value)}
                                            placeholder="CODE"
                                            name="coupon"
                                            id="coupon"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={applyCouponPending || !coupon}
                                            className="bg-white text-black hover:bg-neutral-200 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-white/10">
                            <input
                                type="checkbox"
                                name="isAgree"
                                className="accent-white w-4 h-4 rounded"
                                id="isAgree"
                                required
                                value={order.isAgree}
                                onChange={handleOrderChange}
                            />
                            <label htmlFor="isAgree" className="text-[11px] text-white/60 font-light cursor-pointer">
                                I accept the <a href="#" className="underline underline-offset-2 text-white/90 hover:text-white">atelier terms & client policies</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode || !order.isAgree}
                            onClick={(e) => handleOrderSubmit(e)}
                            className={`w-full bg-white text-black py-4 px-6 rounded-full mt-5 text-xs font-medium uppercase tracking-[0.15em] transition shadow-xl ${userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode || !order.isAgree
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-neutral-200 hover:scale-[1.01] cursor-pointer"
                                }`}
                        >
                            CONFIRM RESERVATION
                        </button>

                        {userCartLoading && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
                                <div className="dot-spinner dot-spinner-inverse" />
                            </div>
                        )}

                        {userCartError && (
                            <div className="absolute top-40 inset-x-0 p-4 text-center bg-black/80 rounded-2xl mx-4">
                                <p className="text-rose-400 text-xs">Cart is unpopulated or network interruption encountered.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}