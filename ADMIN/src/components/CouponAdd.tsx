import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useCreateCoupon, useUpdateCoupon } from "../Hooks/coupon";
import "../index.css";
import { toast } from "sonner";
import type { Coupon } from "../Api/couponApi";

export const AddCoupon = ({ coupon, isUpdate, isModalOpen, setIsModalOpen }: { coupon: Coupon | null, isUpdate: boolean; isModalOpen: boolean; setIsModalOpen: (value: boolean) => void }) => {

    const { mutateAsync: createCoupon, isPending: isCreatingCoupon } = useCreateCoupon();
    const { mutateAsync: updateCoupon, isPending: isUpdatingCoupon } = useUpdateCoupon();
    const isPending = isUpdate ? isUpdatingCoupon : isCreatingCoupon;

    const [formData, setFormData] = useState({
        code: coupon?.code || "",
        discountType: coupon?.discountType || "",
        discountValue: coupon?.discountValue || 0,
        minimumOrderAmount: coupon?.minimumOrderAmount || 0,
        maximumDiscount: coupon?.maximumDiscount || 0,
        usageLimit: coupon?.usageLimit || 0,
        description: coupon?.description || "",
        startDate: coupon?.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : "",
        expiryDate: coupon?.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
        isActive: coupon?.isActive || false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const code = formData.code.trim();
        const regexCode = /^[A-Z0-9]+$/;

        if (code === "") {
            toast.error("Coupon code is required");
            return;
        }
        if (code.length < 3) {
            toast.error("Coupon code must be at least 3 characters long");
            return;
        }
        if (!regexCode.test(code)) {
            toast.error("Coupon code can only contain uppercase letters and numbers (no spaces or special characters)");
            return;
        }
        if (formData.discountType === "") {
            toast.error("Discount type is required");
            return;
        }
        if (formData.discountValue === 0) {
            toast.error("Discount value is required");
            return;
        }
        if (formData.minimumOrderAmount === 0) {
            toast.error("Minimum order amount is required");
            return;
        }
        if (formData.maximumDiscount === 0) {
            toast.error("Maximum discount is required");
            return;
        }
        if (formData.usageLimit === 0) {
            toast.error("Usage limit is required");
            return;
        }
        if (formData.startDate === "") {
            toast.error("Start date is required");
            return;
        }
        if (formData.expiryDate === "") {
            toast.error("Expiry date is required");
            return;
        }
        if (formData.discountType === "percentage" && formData.discountValue > 100) {
            toast.error("Percentage discount cannot be more than 100%")
            return;
        }

        try {
            let res: any;
            if (isUpdate) {
                res = await updateCoupon({ id: coupon._id, coupon: formData })
            }
            else {
                res = await createCoupon(formData)
            }
            if (res.success) {
                setFormData({
                    code: "",
                    discountType: "percentage",
                    discountValue: 0,
                    minimumOrderAmount: 0,
                    maximumDiscount: 0,
                    usageLimit: 0,
                    description: "",
                    startDate: "",
                    expiryDate: "",
                    isActive: true,
                })
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    if (!isModalOpen) return null;

    return createPortal(
        <>
            <div className="animate-fade-in-up-delay-1 fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative bg-white p-5 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-4">{isUpdate ? "Update Coupon" : "Add Coupon"}</h2>
                    <button type="button" className="absolute top-4 right-4" onClick={() => setIsModalOpen(false)}>
                        <X className="text-red-400 text-2xl" />
                    </button>

                    {isPending && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
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

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                <input type="text" placeholder="enter coupon code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} id="code" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
                                <select id="discountType" value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Select Discount Type</option>
                                    <option value="percentage">% (Percentage)</option>
                                    <option value="fixed">₹ (Rupees)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Discount Value</label>
                                <input type="number" placeholder="enter discount value" value={formData.discountValue || ""} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} id="discountValue" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="minimumOrderAmount" className="block text-sm font-medium text-gray-700">Minimum Order Amount</label>
                                <input type="number" placeholder="enter minimum order amount" value={formData.minimumOrderAmount || ""} onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })} id="minimumOrderAmount" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="maximumDiscount" className="block text-sm font-medium text-gray-700">Maximum Discount</label>
                                <input type="number" placeholder="enter maximum discount" value={formData.maximumDiscount || ""} onChange={(e) => setFormData({ ...formData, maximumDiscount: Number(e.target.value) })} id="maximumDiscount" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Usage Limit</label>
                                <input type="number" placeholder="enter usage limit" value={formData.usageLimit || ""} onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} id="usageLimit" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea placeholder="enter description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} id="description" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" placeholder="enter start date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} id="startDate" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input type="date" placeholder="enter expiry date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} id="expiryDate" className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{isUpdate ? "Update" : "Create"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        document.body
    )
}