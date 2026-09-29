import { useState } from "react";
import { motion } from "framer-motion";
import { Detail } from "./Detail";
import type { Product } from "../Api/productApi";
import "./CSS/card.css";
import { FaHeart, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useAddToWishList, useGetWishList, useRemoveFromWishList } from "../Hooks/wishList";
import { CiHeart } from "react-icons/ci";
import { useRecentlyViewed } from "../Hooks/user";
import { useViewProduct } from "../Hooks/product";
import { useGetProductAllReview } from "../Hooks/review";
import { toast } from "sonner";
import '../App.css';

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

export const Card = ({ product }: { product: Product }) => {

    const { mutateAsync: addToWishList } = useAddToWishList();
    const { mutateAsync: removeFromWishList } = useRemoveFromWishList();
    const { data: wishListData } = useGetWishList();
    const { mutate: recentlyViewed } = useRecentlyViewed();
    const { mutateAsync: view } = useViewProduct();
    const { data: productReviews } = useGetProductAllReview(product?._id as string);

    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [curruntProduct, setCurrentProduct] = useState<Product>(product);

    const isWishlisted = wishListData?.data?.wishlist?.some((item: any) => item.productId === curruntProduct?._id);
    const totalRating = productReviews?.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = (totalRating ?? 0) / (productReviews?.length || 1);

    return (
        <>
            <motion.div
                className="group w-full max-w-sm flex flex-col gap-4 cursor-pointer mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true, amount: 0.1 }}
                onClick={() => {
                    setCurrentProduct(product);
                    setShowDetail(true);
                    if (localStorage.getItem("token")) {
                        recentlyViewed(product._id as string);
                        view(product._id as string).catch(() => { });
                    }
                }}
            >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f9f9f9]">
                    <img
                        src={`${product?.images[0]}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={product?.title}
                    />

                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                        {product?.isBestSeller && (
                            <span className="bg-black text-white text-[7px] sm:text-[9px] uppercase tracking-[0.15em] px-2 sm:px-3 py-1 sm:py-1.5">
                                Best Seller
                            </span>
                        )}
                        {product?.isNewArrival && (
                            <span className="bg-white text-black text-[7px] sm:text-[9px] uppercase tracking-[0.15em] px-2 sm:px-3 py-1 sm:py-1.5 border border-black/10">
                                New Arrival
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!localStorage.getItem("token")) {
                                toast.error("Please login to manage wishlist", { duration: 1500 });
                                return;
                            }
                            isWishlisted ? removeFromWishList(product._id as string) : addToWishList(product);
                        }}
                        className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm ${isWishlisted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0"
                            } transition-all duration-200 hover:bg-white hover:scale-110 active:scale-90 z-20 cursor-pointer`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        {isWishlisted ? (
                            <FaHeart className="text-red-500 transition-transform duration-200" size={15} />
                        ) : (
                            <CiHeart size={16} className="text-black transition-transform duration-200" />
                        )}
                    </button>

                    {product?.variants && product.variants.length > 0 && (
                        <div className="absolute bottom-3 sm:bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                            <div className="flex gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm mx-3 sm:mx-4 overflow-x-auto hide-scrollbar">
                                {[...new Set(product?.variants.map((v) => v.size))].map((size, index) => (
                                    <span key={index} className="text-[9px] sm:text-[10px] font-medium text-black uppercase">{size}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 px-1 mt-1 sm:mt-0">
                    <div className="flex justify-between items-start gap-2 sm:gap-4">
                        <h3 className="text-xs sm:text-sm font-medium text-black line-clamp-2 sm:line-clamp-1 flex-1 leading-snug">
                            {product?.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-end sm:items-baseline gap-0.5 sm:gap-2 whitespace-nowrap shrink-0">
                            {product?.discountPrice !== 0 && (
                                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                                    ₹{product?.basePrice}
                                </span>
                            )}
                            <span className="text-xs sm:text-sm text-black">
                                ₹{product?.discountPrice === 0 ? product?.basePrice : product?.discountPrice}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-0.5 sm:mt-0">
                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest truncate max-w-[100px] sm:max-w-none">{product?.material || "Premium Cotton"}</p>

                        {averageRating > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                                <FaStar className="text-black" size={9} />
                                <span className="text-[9px] sm:text-[10px] text-black font-medium">{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {showDetail && (
                <Detail curruntProduct={curruntProduct} showDetail={showDetail} setShowDetail={setShowDetail} />
            )}
        </>
    );
};