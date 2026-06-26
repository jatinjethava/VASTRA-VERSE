import { useAdminReply, useDeleteReview, useFetchAllReviewsByAdmin, useVerifyReview } from "../../Hooks/review";
import { useGetProducts } from "../../Hooks/product";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { FaReply } from "react-icons/fa6";

export const Review = () => {

    const { data: reviews, isLoading, error } = useFetchAllReviewsByAdmin();
    const { data: products, isLoading: productsLoading } = useGetProducts();
    const { mutateAsync: verifyReview } = useVerifyReview();
    const { mutateAsync: deleteReview } = useDeleteReview();
    const { mutateAsync: reply } = useAdminReply();

    const [replyOpen, setReplyOpen] = useState<boolean>(false);
    const [replyData, setReplyData] = useState<{ id: string, reply: string } | null>(null);

    const groupedReviews = useMemo(() => {
        if (!reviews?.data?.reviews || !products) return [];

        const grouped: Record<string, { product: any, reviews: any[] }> = {};

        products.forEach(product => {
            if (product._id) {
                grouped[product._id] = { product, reviews: [] };
            }
        });

        reviews.data.reviews.forEach(review => {
            const pid = review.productId;
            if (grouped[pid]) {
                grouped[pid].reviews.push(review);
            } else {
                grouped[pid] = {
                    product: { title: "Unknown Product", _id: pid },
                    reviews: [review]
                };
            }
        });

        return Object.values(grouped).filter(group => group.reviews.length > 0);
    }, [reviews, products]);

    const submitReplay = async () => {
        if (!replyData) return;
        try {
            await reply({ id: replyData.id, reply: replyData.reply });
            setReplyOpen(false);
            setReplyData(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="relative">
            {(isLoading || productsLoading) && (
                <div className="absolute top-50 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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

            {error && (
                <div className="flex justify-center items-center">
                    <p className="text-red-500">{error.message}</p>
                </div>
            )}

            {groupedReviews.length > 0 ? (
                <div className="space-y-8">
                    {groupedReviews.map((group) => (
                        <div key={group.product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {group.product.images?.[0] ? (
                                        <img src={group.product.images[0]} alt={group.product.title} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                            <span className="text-xl">👕</span>
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{group.product.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500 font-medium">{group.reviews.length} {group.reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-indigo-600 font-medium">ID: {group.product._id?.substring(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                                            <th className="px-6 py-3 font-medium">User</th>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Rating</th>
                                            <th className="px-6 py-3 font-medium">Review</th>
                                            <th className="px-6 py-3 font-medium">Likes</th>
                                            <th className="px-6 py-3 font-medium">Helpful</th>
                                            <th className="px-6 py-3 font-medium">Recommended</th>
                                            <th className="px-6 py-3 font-medium">Verified</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {group.reviews.map((review) => (
                                            <tr key={review._id} className="hover:bg-gray-50/50 transition-colors duration-200">

                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="inline-flex items-center justify-start">
                                                            <img src={review?.images} className="w-12 rounded-full h-12" alt={review?.user?.name} />
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="inline-flex items-center text-sm font-medium justify-start">
                                                            {review?.user?.name}
                                                        </span>
                                                        <span className="inline-flex tracking-wider items-center text-xs text-gray-400 justify-start">
                                                            {review?.user?.email}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-yellow-400 text-lg leading-none">{'★'.repeat(review.rating)}</span>
                                                        <span className="text-gray-200 text-lg leading-none">{'★'.repeat(5 - review.rating)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 max-w-xs">
                                                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">{review.title}</p>
                                                    <p className="text-sm text-gray-500 truncate">{review.comment}</p>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-2.5 py-1 rounded-lg border border-gray-100">
                                                        {review.likes || 0}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-2.5 py-1 rounded-lg border border-gray-100">
                                                        {review.helpfulCount || 0}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {review.recommended ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Yes</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">No</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {review.isVerifiedPurchase ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">Unverified</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!review?.isVerifiedPurchase && (
                                                            <button
                                                                onClick={() => verifyReview(review._id as string)}
                                                                disabled={review.isVerifiedPurchase}
                                                                className={review.isVerifiedPurchase ? "px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" : "px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-100 hover:bg-emerald-50 rounded-lg transition"}
                                                            >
                                                                {review.isVerifiedPurchase ? "Verified" : "Verify"}
                                                            </button>
                                                        )}

                                                        {!review?.adminReply && (
                                                            <button
                                                                onClick={() => {
                                                                    setReplyData({ id: review._id as string, reply: review.adminReply || "" });
                                                                    setReplyOpen(true);
                                                                }}
                                                                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                                            >
                                                                <FaReply />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => deleteReview(review._id as string)}
                                                            className="px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                                        >
                                                            <Trash2 size={16} /> <p className="font-medium">Delete</p>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
                        <p className="text-sm text-gray-500 text-center max-w-sm">There are currently no product reviews available. They will appear here once customers start reviewing products.</p>
                    </div>
                )
            )}

            {replyOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl w-150 p-6">
                        <h1 className="text-xl font-semibold mb-5 text-gray-700">Give reply for this review</h1>

                        <textarea
                            value={replyData?.reply || ""}
                            onChange={(e) => setReplyData(prev => prev ? { ...prev, reply: e.target.value } : null)}
                            placeholder="Type your reply here..."
                            className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => { setReplyOpen(false); setReplyData(null); }} className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-lg">Cancel</button>
                            <button onClick={submitReplay} className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-900 cursor-pointer rounded-lg">Reply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}