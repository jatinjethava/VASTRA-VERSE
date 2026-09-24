import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "sonner";
import { useCreateReturnRequest } from "../Hooks/return";

export const ReturnRequestModal = ({ orderNumber, items, orderId, onClose }: { orderNumber: string, items: any[], orderId: string, onClose: () => void }) => {

    const { mutateAsync: requestForReturn } = useCreateReturnRequest();

    const [orderItemId, setOrderItemId] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length + images.length > 5) {
                toast.error("You can only upload up to 5 images");
                return;
            }
            setImages([...images, ...selectedFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderItemId) return toast.error("Please select an item to return");
        if (!reason) return toast.error("Please select a reason");
        if (!description.trim()) return toast.error("Please provide a description");

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("orderId", orderId);
            formData.append("orderNumber", orderNumber);
            formData.append("orderItemId", orderItemId);
            formData.append("reason", reason);
            formData.append("description", description);

            images.forEach((img) => {
                formData.append("images", img);
            });

            await requestForReturn(formData);
            onClose();

        } catch (error: any) {
            onClose();
            console.error("Return request failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col p-6 sm:p-9 bg-white shadow-2xl border border-neutral-200/80 mx-auto">
            {/* Specular hairline */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

            <div className="flex w-full justify-between items-center mb-5 sm:mb-6">
                <div>
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-0.5">
                        Concierge Protocol
                    </span>
                    <h2 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                        Initiate <span className="italic font-serif font-normal">Garment Return</span>
                    </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer shrink-0 text-neutral-400 hover:text-black">
                    <MdClose className="text-xl text-neutral-600 hover:text-black" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="bg-neutral-50 border border-neutral-200/80 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-semibold">Associated Order Dossier</p>
                        <p className="text-xs sm:text-sm font-mono font-medium text-neutral-900 mt-0.5">#{orderNumber}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800">
                        Atelier Verification
                    </span>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2">Select Garment to Return *</label>
                    <div className="space-y-2.5">
                        {items?.map((item: any, i: number) => {
                            const itemId = item.productId || `item-${i}`;
                            const isSelected = orderItemId === itemId;
                            return (
                                <label key={itemId} className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-black bg-neutral-50/70 shadow-sm' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                    <input
                                        type="radio"
                                        name="orderItem"
                                        value={itemId}
                                        checked={isSelected}
                                        onChange={() => setOrderItemId(itemId)}
                                        className="w-4 h-4 accent-black mr-3 shrink-0"
                                    />
                                    <div className="flex gap-3 sm:gap-4 items-center min-w-0">
                                        <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.images?.[0] || 'https://via.placeholder.com/50'} alt="product" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-medium text-neutral-900 truncate">{item.title || item.name || "Haute Garment"}</p>
                                            <p className="text-[10px] sm:text-xs text-neutral-400 font-mono mt-0.5 truncate">Size: {item.size} · Color: {item.color}</p>
                                        </div>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Reason for Return *</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-black outline-none transition font-medium text-neutral-900 cursor-pointer"
                    >
                        <option value="">Select a documented reason</option>
                        <option value="Damaged/Defective">Damaged or Defective Textile</option>
                        <option value="Wrong Item">Received Discrepant Article</option>
                        <option value="Size/Fit Issue">Silhouette / Sizing Imprecision</option>
                        <option value="Not as Described">Garment Differs From Description</option>
                        <option value="Changed Mind">Changed Styling Preference</option>
                        <option value="Other">Other Bespoke Requirement</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Detailed Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide details regarding the condition, fit discrepancy, or reason for return..."
                        rows={3}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-black outline-none transition resize-none placeholder:text-neutral-400 font-normal leading-relaxed"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Photographic Evidence (Max 5)</label>
                    <div className="flex gap-2.5 flex-wrap">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 border border-neutral-200 rounded-xl overflow-hidden group shadow-sm">
                                <img src={URL.createObjectURL(img)} alt="upload preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full cursor-pointer shadow-sm">
                                    <MdClose className="text-xs text-white" />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <label className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-neutral-50 transition">
                                <span className="text-lg text-neutral-400">+</span>
                                <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Upload</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3.5 text-xs uppercase tracking-widest font-medium text-neutral-700 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition cursor-pointer"
                    >
                        Dismiss
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-black text-white font-medium text-xs uppercase tracking-widest py-3.5 rounded-full hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {isSubmitting ? "Submitting Protocol..." : "Submit Return Request"}
                    </button>
                </div>
            </form>
        </div>
    )
}