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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-1000 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200">
                <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95 duration-200">
                    
                    {/* Top specular highlight accent */}
                    <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                    <div className="sticky -top-6 bg-white pt-2 pb-4 z-10 border-b border-neutral-100 flex items-center justify-between mb-5">
                        <div>
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                Shipping Destination
                            </span>
                            <h2 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                                {isUpdating ? "Update" : "Add"} <span className="italic font-serif font-normal">Address</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => setOpenAddressModel(false)}
                            className="text-neutral-400 hover:text-black bg-neutral-100 p-2 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleCreateAddress}>
                        <div className="mb-6 flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Full Name</label>
                                    <input type="text" name="fullName" value={address.fullName} readOnly onChange={handleAddressChange} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-medium outline-none text-xs sm:text-sm cursor-not-allowed" placeholder="John Doe" />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Phone</label>
                                    <input type="number" name="phone" value={address.phone} readOnly onChange={handleAddressChange} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-medium outline-none text-xs sm:text-sm cursor-not-allowed" placeholder="1234567890" />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full md:w-2/3">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Email</label>
                                    <input type="email" name="email" value={userData?.email || ""} readOnly onChange={handleAddressChange} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-medium outline-none text-xs sm:text-sm cursor-not-allowed" placeholder="john@example.com" />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Label</label>
                                    <select name="label" value={address.label} onChange={handleAddressChange} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-neutral-50 font-medium text-neutral-900 text-xs sm:text-sm cursor-pointer">
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Address Line 1</label>
                                <input
                                    type="text"
                                    placeholder="Street address, P.O. box, suite"
                                    name="addressLine1"
                                    value={address.addressLine1}
                                    onChange={handleAddressChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Apartment, suite, unit, building floor"
                                    name="addressLine2"
                                    value={address.addressLine2}
                                    onChange={handleAddressChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">City</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">State</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        name="country"
                                        value={address.country}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        name="pincode"
                                        maxLength={6}
                                        value={address.pincode}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:border-black focus:ring-1 focus:ring-black font-medium outline-none transition-all text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                            <button type="button" onClick={() => setOpenAddressModel(false)} className="px-5 py-2.5 rounded-xl font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors text-xs sm:text-sm uppercase tracking-wider cursor-pointer">Cancel</button>
                            <button type="submit" className="px-6 py-2.5 rounded-xl font-medium bg-black text-white hover:bg-neutral-800 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all text-xs sm:text-sm uppercase tracking-[0.15em] cursor-pointer">{isUpdating ? "Update Address" : "Save Address"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}