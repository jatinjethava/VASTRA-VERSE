import { useGetMyReviews, useReportReview } from "../Hooks/review";
import { Star, ArrowRight } from "lucide-react";
import { FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetAllProducts } from "../Hooks/product";
import type { Product } from "../Api/productApi";

export const MyReview = () => {
    const { data: myReviews, isLoading: reviewLoading, isError: reviewError } = useGetMyReviews();
    const { data, isLoading: productLoading, isError: productError } = useGetAllProducts();
    const { mutate: reportReview } = useReportReview();
    const isLoading = reviewLoading || productLoading;
    const isError = reviewError || productError;
    const navigate = useNavigate();

    const showProduct = (id: string) => {
        const product = data?.find((p: Product) => p._id === id);
        navigate(`/more-details`, { state: { product: product } })
    }

    return (
        <div className="w-full min-h-screen bg-[#fafafa] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                        Patron Testimonials
                    </span>
                    <h1 className="editorial-text text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
                        Client <span className="italic font-serif font-normal">Appraisals</span>
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 font-light">
                        Archive of your personal critique, fabric evaluations, and bespoke appraisals.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="dot-spinner" />
                    </div>
                ) : isError ? (
                    <div className="bg-neutral-100 border border-neutral-300 text-neutral-700 p-6 rounded-2xl text-center text-xs sm:text-sm">
                        Unable to synchronize client appraisals archive.
                    </div>
                ) : myReviews?.length === 0 ? (
                    <div className="relative bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200">
                            <Star className="text-neutral-400" size={24} />
                        </div>
                        <h3 className="editorial-text text-xl font-light text-neutral-900">No Appraisals Recorded</h3>
                        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1.5 mb-6 max-w-sm mx-auto">
                            You have not submitted any reviews or assessments for garments in your wardrobe yet.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-black hover:bg-neutral-800 text-white px-7 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition cursor-pointer shadow-md"
                        >
                            Explore Atelier Collection
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {myReviews?.map((review: any) => (
                            <div
                                key={review._id}
                                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                            >
                                
                                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-neutral-100 pb-4 md:pb-0 md:pr-6 flex flex-row md:flex-col items-center md:items-start text-left gap-4 md:gap-0">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-2xl shrink-0 border border-neutral-200/80 bg-neutral-50 overflow-hidden flex items-center justify-center shadow-inner">
                                            <img
                                                src={(review.images && review.images.length > 0) ? review.images[0] : (review.productId?.images?.[0] || "/placeholder.png")}
                                                alt={review.productId?.name || "Product"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 justify-center md:mt-3">
                                            <h4 className="font-medium text-neutral-900 text-xs sm:text-sm md:text-base line-clamp-2 leading-tight">
                                                {review.productId?.name || "Bespoke Garment"}
                                            </h4>
                                            <button
                                                onClick={() => showProduct(review.productId?._id || review.productId)}
                                                className="mt-1.5 sm:mt-2 text-neutral-900 hover:text-black text-[9px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1 group w-fit cursor-pointer underline-offset-4 hover:underline whitespace-nowrap"
                                            >
                                                Inspect Garment <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform sm:w-[13px] sm:h-[13px]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-between pt-1 md:pt-0">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={15}
                                                            className={`${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] sm:text-xs text-neutral-400 font-mono uppercase tracking-wider whitespace-nowrap">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1.5 leading-snug">
                                                {review.title}
                                            </h3>
                                            <p className="text-neutral-600 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
                                                {review.comment}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-4 mt-6 pt-5 border-t border-neutral-100">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-light">
                                                        <FaThumbsUp className="text-neutral-400" />
                                                        <span className="font-semibold text-neutral-900 font-mono">{review.likes || 0}</span> Endorsements
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-light">
                                                        <span className="font-semibold text-neutral-900 font-mono">{review.helpfulCount || 0}</span> Found Discerning
                                                    </div>
                                                </div>

                                                {!review?.adminReply && !review?.reported && (
                                                    <button
                                                        onClick={() => reportReview(review._id)}
                                                        className="text-xs font-medium text-neutral-400 hover:text-neutral-900 transition-all self-start sm:self-auto cursor-pointer"
                                                    >
                                                        Flag for Atelier Concierge
                                                    </button>
                                                )}
                                                {!review?.adminReply && review?.reported && (
                                                    <div className="text-xs font-medium text-amber-600 self-start sm:self-auto">
                                                        Under Concierge Review
                                                    </div>
                                                )}
                                            </div>

                                            {review?.adminReply && (
                                                <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 mt-2">
                                                    <div className="flex flex-col sm:flex-row items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-serif italic">
                                                            V
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1 block">
                                                                Vastraverse Atelier Curators
                                                            </span>
                                                            <p className="text-xs text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                                                                {review?.adminReply}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}