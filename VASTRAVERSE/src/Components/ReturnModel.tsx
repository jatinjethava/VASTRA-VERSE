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
        <div className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl flex flex-col p-4 sm:p-8 bg-white shadow-2xl mx-auto">
            <div className="flex w-full justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase">Return Request</h2>
                <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer shrink-0">
                    <MdClose className="text-xl sm:text-2xl text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Number</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 sm:mt-1">#{orderNumber}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Select Item to Return *</label>
                    <div className="space-y-2 sm:space-y-3">
                        {items?.map((item: any, i: number) => {
                            const itemId = item.productId || `item-${i}`;
                            return (
                                <label key={itemId} className={`flex items-center p-2.5 sm:p-3 border rounded-xl cursor-pointer transition-all ${orderItemId === itemId ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="orderItem"
                                        value={itemId}
                                        checked={orderItemId === itemId}
                                        onChange={() => setOrderItemId(itemId)}
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-900 focus:ring-gray-900 border-gray-300 mr-2.5 sm:mr-3 shrink-0"
                                    />
                                    <div className="flex gap-2.5 sm:gap-4 items-center min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.images?.[0] || 'https://via.placeholder.com/50'} alt="product" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.title || item.name || "Premium T-Shirt"}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">Size: {item.size} | Color: {item.color}</p>
                                        </div>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Reason for Return *</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                    >
                        <option value="">Select a reason</option>
                        <option value="Damaged/Defective">Damaged or Defective Product</option>
                        <option value="Wrong Item">Received Wrong Item</option>
                        <option value="Size/Fit Issue">Size or Fit Issue</option>
                        <option value="Not as Described">Product Not as Described</option>
                        <option value="Changed Mind">Changed My Mind</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide more details about why you're returning this item..."
                        rows={3}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Upload Images (Max 5)</label>
                    <div className="flex gap-2 flex-wrap">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 border border-gray-200 rounded-xl overflow-hidden group">
                                <img src={URL.createObjectURL(img)} alt="upload preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white/90 p-0.5 sm:p-1 rounded-full text-red-500 hover:text-red-700 cursor-pointer shadow-sm">
                                    <MdClose className="text-[12px] sm:text-[14px]" />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <label className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                                <span className="text-xl sm:text-2xl text-gray-400">+</span>
                                <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 sm:mt-1">Upload</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 sm:py-4 rounded-xl hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isSubmitting ? "Submitting Request..." : "Submit Return Request"}
                </button>
            </form>
        </div>
    )
}