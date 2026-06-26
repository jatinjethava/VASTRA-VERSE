import { useState } from "react";
import { useCreateAddress, useUpdateAddress } from "../Hooks/user";
import { toast } from "sonner";
import '../index.css'

export const Address = ({ isUpdating, setOpenAddressModel, userData, selectedAddress }: { isUpdating: boolean, setOpenAddressModel: React.Dispatch<React.SetStateAction<boolean>>, userData: any, selectedAddress?: any }) => {

    const { mutateAsync: createAddress } = useCreateAddress();
    const { mutateAsync: updateAddress } = useUpdateAddress();

    const [address, setAddress] = useState({
        fullName: userData?.name || "",
        phone: userData?.mobileNumber || "",
        label: selectedAddress?.label || "Home",
        addressLine1: selectedAddress?.addressLine1 || "",
        addressLine2: selectedAddress?.addressLine2 || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        country: selectedAddress?.country || "",
        pincode: selectedAddress?.pincode || "",
    })

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
        });
    }

    const handleCreateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!address.addressLine1) {
            toast.error("Please fill address line 1");
            return;
        }

        if (!address.city) {
            toast.error("Please fill city");
            return;
        }

        if (!address.state) {
            toast.error("Please fill state");
            return;
        }

        if (!address.country) {
            toast.error("Please fill country");
            return;
        }

        if (!address.pincode) {
            toast.error("Please fill pincode");
            return;
        }

        const { fullName, phone, ...restAddress } = address;

        try {
            if (isUpdating && selectedAddress?._id) {
                const data = await updateAddress({ id: selectedAddress._id, addressData: restAddress });
                if (data.success) {
                    setOpenAddressModel(false);
                }
            } else {
                const data = await createAddress(restAddress);
                if (data.success) {
                    setOpenAddressModel(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="animate-fade-in-up-delay-2 fixed inset-0 bg-black/50 z-1000 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky -top-3 bg-white py-3 z-1000 border-b border-gray-200 flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{isUpdating ? "Update Address" : "Add Address"}</h2>
                        <button
                            onClick={() => setOpenAddressModel(false)}
                            className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 sm:p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={handleCreateAddress}>
                        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="fullName" value={address.fullName} readOnly onChange={handleAddressChange} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm" placeholder="John Doe" />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
                                    <input type="number" name="phone" value={address.phone} readOnly onChange={handleAddressChange} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm" placeholder="1234567890" />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full md:w-2/3">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={userData?.email || ""} readOnly onChange={handleAddressChange} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm" placeholder="john@example.com" />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Label</label>
                                    <select name="label" value={address.label} onChange={handleAddressChange} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all bg-white text-xs sm:text-sm">
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Address Line 1</label>
                                <input
                                    type="text"
                                    placeholder="Street address, P.O. box, etc."
                                    name="addressLine1"
                                    value={address.addressLine1}
                                    onChange={handleAddressChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Address Line 2</label>
                                <input
                                    type="text"
                                    placeholder="Apartment, suite, unit, etc. (optional)"
                                    name="addressLine2"
                                    value={address.addressLine2}
                                    onChange={handleAddressChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        name="country"
                                        value={address.country}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        name="pincode"
                                        maxLength={6}
                                        value={address.pincode}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setOpenAddressModel(false)} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm">Cancel</button>
                            <button type="submit" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-medium bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm">{isUpdating ? "Update Address" : "Save Address"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}