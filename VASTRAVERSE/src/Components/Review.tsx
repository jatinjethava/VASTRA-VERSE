import { useState } from "react";
import { Star, BadgeCheck, Quote } from "lucide-react";
import { AddReview } from './AddReview';
import { useGetProductAllReview, useHelpfulReview, useLikeReview, useMatchLike } from "../Hooks/review";
import { FaRegStar, FaRegThumbsUp, FaStar, FaStarHalfAlt, FaThumbsUp } from "react-icons/fa";
import '../index.css'

export const StarRating = ({ rating = 0, size = 12 }: { rating?: number; size?: number }) => {
    return (
        <div className="flex gap-1 text-yellow-400 text-sm">
            {[1, 2, 3, 4, 5].map((star) => {
                if (rating >= star) {
                    return <FaStar key={star} style={{ width: size, height: size }} />;
                }
                if (rating >= star - 0.5) {
                    return <FaStarHalfAlt key={star} />;
                }
                return <FaRegStar key={star} />;
            })}
        </div>
    );
};

export const Reviews = ({ productId }: { productId: string }) => {



    const { data: reviewsData = [] } = useGetProductAllReview(productId);
    const { mutate: likeReview } = useLikeReview();
    const { mutate: helpfulReview } = useHelpfulReview();
    const { data: matchLike } = useMatchLike(productId);
    const likedReviewIds = matchLike?.likedReviewIds || [];

    const [addReview, setAddReview] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<number>(0);
    const [hoveredReview, setHoveredReview] = useState(null);

    const totalReviews = reviewsData?.length;

    const calculateRating = [5, 4, 3, 2, 1].map((star) => {
        const count = reviewsData?.filter(
            (review) => review.rating === star
        ).length;


        return {
            star,
            count,
            percentage: Math.round((count / totalReviews) * 100),
        };
    });

    const filters = [
        "All reviews",
        "5 stars",
        "4 stars",
        "3 stars",
        "Critical",
        "Verified only",
    ];

    const totalRating = reviewsData?.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsData?.length;

    const filterReview = () => {
        switch (activeFilter) {
            case 0:
                return reviewsData;
            case 1:
                return reviewsData.filter((review) => review.rating === 5);
            case 2:
                return reviewsData.filter((review) => review.rating === 4);
            case 3:
                return reviewsData.filter((review) => review.rating === 3);
            case 4:
                return reviewsData.filter((review) => review.rating === 2);
            case 5:
                return reviewsData.filter((review) => review.rating === 1);
            default:
                return reviewsData;
        }
    }


    return (
        <div className="w-full py-10 px-2 md:px-6">
            <div className="w-full max-w-5xl mx-auto">

                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="w-1 sm:w-1.5 h-6 sm:h-8 rounded-full from-yellow-400 to-amber-500" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                        Customer Reviews
                    </h2>

                    <button onClick={() => setAddReview(true)} className="ml-auto text-gray-700 py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer shrink-0">Add Review</button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                    <div className="rounded-2xl border border-gray-200 from-gray-50 to-white flex flex-col items-center justify-center shrink-0 px-6 py-6 sm:px-10 sm:py-8 shadow-sm">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
                            {averageRating.toFixed(1)}
                        </h1>
                        <div className="flex items-center gap-0.5 mt-2 sm:mt-3">
                            <StarRating rating={averageRating} />
                        </div>
                        <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
                            {reviewsData?.length} reviews
                        </p>
                    </div>

                    <div className="flex-1 space-y-3 justify-center flex flex-col">
                        {calculateRating?.map((item) => (
                            <div
                                key={item.star}
                                className="flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="flex items-center gap-1 w-10 shrink-0">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {item.star}
                                    </span>
                                    <Star
                                        size={13}
                                        className="fill-yellow-400 text-yellow-400"
                                    />
                                </div>

                                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out bg-gray-400 shadow-xs group-hover:bg-gray-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>

                                <span className="text-sm text-gray-400 font-medium w-12 text-right tabular-nums">
                                    {item.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-6 sm:mt-8">
                    {filters.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveFilter(index)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-200 text-xs sm:text-sm font-semibold cursor-pointer shrink-0
                                ${activeFilter === index
                                    ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-900/10"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex md:flex-row md:items-center gap-4">
                    <p className="text-gray-400 text-xs font-medium">
                        Showing {reviewsData.length} of {reviewsData.length} reviews
                    </p>

                    <button className="ml-auto rounded-xl px-3 py-1 sm:px-5 sm:py-3 flex items-center gap-3">
                        <hr className="bg-black/10 w-16 h-0.5" />
                        <span className="font-semibold text-gray-700 text-xs">
                            Highest rated
                        </span>
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {filterReview().map((review, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group overflow-hidden"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                                <div className="flex gap-3 sm:gap-4 items-center sm:items-start">

                                    <div
                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${review.avatarColor || 'bg-gray-800'} text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0`}
                                    >
                                        {review?.user?.name.charAt(0) + review?.user?.name.charAt(1) || "U"}
                                    </div>


                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                                            {review?.user?.name || "User"}
                                        </h3>
                                        <div className="flex flex-wrap text-[10px] sm:text-xs items-center gap-1 sm:gap-1.5 mt-0.5">
                                            <div className="flex text-gray-500 tracking-wider items-center max-w-[120px] sm:max-w-[200px] truncate">
                                                {review?.user?.email || "User"}
                                            </div>
                                            <span className="w-1 h-1 mx-0.5 sm:mx-1 bg-gray-300 rounded-full shrink-0"></span>
                                            <p className="text-gray-400 font-medium shrink-0">
                                                {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 ml-[3.25rem] sm:ml-0">
                                    {review.recommended && (
                                        <span className="inline-flex bg-emerald-50 text-emerald-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border border-emerald-100 shrink-0">
                                            Recommended
                                        </span>
                                    )}
                                    <div className="flex items-center gap-0.5 shrink-0">
                                        <StarRating rating={review.rating} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 sm:mt-4 sm:pl-15">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors break-words">
                                    {review.title}
                                </h4>

                                <div className="relative mt-2">

                                    <p className="text-gray-500 leading-relaxed text-xs sm:text-[14px] break-words">
                                        <Quote
                                            size={16}
                                            className="hidden sm:block absolute -left-5 top-0 text-gray-600 fill-gray-100 rotate-180"
                                        />
                                        {review.comment || review.body}
                                        <Quote
                                            size={16}
                                            className="hidden sm:block absolute -right-1 bottom-0 text-gray-600 fill-gray-100"
                                        />
                                    </p>

                                </div>
                            </div>


                            <div className="border-t border-gray-100 my-4 sm:my-5 sm:ml-15" />


                            <div className="flex justify-between items-center gap-3 sm:pl-15">
                                <div className="flex justify-start gap-2">
                                    <button
                                        onClick={() => likeReview(review?._id)}
                                        className={`w-fit flex items-center gap-1.5 sm:gap-2 border border-gray-200 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer text-[11px] sm:text-sm font-medium`}>
                                        {likedReviewIds.includes(review._id) ? <FaThumbsUp key="filled" className="like_btn text-[12px] sm:text-[15px]" /> : <FaRegThumbsUp key="outline" className="like_btn text-[12px] sm:text-[15px]" />}
                                        {review.likes || 0}
                                    </button>

                                    <div className="relative w-fit">
                                        <button
                                            onMouseEnter={() => setHoveredReview(review._id)}
                                            onMouseLeave={() => setHoveredReview(null)}
                                            onClick={() => helpfulReview(review._id)}
                                            className="w-fit flex items-center gap-1.5 sm:gap-2 border border-gray-200 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer text-[11px] sm:text-sm font-medium text-gray-700"
                                        >
                                            Helpful ( {review.helpfulCount || 0} )
                                        </button>

                                        {hoveredReview === review._id && (
                                            <div className="tracking-wider absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-64 sm:w-70 text-center bg-slate-900 text-white text-[10px] sm:text-xs p-2 rounded-lg shadow-lg z-50">
                                                Your vote helps other customers discover the most useful and trustworthy reviews.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {review.isVerifiedPurchase && (
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <BadgeCheck size={16} />
                                            <span className="text-[10px] sm:text-[12px] md:text-[13px] font-bold">
                                                Verified purchase
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {
                addReview && (
                    <AddReview productId={productId} setAddReview={setAddReview} />
                )
            }
        </div >

    );
};