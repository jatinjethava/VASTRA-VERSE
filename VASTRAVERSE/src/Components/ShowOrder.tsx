import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCancelOrder, useDownloadInvoice, useGetUserOrder } from "../Hooks/order";
import { MdOutlineSentimentSatisfied, MdPolicy } from "react-icons/md";
import { SiPrometheus } from "react-icons/si";
import { ReturnRequestModal } from "./ReturnModel";

const TRACKING_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const CANCEL_REASONS = [
    "Changed my mind",
    "Found a better price else where",
    "Ordered by mistake",
    "Delivery time is too long",
    "Other",
];

function getTrackingStatus(orderStatus: string) {
    if (orderStatus === "cancelled") {
        return TRACKING_STEPS.map((step) => ({
            label: step.charAt(0).toUpperCase() + step.slice(1),
            status: "cancelled" as const,
        }));
    }
    const currentIndex = TRACKING_STEPS.indexOf(orderStatus);
    return TRACKING_STEPS.map((step, i) => ({
        label: step.charAt(0).toUpperCase() + step.slice(1),
        status: i < currentIndex ? "done" as const : i === currentIndex ? "active" as const : "pending" as const,
    }));
}

function StepDot({ status }: { status: "done" | "active" | "pending" | "cancelled" }) {
    const base = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5";
    if (status === "done")
        return <div className={`${base} bg-green-100 text-green-700`}>✓</div>;
    if (status === "active")
        return <div className={`${base} bg-blue-100 text-blue-700`}>
            <span className="block w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        </div>;
    if (status === "cancelled")
        return <div className={`${base} bg-red-50 text-red-400 border border-red-200`}>✕</div>;
    return <div className={`${base} bg-gray-100 text-gray-400 border border-gray-200`} />;
}

function CancelModal({
    orderNumber,
    orderId,
    itemCount,
    onClose,
}: {
    orderNumber: string;
    orderId: string;
    itemCount: number;
    onClose: () => void;
}) {
    const { mutateAsync: cancelOrderMutation, isPending: cancelPending } = useCancelOrder();
    const [reason, setReason] = useState<string>("");

    const handleCancelOrder = async () => {
        await cancelOrderMutation({ reason, orderId });
        onClose();
    };

    return (
        <div className="h-fit w-fit bg-white overflow-y-auto rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-base text-gray-900">Cancel order</p>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer" aria-label="Close">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-4">
                <p className="text-[13px] text-red-700">
                    This will cancel all {itemCount} item{itemCount > 1 ? "s" : ""} in <strong>#{orderNumber}</strong>. This action cannot be undone.
                </p>
            </div>

            <p className="text-[13px] text-gray-500 mb-2">Reason for cancellation</p>
            <div className="flex flex-col gap-2 mb-5">
                {CANCEL_REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
                        <input
                            type="radio"
                            name="reason"
                            value={r}
                            checked={reason === r}
                            onChange={() => setReason(r)}
                            className="accent-red-500"
                        />
                        {r}
                    </label>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                    Keep order
                </button>
                <button
                    disabled={!reason || cancelPending}
                    onClick={handleCancelOrder}
                    className={`flex-1 bg-red-600 text-white rounded-lg py-2.5 text-sm font-medium transition cursor-pointer
                            ${!reason || cancelPending ? "opacity-40 cursor-not-allowed" : "hover:bg-red-700"}`}
                >
                    {cancelPending ? "Cancelling..." : "Confirm cancel"}
                </button>
            </div>
        </div>
    );
}

export const ShowOrder = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const { data: orders, isLoading, error } = useGetUserOrder();
    const { mutate: downloadInvoice, isPending: downloadInvoicePending } = useDownloadInvoice();

    const [showCancel, setShowCancel] = useState(false);
    const [returnRequest, setReturnRequest] = useState(false);

    const order = orders?.find((o: any) => o.orderNumber === orderNumber);

    useEffect(() => {
        document.title = order ? `Order #${order.orderNumber} | Vastra Verse` : "Order Details | Vastra Verse";
    }, [order]);

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

    if (error || !order) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-sm">Order not found</p>
                <Link to="/order-list">
                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition tracking-wider cursor-pointer">
                        Back to Orders
                    </button>
                </Link>
            </div>
        );
    }

    const trackingSteps = getTrackingStatus(order.orderStatus);
    const address = order.shippingAddress;
    const shipping = order.shippingFee;
    const isCancellable = !["delivered", "cancelled"].includes(order.orderStatus);

    return (
        <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="relative sm:p-4 rounded-xl max-w-full flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between items-start mx-auto animate-fade-in-up">

                <aside className="w-full lg:w-96 lg:sticky h-fit lg:top-20 lg:left-0 shadow-lg shadow-gray-400/20 rounded-lg order-2 lg:order-1">
                    <div className="bg-white rounded-xl p-5 sm:p-6">
                        <div className="items-center justify-between mb-4 mt-8">
                            <div className="flex items-center gap-2 mb-1">
                                <MdOutlineSentimentSatisfied className="text-xl text-gray-900" />
                                <h1 className="text-sm font-semibold text-gray-900 tracking-wider">Customer Satisfaction Commitment</h1>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">Customer satisfaction is at the heart of everything we do. Our team works diligently to ensure every order meets our quality standards before it reaches your doorstep. If you experience any issues with your order, we are committed to finding a suitable solution and providing the support you need.</p>
                        </div>

                        <div className="mb-3 mt-8">
                            <div className="items-center justify-between mb-4">
                                <h1 className="flex justify-start items-center mb-1">
                                    <SiPrometheus className="text-xl mr-2" />
                                    <p className="text-sm font-semibold text-gray-800 tracking-wider flex items-center">Our Brand Promise</p>
                                </h1>
                                <p className="text-xs text-gray-600 leading-relaxed">Thank you for choosing Vastra Verse. We are committed to delivering quality fashion, exceptional service, and a seamless online shopping experience. Every order represents the trust our customers place in us, and we continuously strive to exceed expectations through quality products, reliable delivery, and customer-focused service. We look forward to being a part of your style journey and serving you again in the future.</p>
                            </div>
                        </div>

                        <div className="mb-3 mt-8">
                            <div className="items-center justify-center">
                                <h1 className="flex justify-start items-center mb-1">
                                    <MdPolicy className="text-xl mr-2" />
                                    <p className="text-sm font-semibold text-gray-800 tracking-wider flex items-center">Return & Refund Policy</p>
                                </h1>
                                <p className="text-xs text-gray-600 leading-relaxed">We want you to shop with confidence. If you are not completely satisfied with your purchase, eligible items may be returned within the specified return window from the date of delivery. Products must be unused, unwashed, and returned in their original condition with all tags and packaging intact. Once the returned item passes quality inspection, the refund will be processed to the original payment method. Refund timelines may vary depending on your bank or payment provider.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="w-full lg:flex-1 flex justify-center flex-col order-1 lg:order-2">
                    <button
                        onClick={() => navigate("/order-list")}
                        className="flex w-fit items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition mb-4 sm:mb-6 group cursor-pointer"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Orders
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-3 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Order #{order.orderNumber}</h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-3 justify-between items-start sm:items-end">
                            <span className={`px-3 py-1 w-fit text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider ${order?.orderStatus === "pending" ? "bg-gray-50 text-gray-700 border border-gray-200" : order?.orderStatus === "confirmed" ? "bg-blue-50 text-blue-700 border border-blue-200" : order?.orderStatus === "processing" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : order?.orderStatus === "shipped" ? "bg-purple-50 text-purple-700 border border-purple-200" : order?.orderStatus === "delivered" ? "bg-green-50 text-green-700 border border-green-200" : order?.orderStatus === "cancelled" ? "bg-red-50 text-red-700 border border-red-200" : ""}`}>
                                {order?.orderStatus}
                            </span>
                            {!order?.returnRequest && order?.orderStatus === "delivered" && (
                                <button
                                    onClick={() => setReturnRequest(true)}
                                    className={`px-2 py-1 w-fit text-xs sm:text-sm rounded-full tracking-wider hover:cursor-pointer underline underline-offset-4`}>
                                    Return request
                                </button>
                            )}
                            {order?.returnRequest && order?.orderStatus === "delivered" && (
                                <p className="text-xs tracking-wider text-red-500 mt-1">
                                    Return request already sent! Wait for 5 - 7 business days for return request approval & return processing.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-3 animate-fade-in-up-delay-1 overflow-x-auto">
                        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Items Ordered</p>
                        {order.items.map((item: any, i: number) => {
                            const name = item.title || item.name || "Premium T-Shirt";
                            const price = item.discountPrice || item.basePrice || 0;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-start sm:items-center gap-3 sm:gap-4 py-3 ${i < order.items.length - 1 ? "border-b border-gray-100" : ""}`}
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-lg">
                                        <img src={item.images?.[0] || ""} alt={name} className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{name}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                            Size: {item.size || "L"} · Color: {item.color || "White"}
                                        </p>
                                        <div className="sm:hidden mt-1 flex justify-between items-center w-full">
                                            <p className="text-[10px] text-gray-400">× {item.quantity || 1}</p>
                                            <p className="text-xs font-medium text-gray-900">₹{(price * (item.quantity || 1)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="hidden sm:block text-xs text-gray-400 mx-2">× {item.quantity || 1}</p>
                                    <p className="hidden sm:block text-sm font-medium text-gray-900">₹{(price * (item.quantity || 1)).toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-3 animate-fade-in-up-delay-1">
                        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Order Summary</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-green-600 font-medium">−₹{order.discount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                                <span>Taxes (18% GST)</span>
                                <span>₹{((order.subtotal * 18) / 100)?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-sm sm:text-base font-semibold text-gray-900">
                                <span>Total</span>
                                <span>₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 animate-fade-in-up-delay-2">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Delivery Address</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{address.fullName}</p>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && <><br />{address.addressLine2}</>}
                                <br />{address.city}, {address.state} {address.pincode}
                                <br />{address.country}
                            </p>
                            {address.phone && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">📞 {address.phone}</p>
                            )}
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Payment</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 uppercase">{order.paymentMethod}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Status: <span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                                </span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {order.orderStatus === "cancelled" && (
                                <>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                        <span className="text-gray-800 font-medium"><span className="font-medium text-red-600 tracking-wider text-[10px] sm:text-sm uppercase">Cancellation Reason :</span> {order?.reason || "Not provided"}</span>
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        <span className="text-gray-800 font-medium"><span className="font-medium text-red-600 tracking-wider text-[10px] sm:text-sm uppercase">Note :</span> Amount will be refunded within 5-7 working days.</span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-3 animate-fade-in-up-delay-2">
                        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-4">Tracking</p>
                        <ul className="list-none p-0 m-0">
                            {trackingSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 py-2 relative">
                                    {i < trackingSteps.length - 1 && (
                                        <div className="absolute left-[9px] top-[26px] bottom-[-8px] w-px bg-gray-100" />
                                    )}
                                    <StepDot status={step.status} />
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <p className={`text-xs sm:text-[13px] font-medium ${step.status === "active" ? "text-gray-900" : step.status === "done" ? "text-gray-700" : "text-gray-400"}`}>
                                            {step.label}
                                        </p>
                                        {step.label === "Delivered" && order?.expectedDeliveryDate && step.status === "pending" ? (
                                            <span className="text-[10px] sm:text-[11px] text-green-800 font-medium tracking-wider bg-green-100 rounded-lg px-2 py-0.5 sm:py-1 mt-1 sm:mt-0 w-fit">
                                                Expected: {new Date(order.expectedDeliveryDate).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        ) : step.label === "Delivered" && order?.deliveredAt && step.status === "done" ? (
                                            <span className="text-[10px] sm:text-[11px] text-green-800 font-medium tracking-wider bg-green-100 rounded-lg px-2 py-0.5 sm:py-1 mt-1 sm:mt-0 w-fit">
                                                {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isCancellable && (
                        <div className="flex gap-2 flex-col sm:flex-row flex-wrap mt-1 mb-8 animate-fade-in-up-delay-2">
                            <button
                                onClick={() => setShowCancel(true)}
                                className="flex-1 border border-red-200 text-red-600 rounded-lg py-2.5 text-xs sm:text-sm font-medium hover:bg-red-50 transition cursor-pointer"
                            >
                                Cancel Order
                            </button>

                            <button
                                onClick={() => downloadInvoice(order._id)}
                                disabled={downloadInvoicePending}
                                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                {downloadInvoicePending ? "Downloading..." : "Download Invoice"}
                            </button>
                        </div>
                    )}

                    <div className="mt-6 sm:mt-8 animate-fade-in-up-delay-2">
                        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Why Shop With Us?
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Enjoy a secure and seamless shopping experience with benefits designed for your convenience.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            Premium Quality
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Carefully selected products designed for style, comfort, and durability.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            Secure Payments
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Protected transactions through trusted payment gateways.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            Fast Delivery
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Reliable shipping network delivering across India.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            Easy Returns
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Hassle-free returns and transparent refund process.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            Customer Support
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Dedicated assistance whenever you need help.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm sm:text-base text-gray-900">
                                            New Arrivals
                                        </h3>
                                        <p className="text-[11px] sm:text-sm text-gray-600">
                                            Fresh collections and trending styles added regularly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                showCancel && (
                    <div className="w-full fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in-up bg-black/40 backdrop-blur-sm">
                        <CancelModal
                            orderNumber={order.orderNumber}
                            orderId={order._id}
                            itemCount={order.items.length}
                            onClose={() => setShowCancel(false)}
                        />
                    </div>
                )
            }

            {
                returnRequest && (
                    <div className="w-full fixed inset-0 flex items-center justify-center z-1000 p-4 animate-fade-in-up bg-black/40 backdrop-blur-sm">
                        <ReturnRequestModal
                            orderNumber={order.orderNumber}
                            orderId={order._id}
                            items={order.items}
                            onClose={() => setReturnRequest(false)}
                        />
                    </div>
                )
            }
        </div >
    );
};