import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCancelOrder, useGetUserOrder } from "../Hooks/order";
import ReactGA from "react-ga4";
import { Package, ArrowUpRight, ArrowRight } from "lucide-react";

export const OrderList = () => {

    const { data: orders, isLoading, error } = useGetUserOrder();
    const { mutateAsync: cancelOrder } = useCancelOrder();

    useEffect(() => {
        document.title = "Order History | Vastra Verse";
        ReactGA.event({
            category: "Order",
            action: "View_order_list",
            value: orders?.length,
        });
    }, [orders]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] bg-[#fafafa]">
                <div className="dot-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] bg-[#fafafa] px-4">
                <div className="flex flex-col items-center text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border border-neutral-200/60">
                        <Package className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="editorial-text text-xl font-light text-black mb-2">Archive Connection Issue</h2>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mb-6">Unable to retrieve your order archives at this moment.</p>
                    <Link to="/">
                        <button className="bg-black hover:bg-neutral-800 text-white px-7 py-3.5 rounded-xl text-xs font-medium uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer">
                            Return to Collection
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 pb-6 border-b border-neutral-200/80">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-0.5 border border-black/15 bg-black/[0.03] text-black/80 rounded-full text-[9px] tracking-[0.25em] uppercase font-mono font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-black/70 animate-pulse" />
                            Client Archives
                        </div>
                        <h1 className="editorial-text text-3xl sm:text-4xl font-light text-black tracking-tight leading-tight">
                            Order <span className="italic font-serif font-normal">History</span>
                        </h1>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors"
                    >
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="space-y-6">
                    {!orders || orders.length === 0 ? (
                        <div className="bg-white p-10 sm:p-16 rounded-3xl border border-neutral-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200/60">
                                <Package className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h2 className="editorial-text text-xl sm:text-2xl font-light text-black mb-2">No Archives Recorded</h2>
                            <p className="text-xs sm:text-sm text-neutral-500 font-light mb-7 max-w-sm mx-auto">
                                You haven't acquired any bespoke pieces or limited drops yet.
                            </p>
                            <Link to="/">
                                <button className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-xl text-xs font-medium uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer">
                                    Explore Collection
                                </button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.orderNumber}
                                className="group relative bg-white rounded-3xl border border-neutral-200/80 hover:border-black/25 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                {/* Top hairline specular accent */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent pointer-events-none" />

                                {/* Order Header Strip */}
                                <div className="border-b border-neutral-200/80 bg-neutral-50/70 px-5 sm:px-7 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex flex-wrap w-full md:w-auto gap-x-6 sm:gap-x-8 gap-y-3 text-xs justify-between sm:justify-start">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-mono mb-0.5">Order Ref</p>
                                            <p className="font-mono font-medium text-black">#{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-mono mb-0.5">Date Placed</p>
                                            <p className="font-mono text-neutral-800">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-mono mb-0.5">Total Amount</p>
                                            <p className="font-mono font-semibold text-black">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t border-neutral-200/60 md:border-t-0 justify-between md:justify-end">
                                        <span className={`px-3 py-1 text-[10px] font-mono font-semibold rounded-full uppercase tracking-widest border ${order.orderStatus === 'delivered'
                                            ? 'bg-black text-white border-black'
                                            : order.orderStatus === 'cancelled'
                                                ? 'bg-neutral-100 text-neutral-500 border-neutral-300'
                                                : 'bg-white text-black border-neutral-300 shadow-xs'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                        {order.paymentMethod && (
                                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                                                {order.paymentMethod}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items Body */}
                                <div className="px-5 sm:px-7 py-5">
                                    <div className="divide-y divide-neutral-100">
                                        {order?.items.map((item: any, idx: number) => {
                                            const itemDetail = item.items?.[0] || item;
                                            const name = item.title || itemDetail.title || "Archival Garment";
                                            const images = item.images && item.images.length > 0 ? item.images[0] : itemDetail.images && itemDetail.images.length > 0 ? itemDetail.images[0] : "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
                                            const price = item.discountPrice || itemDetail.discountPrice || itemDetail.basePrice || 0;

                                            return (
                                                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start sm:items-center gap-4 sm:gap-5">
                                                    <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-100">
                                                        <img src={images as string} alt={name} className="h-full w-full object-cover object-center grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between h-full py-0.5">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                            <div>
                                                                <h3 className="editorial-text text-sm sm:text-base font-normal text-black line-clamp-1">
                                                                    {name}
                                                                </h3>
                                                                <div className="mt-1 flex items-center text-[10px] sm:text-xs font-mono text-neutral-500 gap-2 sm:gap-3">
                                                                    <span>Size: <strong className="text-black">{item.size || 'L'}</strong></span>
                                                                    <span className="text-neutral-300">•</span>
                                                                    <span>Color: <strong className="text-black">{item.color || 'Noir'}</strong></span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-mono font-semibold text-black">
                                                                ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs font-mono text-neutral-400">
                                                            <span>Quantity: {item.quantity || 1}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Footer Actions */}
                                    <div className="mt-5 pt-4 flex justify-between items-center gap-3 border-t border-neutral-100">
                                        <button
                                            onClick={async () => {
                                                if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
                                                    return;
                                                }
                                                const res = await cancelOrder({ orderId: order._id });
                                                if (res) {
                                                    ReactGA.event({
                                                        category: "Order",
                                                        action: "Cancel_order",
                                                        value: order.totalAmount,
                                                    });
                                                }
                                            }}
                                            disabled={order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'}
                                            className={`text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] transition-colors cursor-pointer ${order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'
                                                ? 'text-neutral-300 cursor-not-allowed'
                                                : 'text-neutral-400 hover:text-red-600'
                                                }`}
                                        >
                                            Cancel Order
                                        </button>

                                        <Link to={`order-details/${order.orderNumber}`}>
                                            <button className="bg-black hover:bg-neutral-800 text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 group">
                                                <span>View Dossier</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};