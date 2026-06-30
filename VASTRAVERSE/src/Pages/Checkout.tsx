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
import { useRazorpay } from "react-razorpay";

export const Checkout = () => {
    const { Razorpay } = useRazorpay();
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

            const rzp = new Razorpay(options);
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
            <div className="min-h-screen py-8 sm:py-12 relative flex justify-center items-start">
                <div className="flex flex-col lg:flex-row w-[95%] sm:w-[90%] max-w-7xl mx-auto gap-8 lg:gap-10">
                    <form onSubmit={handleOrderSubmit} className="w-full lg:w-2/3 relative order-2 lg:order-1">
                        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-500 animate-fade-in-up">Do Your <span className="text-gray-800">Order</span></h1>

                        <div className="flex flex-col gap-2 mt-5 animate-fade-in-up-delay-1">
                            <p className="text-xs py-1 font-semibold text-gray-700 tracking-widest uppercase">Shipping Information</p>
                            <input
                                type="text"
                                placeholder="Full name"
                                name="fullName"
                                value={order.fullName ?? ""}
                                onChange={handleOrderChange}
                                className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={order.email ?? ""}
                                readOnly
                                onChange={handleOrderChange}
                                className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Phone number"
                                name="phone"
                                required
                                value={order.phone}
                                onChange={handleOrderChange}
                                className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400"
                            />

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 my-1 sm:my-2">
                                {allAddress?.map((address: any) => (
                                    <div key={address._id} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-800">
                                        <input
                                            type="radio"
                                            name="address"
                                            value={address._id}
                                            onChange={handleAddressChange}
                                            checked={order.addressId === address._id}
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                        />
                                        {address.label}
                                    </div>
                                ))}
                            </div>

                            <input
                                type="text"
                                placeholder="Address"
                                name="addressLine1"
                                required
                                value={order.addressLine1}
                                onChange={handleOrderChange}
                                className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="sub address"
                                name="addressLine2"
                                value={order.addressLine2}
                                onChange={handleOrderChange}
                                className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400"
                            />

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    name="city"
                                    required
                                    value={order.city}
                                    onChange={handleOrderChange}
                                    className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400 w-full sm:w-1/2"
                                />

                                <input
                                    type="text"
                                    placeholder="State"
                                    name="state"
                                    required
                                    value={order.state}
                                    onChange={handleOrderChange}
                                    className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400 w-full sm:w-1/2"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    placeholder="Country"
                                    name="country"
                                    required
                                    value={order.country}
                                    onChange={handleOrderChange}
                                    className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400 w-full sm:w-1/2"
                                />

                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    name="pincode"
                                    maxLength={6}
                                    required
                                    value={order.pincode}
                                    onChange={handleOrderChange}
                                    className="p-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg focus:ring outline-none focus:ring-gray-500 border border-gray-400 w-full sm:w-1/2"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-[10px] sm:text-xs py-1 font-semibold text-gray-700 tracking-widest uppercase animate-fade-in-up-delay-2">Payment Methods</p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-10 pt-2 sm:pt-3 animate-fade-in-up-delay-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        className="accent-gray-800 w-3.5 h-3.5 sm:w-4 sm:h-4"
                                        onClick={() => serPayment(false)}
                                        onChange={handleOrderChange}
                                    />
                                    <span className="text-xs sm:text-sm text-gray-800">Cash on Delivery</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        className="accent-gray-800 w-3.5 h-3.5 sm:w-4 sm:h-4"
                                        onClick={() => serPayment(true)}
                                        onChange={handleOrderChange}
                                    />
                                    <span className="text-xs sm:text-sm text-gray-800">Razorpay</span>
                                </label>
                            </div>

                            {payment && (
                                <button
                                    type="button"
                                    onClick={handleOrderSubmit}
                                    disabled={userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode}
                                    className={`w-full bg-gray-900 text-white py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg mt-4 sm:mt-5 text-xs sm:text-sm font-semibold transition hover:bg-gray-800 tracking-widest animate-fade-in-up-delay-2 ${userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                                    PROCEED TO PAYMENT <span className="ml-1">→</span>
                                </button>
                            )}
                        </div>

                        {userOrderPending && (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
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

                    <div className="w-full lg:w-1/3 lg:sticky rounded-lg lg:top-24 h-fit px-4 sm:px-6 py-5 sm:py-6 shadow-md shadow-gray-400 animate-fade-in-up order-1 lg:order-2 bg-white">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5">Order Summary</h2>
                        <div className="flex justify-between items-center gap-2">
                            <h1 className="text-md text-gray-800">Your Cart</h1>
                            <span className="text-sm text-gray-800">({userCart?.length})</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex flex-col gap-2">
                            {(!userCart || userCart.length === 0) && !userCartError && !userCartLoading && (
                                <p className="text-center text-sm py-5 tracking-wide border border-gray-200 shadow rounded-lg text-gray-800">No items in cart</p>
                            )}
                            {userCart && userCart?.map((item: any, index: number) => {
                                const itemDetail = item.items?.[0] || {};
                                const name = itemDetail.title || itemDetail.name || "Premium T-Shirt";
                                const images = itemDetail.images || ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"];
                                const price = itemDetail.discountPrice || itemDetail.basePrice || 0;

                                return (
                                    <div key={item._id || index} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="flex justify-center items-center gap-2 tracking-wide">
                                                <img src={images[0]} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{name}</p>
                                                    <div className="flex gap-1">
                                                        <p className="text-xs text-gray-800">Size:</p>
                                                        <p className="text-xs text-gray-800">{item.size || 'L'}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <p className="text-xs text-gray-800">Color:</p>
                                                        <p className="text-xs text-gray-800">{item.color || 'White'}</p>
                                                    </div>
                                                    <div className="flex gap-1 mt-1">
                                                        <p className="text-xs font-bold text-gray-900">₹{price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { dispatch(removeFromCart(item._id)), removeFromCartMutation(item._id) }}
                                                className="hover:bg-red-100 hover:text-red-700 p-1 rounded-lg transition cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            <hr />
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">Total items</p>
                                    <p className="text-sm font-medium text-gray-800">{userCart?.length || 0}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">Subtotal</p>
                                    <p className="text-sm font-medium text-gray-800">₹{subtotal}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">Shipping</p>
                                    <p className="text-sm font-medium text-gray-800">₹{shipping}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">GST {gst}%</p>
                                    <p className="text-sm font-medium text-gray-800">₹ {Math.round(gstAmount)}</p>
                                </div>
                                {userCart?.[0]?.code && (
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-800">Discount</p>
                                        <p className="text-sm font-medium text-red-600">₹{Math.round(discount)}</p>
                                    </div>
                                )}
                                <hr />
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold text-gray-900">Total</p>
                                    <p className="font-bold tracking-wider">₹{total}</p>
                                </div>
                            </div>


                            {userCart?.[0]?.code ? (
                                <div className="flex justify-between items-center p-3 mt-3 border border-green-200 bg-green-50 rounded-lg">
                                    <span className="text-xs font-semibold text-green-700 tracking-wider">Coupon '{userCart[0].code}' Applied</span>
                                    <span className="text-sm font-bold text-green-700">-{userCart[0].discountAmount}%</span>
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="w-full py-2 rounded-lg text-xs font-medium transition cursor-pointer text-start tracking-wider hover:text-blue-700 hover:underline hover:underline-offset-4"
                                        onClick={() => setApply(!apply)}>
                                        {apply ? "Close" : "Apply Coupon"}
                                    </button>
                                    {apply && (
                                        <div className="flex justify-between items-center p-2 border border-gray-300 rounded-lg mt-2">
                                            <div className="flex items-center gap-2">
                                                <input type="text" className="border-none focus:outline-none" onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon Code" name="coupon" id="coupon" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={applyCoupon}
                                                    disabled={applyCouponPending || !coupon}
                                                    className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    name="isAgree"
                                    className="rounded-md w-3.5 h-3.5 sm:w-4 sm:h-4"
                                    id="isAgree"
                                    required
                                    value={order.isAgree}
                                    onChange={handleOrderChange}
                                />
                                <p className="text-xs sm:text-sm text-gray-800">I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a></p>
                            </div>
                            <button
                                type="submit"
                                disabled={userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode || !order.isAgree}
                                onClick={(e) => handleOrderSubmit(e)}
                                className={`w-full bg-gray-900 text-white py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg mt-4 sm:mt-5 text-xs sm:text-sm font-semibold transition tracking-widest ${userOrderPending || !order.phone || !order.addressLine1 || !order.city || !order.state || !order.country || !order.pincode || !order.isAgree
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-800 cursor-pointer"
                                    }`}>
                                PLACE ORDER
                            </button>
                        </div>

                        {userCartLoading && (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-black/30 rounded-lg">
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

                        {userCartError && (
                            <div className="absolute top-40 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-black/30">
                                <p className="text-red-500 text-sm">may be cart is empty! or network error!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}