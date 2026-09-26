import { useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { AddReview } from './AddReview';
import { useGetProductAllReview, useHelpfulReview, useLikeReview, useMatchLike, useMatchHelpful } from "../Hooks/review";
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
    const { data: matchHelpful } = useMatchHelpful(productId);
    const helpfulReviewIds = matchHelpful?.helpfulReviewIds || [];

    const [addReview, setAddReview] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<number>(0);
    const [hoveredReview, setHoveredReview] = useState<string | null>(null);

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

                <div className="flex flex-row items-center justify-between mb-8 sm:mb-10 border-b border-neutral-200 pb-4 gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-light editorial-text text-black tracking-tight">
                        Customer Reviews
                    </h2>

                    <button onClick={() => setAddReview(true)} className="text-[8px] sm:text-[9px] font-bold text-white bg-black py-2 sm:py-2.5 px-4 sm:px-6 uppercase tracking-widest rounded-none border border-black hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shrink-0">
                        Add Review
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                    <div className="border border-neutral-200 bg-white flex flex-col items-center justify-center shrink-0 px-6 py-6 sm:px-12 sm:py-8 shadow-none rounded-none w-full lg:w-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light editorial-text text-black tracking-tight">
                            {averageRating.toFixed(1)}
                        </h1>
                        <div className="flex items-center gap-0.5 mt-4">
                            <StarRating rating={averageRating} />
                        </div>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-4 font-bold">
                            {reviewsData?.length} reviews
                        </p>
                    </div>

                    <div className="flex-1 space-y-3 justify-center flex flex-col">
                        {calculateRating?.map((item) => (
                            <div
                                key={item.star}
                                className="flex items-center gap-3 group cursor-pointer"
                            >
                                <div className="flex items-center gap-1 w-8 shrink-0">
                                    <span className="text-[10px] font-bold text-black tracking-widest">
                                        {item.star}
                                    </span>
                                    <Star
                                        size={10}
                                        className="fill-black text-black"
                                    />
                                </div>

                                <div className="flex-1 h-1 bg-neutral-100 rounded-none overflow-hidden">
                                    <div
                                        className="h-full rounded-none transition-all duration-700 ease-out bg-black"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>

                                <span className="text-[10px] text-neutral-400 font-bold w-12 text-right tabular-nums tracking-widest">
                                    {item.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-8 sm:mt-10">
                    {filters.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveFilter(index)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-none border transition-all duration-200 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold cursor-pointer shrink-0 flex-grow sm:flex-grow-0 text-center
                                ${activeFilter === index
                                    ? "bg-black text-white border-black shadow-none"
                                    : "border-neutral-200 text-neutral-500 hover:border-black hover:text-black"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="mt-6 sm:mt-8 flex flex-row items-center gap-4 justify-between border-b border-neutral-200 pb-4">
                    <p className="text-neutral-400 text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">
                        Showing {reviewsData.length} of {reviewsData.length} reviews
                    </p>

                    <button className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                        <span className="font-bold text-black text-[8px] sm:text-[9px] uppercase tracking-widest group-hover:text-neutral-500 transition-colors">
                            Highest rated
                        </span>
                        <div className="w-4 h-px bg-black group-hover:bg-neutral-500 transition-colors" />
                    </button>
                </div>


                <div className="mt-0 space-y-0 max-h-[450px] overflow-y-auto md:max-h-none md:overflow-y-visible pr-1 sm:pr-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200">
                    {filterReview().map((review, idx) => (
                        <div
                            key={idx}
                            className="bg-white border-b border-neutral-200 py-5 sm:py-8 transition-all duration-300 group overflow-hidden rounded-none"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                                <div className="flex gap-2.5 sm:gap-4 items-center sm:items-start">
                                    <div
                                        className={`w-8 h-8 sm:w-11 sm:h-11 rounded-none ${review.avatarColor || 'bg-black'} text-white flex items-center justify-center font-bold text-[8px] sm:text-[10px] tracking-widest uppercase shadow-none shrink-0`}
                                    >
                                        {review?.user?.name.charAt(0) + review?.user?.name.charAt(1) || "U"}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-black text-xs sm:text-sm uppercase tracking-widest truncate">
                                            {review?.user?.name || "User"}
                                        </h3>
                                        <div className="flex flex-wrap text-[9px] sm:text-xs items-center gap-1 sm:gap-1.5 mt-0 sm:mt-0.5">
                                            <div className="flex text-neutral-400 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] items-center max-w-[120px] sm:max-w-[200px] truncate">
                                                {review?.user?.email || "User"}
                                            </div>
                                            <span className="w-1 h-1 mx-0.5 sm:mx-1 bg-neutral-200 rounded-none shrink-0"></span>
                                            <p className="text-neutral-400 font-bold text-[8px] sm:text-[9px] uppercase tracking-widest shrink-0">
                                                {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 ml-[2.625rem] sm:ml-0 mt-1 sm:mt-0">
                                    {review.recommended && (
                                        <span className="inline-flex bg-white text-black px-1.5 sm:px-2 py-0.5 sm:py-1 border border-black rounded-none text-[7px] sm:text-[8px] uppercase tracking-[0.2em] font-bold shrink-0">
                                            Recommended
                                        </span>
                                    )}
                                    <div className="flex items-center gap-0.5 shrink-0">
                                        <StarRating rating={review.rating} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 sm:mt-6 ml-[2.625rem] sm:ml-15">
                                <h4 className="text-xs sm:text-base font-bold uppercase tracking-widest text-black group-hover:text-neutral-600 transition-colors break-words mb-1.5 sm:mb-3">
                                    {review.title}
                                </h4>

                                <div className="relative mt-1 sm:mt-2">
                                    <p className="text-neutral-600 leading-relaxed text-[11px] sm:text-[13px] break-words">
                                        {review.comment || review.body}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-neutral-100 my-4 sm:my-6 ml-[2.625rem] sm:ml-15" />

                            <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-3 ml-[2.625rem] sm:ml-15">
                                <div className="flex justify-start gap-2 sm:gap-3">
                                    <button
                                        onClick={() => likeReview(review?._id)}
                                        className={`w-fit flex items-center gap-1.5 sm:gap-2 border border-neutral-200 rounded-none px-2 sm:px-4 py-1.5 sm:py-2 hover:border-black transition-all duration-200 cursor-pointer text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-black`}>
                                        {likedReviewIds.includes(review._id) ? <FaThumbsUp key="filled" className="text-[10px] sm:text-[12px]" /> : <FaRegThumbsUp key="outline" className="text-[10px] sm:text-[12px]" />}
                                        {Math.max(0, review.likes || 0)}
                                    </button>

                                    <div className="relative w-fit">
                                        <button
                                            onMouseEnter={() => setHoveredReview(review._id)}
                                            onMouseLeave={() => setHoveredReview(null)}
                                            onClick={() => helpfulReview(review._id)}
                                            className={`w-fit flex items-center gap-1.5 sm:gap-2 border border-neutral-200 rounded-none px-2 sm:px-4 py-1.5 sm:py-2 hover:border-black transition-all duration-200 cursor-pointer text-[8px] sm:text-[9px] uppercase tracking-widest font-bold ${helpfulReviewIds.includes(review._id) ? 'text-black border-black' : 'text-neutral-500 hover:text-black'}`}
                                        >
                                            Helpful ( {Math.max(0, review.helpfulCount || 0)} )
                                        </button>

                                        {hoveredReview === review._id && (
                                            <div className="tracking-widest absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-48 sm:w-70 text-center bg-black text-white text-[8px] sm:text-[9px] uppercase p-2 sm:p-3 rounded-none shadow-none border border-black z-50 font-bold">
                                                Your vote helps other customers discover the most useful and trustworthy reviews.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {review.isVerifiedPurchase && (
                                        <div className="flex items-center gap-1 sm:gap-1.5 text-black">
                                            <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[1.5]" />
                                            <span className="text-[7px] sm:text-[9px] uppercase tracking-widest font-bold">
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