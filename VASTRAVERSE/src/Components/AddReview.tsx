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
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-opacity animate-in fade-in duration-200">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-neutral-200/80 p-6 sm:p-8 w-full max-w-lg animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">

                
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                {isLoadingReview && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl">
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

                <div className="sticky -top-6 -mt-2 bg-white/95 backdrop-blur-sm pt-2 pb-4 z-40 border-b border-neutral-100 flex items-center justify-between mb-5">
                    <div>
                        <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block">
                            Garment Critique
                        </span>
                        <h2 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                            Submit <span className="italic font-serif font-normal">Appraisal</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => setAddReview(false)}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-neutral-500 hover:text-black"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                    <div>
                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">
                            Overall Rating *
                        </label>
                        <div className="flex gap-1.5 items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-all duration-200 ${(reviewData.hoverRating || reviewData.rating) >= star
                                        ? "fill-amber-400 text-amber-400 scale-110"
                                        : "fill-neutral-100 text-neutral-300 hover:scale-110"
                                        }`}
                                    onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                    onMouseEnter={() => setReviewData((prev) => ({ ...prev, hoverRating: star }))}
                                    onMouseLeave={() => setReviewData((prev) => ({ ...prev, hoverRating: 0 }))}
                                />
                            ))}
                            {reviewData.rating > 0 && (
                                <span className="text-xs font-mono font-medium text-neutral-500 ml-2">
                                    {reviewData.rating} / 5
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">
                            Appraisal Headline *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Exceptional drape and artisanal finish"
                            name="title"
                            value={reviewData.title}
                            onChange={(e) => setReviewData((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-black outline-none transition font-medium placeholder:text-neutral-400"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">
                            Detailed Critique *
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Share your experience regarding texture, silhouette, sizing precision, and comfort..."
                            name="comment"
                            value={reviewData.comment}
                            onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-black outline-none transition font-normal placeholder:text-neutral-400 resize-none leading-relaxed"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2">
                            Recommend to Discerning Patrons? *
                        </label>
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${reviewData.recommended === true ? "bg-black text-white border-black" : "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
                                <input
                                    type="radio"
                                    name="recommended"
                                    value="true"
                                    checked={reviewData.recommended === true}
                                    onChange={(e) => setReviewData((prev) => ({ ...prev, recommended: e.target.value === "true" }))}
                                    className="hidden"
                                    required
                                />
                                <span>✦ Highly Recommend</span>
                            </label>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${reviewData.recommended === false ? "bg-neutral-800 text-white border-neutral-800" : "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
                                <input
                                    type="radio"
                                    name="recommended"
                                    value="false"
                                    checked={reviewData.recommended === false}
                                    onChange={(e) => setReviewData((prev) => ({ ...prev, recommended: e.target.value === "true" }))}
                                    className="hidden"
                                    required
                                />
                                <span>✕ Do Not Recommend</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">
                            Garment Imagery (Optional)
                        </label>

                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:border-black hover:bg-neutral-50/50 transition"
                        >
                            <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />

                            <p className="text-xs font-medium text-neutral-700">
                                Click or drag photographic appraisal
                            </p>

                            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">
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
                                <div className="flex flex-wrap gap-2.5 mt-4">
                                    {reviewData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative group w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shadow-sm"
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
                                                className="absolute top-1 right-1 p-1 cursor-pointer bg-black/70 hover:bg-black text-white rounded-full transition-opacity flex items-center justify-center shadow-sm"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setAddReview(false)}
                            className="flex-1 py-3 text-xs uppercase tracking-widest font-medium text-neutral-700 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Dismiss
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 text-xs uppercase tracking-widest font-medium text-white bg-black rounded-full hover:bg-neutral-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                            disabled={!reviewData.rating || !reviewData.title || !reviewData.comment}
                        >
                            Publish Appraisal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}