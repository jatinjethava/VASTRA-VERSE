import { useState } from "react";
import { Detail } from "./Detail";
import type { Product } from "../Api/productApi";
import "./CSS/card.css";
import { FaEye, FaHeart, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useAddToWishList, useGetWishList, useRemoveFromWishList } from "../Hooks/wishList";
import { CiHeart } from "react-icons/ci";
import { useRecentlyViewed } from "../Hooks/user";
import { useGetProductAllReview } from "../Hooks/review";
import { useViewProduct } from "../Hooks/product";
import '../App.css'

export const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
        <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => {
                if (rating >= star) {
                    return <FaStar key={star} />;
                }
                if (rating >= star - 0.5) {
                    return <FaStarHalfAlt key={star} />;
                }
                return <FaRegStar key={star} />;
            })}
        </div>
    );
};

export const Card = ({ product }: { product: Product }
) => {

    const { mutateAsync: addToWishList } = useAddToWishList();
    const { mutateAsync: removeFromWishList } = useRemoveFromWishList();
    const { data: wishListData } = useGetWishList();
    const { mutate: recentlyViewed } = useRecentlyViewed();
    const { mutateAsync: view } = useViewProduct();
    const { data: productReviews } = useGetProductAllReview(product?._id as string);

    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [curruntProduct, setCurrentProduct] = useState<Product>(product);
    const [liked, setLiked] = useState<boolean>(false);

    const isWishlisted = wishListData?.data?.wishlist?.some((item: any) => item.productId === curruntProduct?._id);
    const totalRating = productReviews?.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = (totalRating ?? 0) / (productReviews?.length || 1);

    return (
        <>
            <div className="page" onMouseEnter={() => setIsShow(true)} onMouseLeave={() => setIsShow(false)}>
                <div className="scene">
                    <div
                        className="card shadow-xl"
                        style={{
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        <div className="front" onMouseOver={() => setLiked(true)} onMouseLeave={() => setLiked(false)}>
                            {(product?.isBestSeller) && (
                                <span className={`absolute top-3 left-3 px-3 py-1 text-[7px] md:text-[9px] lg:text-[10px] shadow-lg font-bold tracking-wider rounded-lg ${product?.isBestSeller ? "bg-green-600 text-white" : "bg-green-600 text-white"}`}>
                                    {product?.isBestSeller ? "Best Seller" : ""}
                                </span>
                            )}

                            {(product?.isNewArrival) && (
                                <span className={`absolute mt-2 top-8 left-3 px-3 py-1 text-[7px] md:text-[9px] lg:text-[10px] shadow-lg font-bold tracking-wider rounded-lg ${product?.isNewArrival ? "bg-red-500 text-white" : "bg-green-600 text-white"}`}>
                                    {product?.isNewArrival ? "New Arrival" : ""}
                                </span>
                            )}


                            <div className="img-container">
                                <img src={`${product?.images[0]}`} className="h-full w-full rounded-t-lg object-cover" alt={product?.title} />
                            </div>

                            <div className="infoPanel flex flex-col justify-between">
                                <p className="tag text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] lg:text-[13px] xl:text-[15px]">{product?.material}</p>
                                <p className="text-gray-800 font-bold text-[12px] sm:text-[15px] md:text-base lg:text-lg tracking-wide my-1 sm:my-3 leading-tight line-clamp-2">
                                    {product?.title}
                                </p>

                                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2.5">
                                    <span className="text-[#f0b429] text-[9px] sm:text-[13px]">
                                        <StarRating rating={averageRating} />
                                    </span>
                                    <span className="text-[8px] sm:text-[11px] text-[#aaa]">{averageRating ? averageRating.toFixed(1) : ""}</span>
                                </div>

                                <div className="flex gap-1 sm:gap-1.5 mb-2 sm:mb-3.5 flex-wrap">
                                    {[...new Set(product?.variants.map((v) => v.size))].map((size, index) => (
                                        <button
                                            key={index}
                                            className={`sizeChip`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <div className="price flex flex-wrap items-baseline gap-1">
                                            ₹{product?.discountPrice === 0 ? product?.basePrice : product?.discountPrice}{" "}
                                            <span className="text-[8px] sm:text-[12px] font-normal text-[#aaa] line-through">
                                                {product?.discountPrice === 0 ? "No discount" : `₹${product?.basePrice}`}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="flipBtn flex justify-center items-center"
                                        onClick={() => setIsFlipped(true)}
                                        title="See details"
                                    >
                                        <FaEye size={17} color="currentColor" />
                                    </button>

                                </div>
                            </div>

                            <div
                                className="absolute top-3 right-3 w-10 h-10 bg-white flex items-center justify-center rounded-full"
                                style={{
                                    opacity: liked ? 1 : 0,
                                    transform: liked ? "scale(1)" : "scale(0.3)",
                                    transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    pointerEvents: liked ? "auto" : "none",
                                }}
                            >
                                {isWishlisted ? (
                                    <button
                                        onClick={() => removeFromWishList(product._id as string)}
                                        className={`cursor-pointer animate-scale-in duration-500 ease-in-out text-red-600`}>
                                        <FaHeart />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToWishList(product._id as string)}
                                        className={`cursor-pointer animate-scale-in duration-500 ease-in-out`}>
                                        <CiHeart size={20} />
                                    </button>
                                )}
                            </div>

                        </div>

                        <div className="back">
                            <div>
                                <p className="backTitle text-[10px] sm:text-[19px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                                    {product?.title.length > 18 ? `${product?.title.slice(0, 18)}...` : product?.title}
                                </p>
                                <p className="backDesc text-[8px] sm:text-[12px] md:text-[12px] lg:text-[13px] xl:text-[13px] tracking-wide">
                                    {product?.description.length > 160 ? `${product?.description.slice(0, 160)}...` : product?.description}
                                </p>
                                <ul className="featureList">
                                    {[
                                        `220 GSM ${product?.material}`,
                                        `${product?.fit}`,
                                        `${product?.tags.length > 5 ? product?.tags?.map((tag) => tag).join(", ").slice(0, 65) + " ..." : product?.tags?.map((tag) => tag).join(", ")}`,
                                        `For ${product?.gender}'s`,
                                        `Made with ❤️ by Jatin Jethava`,
                                    ].map((f) => (
                                        <li key={f} className="featureItem text-[8px] sm:text-[12px] md:text-[12px] lg:text-[13px] xl:text-[13px]">
                                            <span style={{ color: "#90e070", fontWeight: 500 }}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                                    <span className="backPrice text-sm sm:text-lg xl:text-xl">₹{product?.discountPrice == 0 ? product?.basePrice : product?.discountPrice}</span>
                                    <span className="text-[10px] sm:text-[12px] text-[#666] line-through">
                                        {product?.discountPrice === 0 ? "" : `₹${product?.basePrice}`}
                                    </span>
                                    <div className="text-[10px] sm:text-[12px]">
                                        <span className="discountBadge">{product?.discountPrice == 0 ? "No discount" : `${Math.round(((product?.basePrice - product?.discountPrice) / product?.basePrice) * 100)}% off`}</span>
                                    </div>
                                </div>
                                <button
                                    className="addBtn text-[9px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-sm"
                                    style={{ background: showDetail ? "#90e070" : "#fff", color: "#1a1a1a" }}
                                    onClick={() => {
                                        setCurrentProduct(product);
                                        setShowDetail(true);
                                        setIsFlipped(false);
                                        recentlyViewed(product._id as string);
                                        view(product._id as string)
                                    }}
                                >
                                    {showDetail ? "✓ Show Details!" : "Show Details"}
                                </button>
                                <p
                                    className="text-[8px] sm:text-[10px] md:text-[13px] lg:text-[14px] xl:text-sm"
                                    style={{ textAlign: "center", marginTop: 10, color: "#999", cursor: "pointer" }}
                                    onClick={() => setIsFlipped(false)}
                                >
                                    ← back to preview
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className={`text-center mt-6 h-6 transition-all duration-300 ${isShow ? 'opacity-70' : 'opacity-0'}`}>
                        <p className="text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-sm mx-auto text-gray-500 cursor-pointer" >
                            Click eye icon to flip & view details
                        </p>
                    </div>
                </div>
            </div>

            <Detail curruntProduct={curruntProduct} showDetail={showDetail} setShowDetail={setShowDetail} />
        </>
    );
};