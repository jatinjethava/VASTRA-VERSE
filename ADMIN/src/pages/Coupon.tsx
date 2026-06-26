import { useMemo, useState } from "react";
import "../index.css";
import { AddCoupon } from "../components/CouponAdd";
import { useFilteredCoupons, useDeleteCoupon, useToggleCoupon } from "../Hooks/coupon";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import type { Coupon as CouponType } from "../Api/couponApi";
import { useGetAllUsers } from "../Hooks/user";
import type { User } from "../Api/userApi";

export const Coupon = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isActiveFilter, setIsActiveFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);
    if (isActiveFilter !== "") queryParams.append("isActive", isActiveFilter);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const { data: coupons, isPending: isFetchingCoupons, isError, error, refetch: refetchCoupons } = useFilteredCoupons();
    const { mutateAsync: deleteCoupon, isPending: isDeletingCoupon } = useDeleteCoupon();
    const { mutateAsync: toggleCoupon, isPending: isTogglingCoupon } = useToggleCoupon();
    const { data: users } = useGetAllUsers();
    const isPending = isFetchingCoupons || isDeletingCoupon || isTogglingCoupon;

    const [couponModal, setCouponModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [coupon, setCoupon] = useState<CouponType | null>(null);

    const filterCoupon = useMemo(() => {
        return coupons?.data?.coupons.filter((coupon: CouponType) => {
            const matchesSearch = !searchTerm || coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesActiveFilter = !isActiveFilter || coupon.isActive === JSON.parse(isActiveFilter);
            const matchesStartDateFilter = !startDate || new Date(coupon.startDate).getTime() >= new Date(startDate).getTime();
            const matchesEndDateFilter = !endDate || new Date(coupon.expiryDate).getTime() <= new Date(endDate).getTime();
            return matchesSearch && matchesActiveFilter && matchesStartDateFilter && matchesEndDateFilter;
        });
    }, [coupons, searchTerm, isActiveFilter, startDate, endDate]);


    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up-delay-1">Coupon</h1>
                    <button
                        type="button"
                        onClick={() => {
                            setIsUpdate(false);
                            setCoupon(null);
                            setCouponModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm animate-fade-in-up-delay-1"
                    >
                        <PlusCircle size={20} />
                        Add Coupon
                    </button>
                </div>

                <div className="flex flex-col xl:flex-row flex-wrap gap-4 mb-6 animate-fade-in-up-delay-1 items-start xl:items-center">
                    <div className="relative flex-1 min-w-[20%] max-w-md w-full">
                        <input
                            type="text"
                            placeholder="Search by code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-4 pr-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>
                    <select
                        value={isActiveFilter}
                        onChange={(e) => setIsActiveFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white min-w-[10%] transition-shadow"
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value) }} className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Expiry Date</label>
                            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value) }} className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-900 transition-colors text-sm font-medium" onClick={() => { setSearchTerm(""); setIsActiveFilter(""); setStartDate(""); setEndDate("") }}>Reset</button>
                    </div>
                </div>

                <div className="relative">
                    {isPending ? (
                        <div className="flex justify-center items-center h-64">
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
                    ) : isError ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-red-500 text-center">
                                <p className="text-lg">{error?.message || "Failed to load coupons"}</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    onClick={() => refetchCoupons()}
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 animate-fade-in-up-delay-2">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Value</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Discount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Limit</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used Count</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {coupons?.data?.coupons && coupons.data.coupons.length > 0 ? (
                                                filterCoupon && filterCoupon.map((coupon: CouponType) => (
                                                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.discountType === 'percentage'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {coupon.discountType}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' ₹'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.minimumOrderAmount} ₹</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.maximumDiscount} ₹</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.usageLimit}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer relative group" onMouseEnter={() => console.log(coupon)}>
                                                            <p className="bg-green-100 text-green-900 rounded-full px-2 py-0.5 w-fit"> {coupon.usedCount}</p>
                                                            <div className="absolute bottom-full left-30 -translate-x-1/2 mb-2 w-60 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal text-center">
                                                                {(() => {
                                                                    const usedByIds = (coupon as any).usedBy;

                                                                    if (usedByIds && Array.isArray(usedByIds) && usedByIds.length > 0) {
                                                                        const matchedUsers = users?.filter(u => usedByIds.includes(u._id));

                                                                        return matchedUsers && matchedUsers.length > 0
                                                                            ? matchedUsers.map(u => u.name).join(', ')
                                                                            : 'No users';
                                                                    }

                                                                    return 'No users';
                                                                })()}
                                                                <div className="absolute top-full left-1/4 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(coupon.startDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <button onClick={() => {
                                                                toggleCoupon(coupon._id);
                                                            }} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${coupon.isActive
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setCoupon(coupon)
                                                                    setIsUpdate(true)
                                                                    setCouponModal(true);
                                                                }}
                                                                className="text-indigo-600 cursor-pointer hover:text-indigo-900 transition-colors">
                                                                <Edit size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm("Are you sure you want to delete this coupon?")) {
                                                                        deleteCoupon(coupon._id)
                                                                    }
                                                                }}
                                                                disabled={isPending}
                                                                className="text-red-600 cursor-pointer hover:text-red-900 transition-colors">
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={10} className="px-6 py-8 text-center">
                                                        <p className="text-gray-500">No coupons found</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    )}
                </div>

                {couponModal && <AddCoupon coupon={coupon} isUpdate={isUpdate} isModalOpen={couponModal} setIsModalOpen={setCouponModal} />}
            </div>
        </>
    )
}