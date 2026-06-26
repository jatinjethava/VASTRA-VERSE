import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCancelOrder, useGetUserOrder } from "../Hooks/order";
import ReactGA from "react-ga4";

export const OrderList = () => {

    const { data: orders, isLoading, error } = useGetUserOrder();
    const { mutateAsync: cancelOrder } = useCancelOrder();

    useEffect(() => {
        document.title = "Order List | Vastra Verse";
        ReactGA.event({
            category: "Order",
            action: "View_order_list",
            value: orders?.length,
        });
    }, [orders]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh] relative">
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

    if (error) {
        return (
            <div className="flex justify-center items-center h-[70vh] relative">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-gray-800 mb-2">Server Problem May Be</h2>
                    <p className="text-gray-500 text-lg mb-4">Or You Dont have any orders yet</p>
                    <Link to="/">
                        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition tracking-widest shadow-md">
                            START SHOPPING
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0 animate-fade-in-up">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">My <span className="text-gray-500">Orders</span></h1>
                    <Link to="/" className="text-[11px] sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 transition-all">
                        Continue Shopping
                    </Link>
                </div>

                <div className="space-y-4 sm:space-y-6 animate-fade-in-up-delay-1">
                    {!orders || orders.length === 0 ? (
                        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No orders found</h2>
                            <p className="text-[11px] sm:text-sm text-gray-500 mb-6">Looks like you haven't made your first order yet.</p>
                            <Link to="/">
                                <button className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-800 transition tracking-widest shadow-md">
                                    START SHOPPING
                                </button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderNumber} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex flex-wrap w-full md:w-auto gap-x-6 sm:gap-x-8 gap-y-3 text-xs sm:text-sm text-gray-600 justify-between sm:justify-start">
                                        <div>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5 sm:mb-1">Order Number</p>
                                            <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5 sm:mb-1">Date Placed</p>
                                            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5 sm:mb-1">Total Amount</p>
                                            <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto pt-2 md:pt-0 border-t border-gray-200 md:border-t-0">
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                                            <span className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                            {order.paymentMethod && (
                                                <span className="text-[9px] sm:text-[10px] text-gray-500 mt-0 md:mt-1 uppercase tracking-wider font-semibold">
                                                    {order.paymentMethod}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 sm:px-6 py-4 sm:py-5">
                                    <div className="flex flex-col gap-4 sm:gap-5">
                                        {order?.items.map((item: any, idx: number) => {
                                            const itemDetail = item.items?.[0] || item;
                                            const name = item.title || itemDetail.title || "Premium T-Shirt";
                                            const images = item.images && item.images.length > 0 ? item.images[0] : itemDetail.images && itemDetail.images.length > 0 ? itemDetail.images[0] : "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
                                            const price = item.discountPrice || itemDetail.discountPrice || itemDetail.basePrice || 0;

                                            return (
                                                <div key={idx} className="flex items-start sm:items-center gap-3 sm:gap-5">
                                                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img src={images as string} alt={name} className="h-full w-full object-cover object-center" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between h-full py-0.5 sm:py-1">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                            <div>
                                                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">{name}</h3>
                                                                <div className="mt-1 flex text-[10px] sm:text-xs text-gray-500 gap-2 sm:gap-3">
                                                                    <p>Size: <span className="font-medium text-gray-700">{item.size || 'L'}</span></p>
                                                                    <p className="border-l border-gray-300 pl-2 sm:pl-3">Color: <span className="font-medium text-gray-700">{item.color || 'White'}</span></p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs sm:text-sm font-bold text-gray-900">₹{price * (item.quantity || 1)}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between mt-2 sm:mt-0 text-[10px] sm:text-sm">
                                                            <p className="text-gray-500">Qty <span className="font-medium text-gray-700">{item.quantity || 1}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-5 sm:mt-6 pt-4 flex justify-between items-center gap-2 border-t border-gray-100">
                                        <button
                                            onClick={async () => {
                                                if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
                                                    return;
                                                }
                                                const res = await cancelOrder({ orderId: order._id })
                                                if (res) {
                                                    ReactGA.event({
                                                        category: "Order",
                                                        action: "Cancel_order",
                                                        value: order.totalAmount,
                                                    });
                                                }
                                            }}
                                            className="text-[11px] sm:text-sm font-semibold text-red-600 hover:text-gray-600 flex items-center gap-1 group transition-colors">
                                            Cancel Order
                                        </button>
                                        <Link to={`order-details/${order.orderNumber}`}>
                                            <button
                                                className="text-[11px] sm:text-sm font-semibold text-gray-900 hover:text-gray-600 flex items-center gap-0.5 sm:gap-1 group transition-colors">
                                                View Details
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
};