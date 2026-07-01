import { useState } from "react";
import { X, Star, UploadCloud } from "lucide-react";
import '../index.css'
import { useCreateReview } from "../Hooks/review";
import { useGetCurrentUser } from "../Hooks/user";

export const AddReview = ({ setAddReview, productId }: { setAddReview: (addReview: boolean) => void, productId: string }) => {


    const { mutateAsync: createReview, isPending: isLoadingReview } = useCreateReview();
    const { data: user } = useGetCurrentUser();
    const userData = user?.data?.user;

    const [reviewData, setReviewData] = useState({
        rating: 0,
        hoverRating: 0,
        title: "",
        comment: "",
        images: [] as File[],
        recommended: false
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setReviewData((prev) => ({ ...prev, images: Array.from(e.target.files || []) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("rating", reviewData.rating.toString());
        formData.append("title", reviewData.title);
        formData.append("comment", reviewData.comment);
        formData.append("recommended", reviewData.recommended.toString());

        if (reviewData.images && reviewData.images.length > 0) {
            reviewData.images.forEach((img) => {
                formData.append("images", img);
            });
        } else if (userData?.profileImage) {
            formData.append("images", userData.profileImage);
        }

        try {
            await createReview(formData as any);
            setReviewData({
                rating: 0,
                hoverRating: 0,
                title: "",
                comment: "",
                images: [],
                recommended: false,
            });
            setAddReview(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 transition-opacity animate-in fade-in duration-200">
            <div className="animate-fade-in-up-delay-1 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-8 w-full max-w-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">

                {isLoadingReview && (
                    <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50 rounded-2xl sm:rounded-3xl">
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

                <div className="sticky -top-4 sm:-top-6 md:-top-8 bg-white py-3 sm:py-4 z-40 border-b border-gray-100 flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Write a Review</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Share your experience with this product.</p>
                    </div>
                    <button
                        onClick={() => setAddReview(false)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-900" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Overall Rating *</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-all duration-200 ${(reviewData.hoverRating || reviewData.rating) >= star
                                        ? "fill-yellow-400 text-yellow-400 scale-110"
                                        : "fill-gray-100 text-gray-300 hover:scale-110"
                                        }`}
                                    onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                    onMouseEnter={() => setReviewData((prev) => ({ ...prev, hoverRating: star }))}
                                    onMouseLeave={() => setReviewData((prev) => ({ ...prev, hoverRating: 0 }))}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Review Title *</label>
                        <input
                            type="text"
                            placeholder="Sum up your experience in a few words"
                            name="title"
                            value={reviewData.title}
                            onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Detailed Review *</label>
                        <textarea
                            rows={4}
                            placeholder="Share your thoughts (optional)"
                            name="comment"
                            value={reviewData.comment}
                            onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Do you recommend this product? *</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="recommended"
                                    value="true"
                                    checked={reviewData.recommended === true}
                                    onChange={(e) => setReviewData((prev) => ({ ...prev, recommended: e.target.value === "true" }))}
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                    required
                                />
                                <span className="text-xs sm:text-sm text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="recommended"
                                    value="false"
                                    checked={reviewData.recommended === false}
                                    onChange={(e) => setReviewData((prev) => ({ ...prev, recommended: e.target.value === "true" }))}
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                    required
                                />
                                <span className="text-xs sm:text-sm text-gray-700">No</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                            Add Photos (Optional)
                        </label>

                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                        >
                            <UploadCloud className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-3" />

                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                                Click to upload images
                            </p>

                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                PNG, JPG, WEBP up to 10MB
                            </p>

                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {reviewData.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                                    {reviewData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                                        >
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`preview-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setReviewData((prev) => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))
                                                }}
                                                className="absolute top-1 right-1 p-0.5 sm:p-1 cursor-pointer bg-white/80 hover:bg-red-400 rounded-full sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                                            >
                                                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-900 sm:text-gray-100" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-2.5 sm:gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setAddReview(false)}
                            className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-gray-900 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            disabled={!reviewData.rating || !reviewData.title || !reviewData.comment}
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}