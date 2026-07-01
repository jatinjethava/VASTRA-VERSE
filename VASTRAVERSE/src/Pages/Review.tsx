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
        <div className="w-full min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reviews</h1>
                    <p className="mt-2 text-sm text-gray-500">Manage and view all the reviews you have written for products.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
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
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">Failed to load your reviews.</div>
                ) : myReviews?.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
                        <p className="text-gray-500 mt-2 mb-6">You haven't written any reviews for products yet.</p>
                        <button onClick={() => navigate('/')} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {myReviews?.map((review: any) => (
                            <div key={review._id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                    <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-6 flex flex-row md:flex-col items-center md:items-start text-left gap-3 md:gap-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-xl shrink-0 border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shadow-sm">
                                            <img
                                                src={review?.images || "/placeholder.png"}
                                                alt={review.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 md:mt-3">
                                            <h4 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-tight">{review.name}</h4>
                                            <button
                                                onClick={() => showProduct(review?.productId)}
                                                className="mt-1 sm:mt-2 text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-semibold flex items-center gap-1 group w-fit"
                                            >
                                                View Product <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-between pt-1 md:pt-0">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`sm:w-4 sm:h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 leading-snug">{review.title}</h3>
                                            <p className="text-gray-600 text-xs sm:text-base leading-relaxed whitespace-pre-line">{review.comment}</p>
                                        </div>

                                        <div className="flex flex-col gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                        <FaThumbsUp className="text-gray-400" />
                                                        <span className="font-semibold text-gray-900">{review.likes || 0}</span> Likes
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold text-gray-900">{review.helpfulCount || 0}</span> Found Helpful
                                                    </div>
                                                </div>

                                                {!review?.adminReply && (
                                                    <button
                                                        onClick={() => reportReview(review._id)}
                                                        className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 hover:underline underline-offset-2 transition-all self-start sm:self-auto"
                                                    >
                                                        Report to admin
                                                    </button>
                                                )}
                                            </div>

                                            {review?.adminReply && (
                                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-2">
                                                    <div className="flex flex-col sm:flex-row items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                            <span className="text-blue-600 font-bold text-xs sm:text-sm">V</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider mb-1 block">Vastra Verse Admin</span>
                                                            <p className="text-xs sm:text-sm text-blue-800/80 leading-relaxed whitespace-pre-line">
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