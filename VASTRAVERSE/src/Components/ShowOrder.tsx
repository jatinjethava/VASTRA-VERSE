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
    const base = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-medium";
    if (status === "done")
        return <div className={`${base} bg-black text-white shadow-sm`}>✓</div>;
    if (status === "active")
        return (
            <div className={`${base} bg-black text-white ring-4 ring-neutral-200`}>
                <span className="block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
        );
    if (status === "cancelled")
        return <div className={`${base} bg-neutral-100 text-neutral-400 border border-neutral-300`}>✕</div>;
    return <div className={`${base} bg-neutral-100 text-neutral-300 border border-neutral-200`} />;
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
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200/80 overflow-hidden">
            
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block">
                        Client Directive
                    </span>
                    <h3 className="editorial-text text-xl font-light text-neutral-900 tracking-tight">Cancel <span className="italic font-serif font-normal">Reservation</span></h3>
                </div>
                <button onClick={onClose} className="text-neutral-400 hover:text-black transition p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer" aria-label="Close">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 mb-4">
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    This request will terminate all <span className="font-semibold text-neutral-900">{itemCount} item{itemCount > 1 ? "s" : ""}</span> associated with archive <strong className="font-mono text-neutral-900">#{orderNumber}</strong>.
                </p>
            </div>

            <p className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2">Reason for Cancellation</p>
            <div className="flex flex-col gap-2 mb-6">
                {CANCEL_REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer text-xs sm:text-sm text-neutral-700 transition">
                        <input
                            type="radio"
                            name="reason"
                            value={r}
                            checked={reason === r}
                            onChange={() => setReason(r)}
                            className="accent-black w-4 h-4 cursor-pointer"
                        />
                        <span className="font-normal">{r}</span>
                    </label>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 border border-neutral-200 rounded-full py-3 text-xs uppercase tracking-widest font-medium text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                >
                    Retain Order
                </button>
                <button
                    disabled={!reason || cancelPending}
                    onClick={handleCancelOrder}
                    className={`flex-1 bg-black text-white rounded-full py-3 text-xs uppercase tracking-widest font-medium transition cursor-pointer shadow-md
                            ${!reason || cancelPending ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-800"}`}
                >
                    {cancelPending ? "Terminating..." : "Confirm Cancel"}
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
            <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4 px-4 bg-[#fafafa]">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center border border-neutral-200">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="editorial-text text-2xl font-light text-neutral-900">Dossier Unreachable</h3>
                <p className="text-neutral-500 text-xs sm:text-sm font-light">The specified order record could not be located in our archives.</p>
                <Link to="/order-list">
                    <button className="bg-black text-white px-7 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition tracking-wider cursor-pointer shadow-md">
                        Return to Archives
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
        <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between items-start">

                <aside className="w-full lg:w-96 lg:sticky h-fit lg:top-24 rounded-3xl order-2 lg:order-1 overflow-hidden border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                Haute Atelier Service
                            </span>
                            <h3 className="editorial-text text-lg font-light text-neutral-900 tracking-tight">Concierge <span className="italic font-serif font-normal">Commitment</span></h3>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MdOutlineSentimentSatisfied className="text-base text-neutral-900" />
                                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Flawless Tailoring</h4>
                            </div>
                            <p className="text-xs text-neutral-500 font-light leading-relaxed">Every garment undergoes stringent hand inspections before white-glove dispatch to ensure museum-tier precision.</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-neutral-100">
                            <div className="flex items-center gap-2">
                                <SiPrometheus className="text-base text-neutral-900" />
                                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Heritage Guarantee</h4>
                            </div>
                            <p className="text-xs text-neutral-500 font-light leading-relaxed">Thank you for curating your wardrobe with Vastraverse. Each parcel represents a bespoke contract of elegance.</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-neutral-100">
                            <div className="flex items-center gap-2">
                                <MdPolicy className="text-base text-neutral-900" />
                                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Exchange & Return Protocol</h4>
                            </div>
                            <p className="text-xs text-neutral-500 font-light leading-relaxed">Complimentary returns are honored within the prescribed window for unworn items retaining pristine atelier tags.</p>
                        </div>
                    </div>
                </aside>

                <div className="w-full lg:flex-1 flex justify-center flex-col order-1 lg:order-2">
                    <button
                        onClick={() => navigate("/order-list")}
                        className="flex w-fit items-center gap-1.5 text-xs text-neutral-400 hover:text-black uppercase tracking-wider font-semibold transition mb-5 group cursor-pointer"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Archive History
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-3 mb-6">
                        <div>
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                Client Archive Dossier
                            </span>
                            <h1 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                                Order <span className="font-mono font-medium text-xl sm:text-2xl">#{order.orderNumber}</span>
                            </h1>
                            <p className="text-xs text-neutral-500 font-light mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} garment{order.items.length > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-3 justify-between items-start sm:items-end">
                            <span className={`px-3 py-1 w-fit text-[10px] sm:text-xs font-mono font-medium rounded-full uppercase tracking-wider ${order?.orderStatus === "pending" ? "bg-neutral-100 text-neutral-800 border border-neutral-300" : order?.orderStatus === "confirmed" ? "bg-neutral-900 text-white" : order?.orderStatus === "processing" ? "bg-amber-100 text-amber-900 border border-amber-300" : order?.orderStatus === "shipped" ? "bg-neutral-800 text-white" : order?.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-900 border border-emerald-300" : order?.orderStatus === "cancelled" ? "bg-neutral-100 text-neutral-500 line-through" : ""}`}>
                                {order?.orderStatus}
                            </span>
                            {!order?.returnRequest && order?.orderStatus === "delivered" && (
                                <button
                                    onClick={() => setReturnRequest(true)}
                                    className={`px-3 py-1 text-xs rounded-full tracking-wider hover:cursor-pointer underline underline-offset-4 text-neutral-600 hover:text-black`}>
                                    Initiate Return
                                </button>
                            )}
                            {order?.returnRequest && order?.orderStatus === "delivered" && (
                                <p className="text-xs text-amber-700 font-light mt-1">
                                    Return protocol initiated. Atelier assessment in progress (5-7 business days).
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-7 mb-4 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">Reserved Garments</p>
                        {order.items.map((item: any, i: number) => {
                            const name = item.title || item.name || "Haute Garment";
                            const price = item.discountPrice || item.basePrice || 0;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-start sm:items-center gap-4 py-4 ${i < order.items.length - 1 ? "border-b border-neutral-100" : ""}`}
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center overflow-hidden shadow-inner">
                                        <img src={item.images?.[0] || ""} alt={name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                Size: {item.size || "L"}
                                            </span>
                                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                Color: {item.color || "Black"}
                                            </span>
                                        </div>
                                        <div className="sm:hidden mt-2 flex justify-between items-center w-full">
                                            <p className="text-xs text-neutral-400 font-mono">Qty: {item.quantity || 1}</p>
                                            <p className="text-xs font-semibold text-neutral-900 font-mono">₹{(price * (item.quantity || 1)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="hidden sm:block text-xs text-neutral-400 font-mono mx-2">Qty: {item.quantity || 1}</p>
                                    <p className="hidden sm:block text-sm font-medium text-neutral-900 font-mono">₹{(price * (item.quantity || 1)).toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-7 mb-4 shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">Financial Ledger</p>
                        <div className="space-y-2.5">
                            <div className="flex justify-between text-xs sm:text-sm text-neutral-600 font-light">
                                <span>Subtotal</span>
                                <span className="font-mono text-neutral-900">₹{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm text-neutral-600 font-light">
                                <span>Bespoke Logistics</span>
                                <span className="font-mono text-neutral-900">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-neutral-600 font-light">Privilege Concession</span>
                                    <span className="text-emerald-700 font-mono font-medium">−₹{order.discount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs sm:text-sm text-neutral-600 font-light">
                                <span>Taxes (18% GST Included)</span>
                                <span className="font-mono text-neutral-900">₹{((order.subtotal * 18) / 100)?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-neutral-100 pt-3 mt-3 flex justify-between text-base sm:text-lg font-medium text-neutral-900">
                                <span className="editorial-text">Total Settled</span>
                                <span className="font-mono font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">Delivery Destination</p>
                            <p className="text-sm font-semibold text-neutral-900">{address.fullName}</p>
                            <p className="text-xs text-neutral-500 font-light leading-relaxed mt-1.5">
                                {address.addressLine1}
                                {address.addressLine2 && <><br />{address.addressLine2}</>}
                                <br />{address.city}, {address.state} {address.pincode}
                                <br />{address.country}
                            </p>
                            {address.phone && (
                                <p className="text-xs text-neutral-500 font-mono mt-2">📞 {address.phone}</p>
                            )}
                        </div>
                        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">Settlement Method</p>
                            <p className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">{order.paymentMethod}</p>
                            <p className="text-xs text-neutral-500 font-light mt-1">
                                Status: <span className={`font-mono font-medium ${order.paymentStatus === "paid" ? "text-emerald-700" : "text-amber-700"}`}>
                                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                                </span>
                            </p>
                            <p className="text-xs text-neutral-400 font-mono mt-1">
                                Timestamp: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {order.orderStatus === "cancelled" && (
                                <>
                                    <p className="text-xs text-neutral-500 mt-2">
                                        <span className="text-neutral-800 font-medium"><span className="font-semibold text-neutral-900 tracking-wider text-[10px] uppercase">Reason :</span> {order?.reason || "Not specified"}</span>
                                    </p>
                                    <p className="text-xs text-neutral-400 font-light mt-1">
                                        Amount credited back via original channel within 5-7 business cycles.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-7 mb-4 shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">Atelier Transit Progress</p>
                        <ul className="list-none p-0 m-0">
                            {trackingSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3.5 py-2.5 relative">
                                    {i < trackingSteps.length - 1 && (
                                        <div className="absolute left-[9px] top-[26px] bottom-[-8px] w-px bg-neutral-200" />
                                    )}
                                    <StepDot status={step.status} />
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <p className={`text-xs sm:text-sm font-medium ${step.status === "active" ? "text-neutral-900 font-semibold" : step.status === "done" ? "text-neutral-800" : "text-neutral-400"}`}>
                                            {step.label}
                                        </p>
                                        {step.label === "Delivered" && order?.expectedDeliveryDate && step.status === "pending" ? (
                                            <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 rounded-full px-2.5 py-0.5 mt-1 sm:mt-0 w-fit">
                                                Expected: {new Date(order.expectedDeliveryDate).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        ) : step.label === "Delivered" && order?.deliveredAt && step.status === "done" ? (
                                            <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 rounded-full px-2.5 py-0.5 mt-1 sm:mt-0 w-fit">
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
                        <div className="flex gap-3 flex-col sm:flex-row flex-wrap mt-2 mb-8">
                            <button
                                onClick={() => setShowCancel(true)}
                                className="flex-1 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black rounded-full py-3.5 text-xs uppercase tracking-widest font-medium transition cursor-pointer"
                            >
                                Terminate Reservation
                            </button>

                            <button
                                onClick={() => downloadInvoice(order._id)}
                                disabled={downloadInvoicePending}
                                className="flex-1 bg-black text-white hover:bg-neutral-800 rounded-full py-3.5 text-xs uppercase tracking-widest font-medium transition cursor-pointer shadow-md"
                            >
                                {downloadInvoicePending ? "Generating..." : "Download Dossier Invoice"}
                            </button>
                        </div>
                    )}

                    <div className="mt-4">
                        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <div className="mb-6">
                                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                    The Vastraverse Standard
                                </span>
                                <h2 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                                    Atelier <span className="italic font-serif font-normal">Privileges</span>
                                </h2>
                                <p className="text-xs text-neutral-500 font-light mt-1">
                                    Uncompromising craftsmanship, bespoke logistics, and discreet client care.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs">
                                        ✦
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                                            Artisanal Excellence
                                        </h3>
                                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                                            Curated textiles cut and finished to museum-grade specifications.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs">
                                        ✦
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                                            Encrypted Settlement
                                        </h3>
                                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                                            End-to-end tokenized payment execution via tier-1 bank conduits.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs">
                                        ✦
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                                            White Glove Dispatch
                                        </h3>
                                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                                            Priority transit network guaranteeing prompt nationwide custody.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs">
                                        ✦
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                                            Complimentary Exchanges
                                        </h3>
                                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                                            Hassle-free return protocol with immediate ledger replenishment.
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
                    <div className="w-full fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
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
                    <div className="w-full fixed inset-0 flex items-center justify-center z-1000 p-4 bg-black/60 backdrop-blur-sm">
                        <ReturnRequestModal
                            orderNumber={order.orderNumber}
                            orderId={order._id}
                            items={order.items}
                            onClose={() => setReturnRequest(false)}
                        />
                    </div>
                )
            }
        </div>
    );
};