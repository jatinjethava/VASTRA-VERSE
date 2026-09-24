import { useState } from "react";
import { motion } from "framer-motion";
import { Detail } from "./Detail";
import type { Product } from "../Api/productApi";
import "./CSS/card.css";
import { FaEye, FaHeart, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useAddToWishList, useGetWishList, useRemoveFromWishList } from "../Hooks/wishList";
import { CiHeart } from "react-icons/ci";
import { useRecentlyViewed } from "../Hooks/user";
import { useViewProduct } from "../Hooks/product";
import { useGetProductAllReview } from "../Hooks/review";
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
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f9f9f9]">
                    <img
                        src={`${product?.images[0]}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={product?.title}
                    />

                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {product?.isBestSeller && (
                            <span className="bg-black text-white text-[9px] uppercase tracking-[0.15em] px-3 py-1.5">
                                Best Seller
                            </span>
                        )}
                        {product?.isNewArrival && (
                            <span className="bg-white text-black text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-black/10">
                                New Arrival
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            isWishlisted ? removeFromWishList(product._id as string) : addToWishList(product._id as string);
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white z-20"
                    >
                        {isWishlisted ? <FaHeart className="text-black" size={16} /> : <CiHeart size={18} className="text-black" />}
                    </button>

                    {/* Sizes on Hover (Optional, adds luxury feel) */}
                    {product?.variants && product.variants.length > 0 && (
                        <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                            <div className="flex gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm mx-4 overflow-x-auto hide-scrollbar">
                                {[...new Set(product?.variants.map((v) => v.size))].map((size, index) => (
                                    <span key={index} className="text-[10px] font-medium text-black uppercase">{size}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Container */}
                <div className="flex flex-col gap-1.5 px-1">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-medium text-black line-clamp-1">
                            {product?.title}
                        </h3>
                        <div className="flex items-baseline gap-2 whitespace-nowrap">
                            {product?.discountPrice !== 0 && (
                                <span className="text-[11px] text-gray-400 line-through">
                                    ₹{product?.basePrice}
                                </span>
                            )}
                            <span className="text-sm text-black">
                                ₹{product?.discountPrice === 0 ? product?.basePrice : product?.discountPrice}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product?.material || "Premium Cotton"}</p>

                        {/* Rating snippet */}
                        {averageRating > 0 && (
                            <div className="flex items-center gap-1">
                                <FaStar className="text-black" size={10} />
                                <span className="text-[10px] text-black font-medium">{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <Detail curruntProduct={curruntProduct} showDetail={showDetail} setShowDetail={setShowDetail} />
        </>
    );
};