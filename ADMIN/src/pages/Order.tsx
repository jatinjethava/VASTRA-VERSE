import { Eye } from "lucide-react"
import { useFetchAllOrders, useUpdateOrderStatus, useAddReason, useUpdateExpectedDeliveryDate, useRefundPayment } from "../Hooks/order";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import type { Order as OrderType } from "../Api/orderApi";
import { getStatusStyles } from "../interface/function";
import { Link } from "react-router-dom";

export const Order = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: orders, isLoading, error } = useFetchAllOrders(currentPage, itemsPerPage);
    const { mutate: updateOrderStatus } = useUpdateOrderStatus();
    const { mutate: addReason } = useAddReason();
    const { mutate: updateExpectedDeliveryDate } = useUpdateExpectedDeliveryDate();
    const { mutate: refundPayments } = useRefundPayment();

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderModal, setOrderModal] = useState<boolean>(false);
    const [orderReason, setOrderReason] = useState<boolean>(false);
    const [reason, setReason] = useState<string>("");

    const handleUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        if (newStatus === "cancelled") {
            setOrderReason(true);
        } else {
            updateOrderStatus({ id: selectedOrder._id, orderStatus: newStatus });
            setSelectedOrder({
                ...selectedOrder,
                orderStatus: newStatus
            })
        }
    }

    const handleSubmitReason = () => {
        if (!reason.trim()) return;

        updateOrderStatus({ id: selectedOrder._id, orderStatus: "cancelled" });
        addReason({ id: selectedOrder._id, reason: reason.trim() });
        setSelectedOrder({
            ...selectedOrder,
            orderStatus: "cancelled"
        })
        setOrderReason(false);
        setOrderModal(false);
        setReason("");
    }

    const handleCancelReason = () => {
        updateOrderStatus({ id: selectedOrder._id, orderStatus: "cancelled" });
        setSelectedOrder({
            ...selectedOrder,
            orderStatus: "cancelled"
        })
        setOrderReason(false);
        setReason("");
    }

    const [searchCustomer, setSearchCustomer] = useState<string>("");
    const [searchProduct, setSearchProduct] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterPayment, setFilterPayment] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [searchOrderId, setSearchOrderId] = useState<string>("");

    useEffect(() => {
        setCurrentPage(1);
    }, [searchCustomer, searchProduct, filterStatus, filterPayment, sortBy, searchOrderId]);

    const filteredOrders = orders?.orders?.filter((order: OrderType) => {
        let matches = true;

        if (searchOrderId !== "") {
            matches = (order._id || "").toLowerCase().includes(searchOrderId.toLowerCase()) || order.orderNumber?.toString().toLowerCase().includes(searchOrderId.toLowerCase());
        }



        if (searchCustomer !== "") {
            const searchLower = searchCustomer.toLowerCase();
            const anyOrder = order as any;
            const matchesName = anyOrder.shippingAddress?.fullName?.toLowerCase().includes(searchLower);
            const matchesPhone = anyOrder.shippingAddress?.phone?.toString().includes(searchLower);
            if (!(matchesName || matchesPhone)) {
                matches = false;
            }
        }

        if (searchProduct !== "") {
            const searchLower = searchProduct.toLowerCase();
            const anyOrder = order as any;
            const matchesProduct = anyOrder.items?.some((item: any) => item.title?.toLowerCase().includes(searchLower));
            if (!matchesProduct) {
                matches = false;
            }
        }

        if (sortBy !== "") {
            const date = new Date(order.createdAt || "");
            const today = new Date();
            const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            const thisYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

            if (sortBy === "all") {
                matches = true;
            } else if (sortBy === "today") {
                if (date.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
                    matches = false;
                }
            } else if (sortBy === "thisWeek") {
                if (date < thisWeek) {
                    matches = false;
                }
            } else if (sortBy === "thisMonth") {
                if (date < thisMonth) {
                    matches = false;
                }
            } else if (sortBy === "thisYear") {
                if (date < thisYear) {
                    matches = false;
                }
            }
        }

        if (filterStatus !== "all" && order.orderStatus !== filterStatus) {
            matches = false;
        }

        if (filterPayment !== "all" && order.paymentStatus !== filterPayment) {
            matches = false;
        }

        return matches;
    });

    const totalPages = orders?.pagination?.totalPages || Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
    const totalOrders = orders?.pagination?.totalOrders || filteredOrders?.length || 0;
    const indexOfLastOrder = Math.min(currentPage * itemsPerPage, totalOrders);
    const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders;

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <>
            <div className="relative">

                <div className="flex w-full justify-end">
                    <Link to="/admin/orders/return">
                        <button className="cursor-pointer my-4 border border-red-500 hover:text-white hover:bg-red-500 px-4 py-2 text-red-500 text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none shadow-sm text-center">
                            Show Return Orders
                        </button>
                    </Link>
                </div>

                {isLoading && (
                    <div className="absolute top-50 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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

                {error && (
                    <div className="p-10 text-center text-red-500 text-sm">
                        Error loading products: {(error as Error)?.message}
                    </div>
                )}


                <div>
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                        <table className="min-w-[1000px] w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Order ID</span>
                                            <input onChange={(e) => setSearchOrderId(e.target.value)} type="text" placeholder="Search by order id..." className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Customer</span>
                                            <input onChange={(e) => setSearchCustomer(e.target.value)} type="text" placeholder="Search customer..." className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Products</span>
                                            <input onChange={(e) => setSearchProduct(e.target.value)} type="text" placeholder="Search product..." className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Payment</span>
                                            <select
                                                value={filterPayment}
                                                onChange={(e) => setFilterPayment(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                <option value="paid">Paid</option>
                                                <option value="unpaid">Unpaid</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Status</span>
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        <div className="flex flex-col gap-1">
                                            <span>Date</span>
                                            <select
                                                defaultValue="all"
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                <option value="today">Today</option>
                                                <option value="thisWeek">This Week</option>
                                                <option value="thisMonth">This Month</option>
                                                <option value="thisYear">This Year</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {currentOrders?.map((order: any) => {

                                    const statusStyle = getStatusStyles(order.orderStatus);
                                    const StatusIcon = statusStyle.Icon;

                                    return (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-sm text-gray-900">
                                                    {order.orderNumber}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {order._id.slice(-6)}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {order.shippingAddress.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.shippingAddress.phone}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm">
                                                    {order.items[0]?.title}
                                                </div>

                                                {order.items.length > 1 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{order.items.length - 1} more
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                ₹{order.totalAmount}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.text,
                                                    }}
                                                >
                                                    <StatusIcon size={12} />
                                                    {order?.orderStatus}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => { setOrderModal(true); setSelectedOrder(order) }}
                                                    className="px-2 py-2 text-sm text-gray-700 cursor-pointer hover:text-gray-800 transition-all"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between flex-1 sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to <span className="font-medium">{indexOfLastOrder}</span> of{' '}
                                            <span className="font-medium">{totalOrders}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${currentPage === i + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {orderModal && (
                <div onClick={() => setOrderModal(false)} className={`fixed top-0 left-0 bottom-0 right-0 z-50 h-full w-full flex justify-center items-center bg-black/50 ${orderModal ? "" : "hidden"}`}>
                    <div onClick={(e) => e.stopPropagation()} className="animate-fade-in-up-delay-3 w-full sm:w-4/5 md:w-3/5 h-[80vh] rounded-xl mx-auto bg-white flex flex-col">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <button onClick={() => setOrderModal(false)} className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-full cursor-pointer transition-colors">
                                <IoCloseSharp size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">

                            <div className="flex justify-between items-center">
                                <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">User Info</h1>
                                <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Status</h1>
                            </div>
                            <div className="border-b flex justify-between gap-10 border-gray-200 pb-3">
                                <div className="flex gap-10">
                                    <p className="text-sm font-medium">Name : {selectedOrder?.shippingAddress?.fullName}</p>
                                    <p className="text-sm font-medium">Phone : {selectedOrder?.shippingAddress?.phone}</p>
                                </div>

                                <div>
                                    {selectedOrder?.orderStatus !== "cancelled" && selectedOrder?.orderStatus !== "delivered" && (
                                        <>
                                            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                                            <input type="date" onChange={(e) => updateExpectedDeliveryDate({ id: selectedOrder._id, expectedDeliveryDate: e.target.value })} defaultValue={selectedOrder?.expectedDeliveryDate} className="mt-2 border border-gray-300 rounded-md px-2 py-1" />
                                        </>
                                    )}
                                </div>

                                {selectedOrder?.orderStatus === "cancelled" && (
                                    <div className="space-y-2 flex flex-col items-end tracking-wider">
                                        <p className="text-sm w-fit text-end font-bold text-red-500 border border-red-500/30 px-2 py-1 bg-red-500/10 rounded-full">{selectedOrder?.orderStatus?.toUpperCase()}</p>
                                        <p className="text-sm text-end font-medium text-gray-600">{selectedOrder?.reason}</p>
                                    </div>
                                )}

                                {selectedOrder?.orderStatus === "delivered" && (
                                    <div className="space-y-2 flex flex-col items-end tracking-wider">
                                        <p className="text-sm w-fit text-end font-bold text-green-500 border border-green-500/30 px-2 py-1 bg-green-500/10 rounded-full">{selectedOrder?.orderStatus?.toUpperCase()}</p>
                                        <p className="text-sm text-end font-medium text-gray-600">Expected : {new Date(selectedOrder?.expectedDeliveryDate).toLocaleDateString()}</p>
                                    </div>
                                )}

                                {selectedOrder?.orderStatus !== "cancelled" && selectedOrder?.orderStatus !== "delivered" && (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="orderStatus"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Order Status
                                        </label>

                                        <div className="relative">
                                            <select
                                                id="orderStatus"
                                                name="orderStatus"
                                                value={selectedOrder?.orderStatus}
                                                onChange={handleUpdate}
                                                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 cursor-pointer"
                                            >
                                                <option value="pending">🟡 Pending</option>
                                                <option value="confirmed">🔵 Confirmed</option>
                                                <option value="processing">🟣 Processing</option>
                                                <option value="shipped">🟢 Shipped</option>
                                                <option value="delivered">🟢 Delivered</option>
                                                <option value="cancelled">🔴 Cancelled</option>
                                            </select>

                                            <svg
                                                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Info</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <p className="text-gray-500">Order ID</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?._id}</p>
                                    <p className="text-gray-500">Order Number</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.orderNumber}</p>
                                    <p className="text-gray-500">User ID</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.userId}</p>
                                    <p className="text-gray-500">Created At</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "—"}</p>
                                    <p className="text-gray-500">Updated At</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : "—"}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment & Status</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <p className="text-gray-500">Payment Method</p>
                                    <p className="text-gray-900 font-medium capitalize">{selectedOrder?.paymentMethod}</p>
                                    <p className="text-gray-500">Payment Status</p>
                                    <p className="text-gray-900 font-medium capitalize">{selectedOrder?.paymentStatus}</p>
                                    <p className="text-gray-500">Order Status</p>
                                    <p className="text-gray-900 font-medium capitalize">{selectedOrder?.orderStatus}</p>
                                    <p className="text-gray-500">Total Amount</p>
                                    <p className="text-gray-900 font-bold">₹{selectedOrder?.totalAmount}</p>
                                    <p className="text-gray-500">Paid At</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : "—"}</p>
                                    <p className="text-gray-500">Delivered At</p>
                                    <p className="text-gray-900 font-medium">{selectedOrder?.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleString() : "—"}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h3>
                                {selectedOrder?.shippingAddress ? (
                                    <div className="text-sm text-gray-900 space-y-1">
                                        <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                                        <p>{selectedOrder.shippingAddress.phone}</p>
                                        <p>{selectedOrder.shippingAddress.addressLine1}</p>
                                        {selectedOrder.shippingAddress.addressLine2 && (
                                            <p>{selectedOrder.shippingAddress.addressLine2}</p>
                                        )}
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.pincode}</p>
                                        <p>{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No address available</p>
                                )}
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder?.items?.map((item: any) => (
                                        <div key={item.productId} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.basePrice}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">₹{item.basePrice * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Summary</h3>

                                <hr className="border-gray-400 mb-3" />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-700">Subtotal</p>
                                        <p className="text-sm font-medium text-gray-700">₹{selectedOrder?.subtotal}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-700">Tax ({selectedOrder?.gst || 0}%)</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedOrder?.gstAmount ? `₹${selectedOrder?.gstAmount}` : "—"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-700">Shipping</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedOrder?.shippingFee ? `₹${selectedOrder?.shippingFee}` : "Free"}</p>
                                    </div>
                                    {selectedOrder?.discount > 0 && (
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium text-gray-700">Discount</p>
                                            <p className="text-sm font-medium text-gray-700">-₹{selectedOrder?.discount}</p>
                                        </div>
                                    )}

                                    <hr className="border-gray-400" />

                                    <div className="flex justify-between">
                                        <p className="text-md font-semibold text-gray-700">Total</p>
                                        <p className="text-lg font-semibold text-gray-700">₹{selectedOrder?.totalAmount}</p>
                                    </div>

                                    <hr className="border-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="m-5 text-end">
                            {selectedOrder?.orderStatus === "cancelled" ? (
                                <>
                                    {selectedOrder?.paymentStatus === "refunded" ? (
                                        <button
                                            disabled={true}
                                            className="text-gray-800 shadow-lg font-bold tracking-wider rounded-lg border border-gray-600 bg-gray-200 hover:bg-gray-100 px-5 py-2.5 text-lg cursor-pointer transition-colors">
                                            Refund
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => refundPayments(selectedOrder?._id)}
                                            className="text-gray-800 shadow-lg font-bold tracking-wider rounded-lg border border-gray-600 bg-gray-200 hover:bg-gray-100 px-5 py-2.5 text-lg cursor-pointer transition-colors">
                                            Refund
                                        </button>
                                    )}

                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {orderReason && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-60">
                    <div onClick={(e) => e.stopPropagation()} className="animate-fade-in-up-delay-3 mx-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 h-fit rounded-xl bg-white flex flex-col">
                        <div className="m-5">
                            <h2 className="text-xl font-bold text-gray-800">Cancellation Reason</h2>
                            <p className="text-sm text-gray-500 mt-1">Please provide a reason for cancelling this order.</p>
                            <textarea
                                className="w-full h-32 p-2 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                name="reason"
                                placeholder="Enter reason here...."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>

                            <div className="flex justify-end items-center gap-3 mt-3">
                                <button
                                    onClick={handleCancelReason}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReason}
                                    disabled={!reason.trim()}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                >
                                    Confirm Cancellation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}   