import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { Reviews } from "./Review";
import { useLocation } from "react-router-dom";
import type { Product } from "../Api/productApi";
import { useAddToCart } from "../Hooks/cart";
import { useAddToWishList, useGetWishList, useRemoveFromWishList } from "../Hooks/wishList";
import { FaHeart, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import '../index.css'
import { SizeGuide } from "./SizeGuide";
import { RecommendProduct } from "./RecommendProduct";
import ReactGA from "react-ga4";
import { QA } from "./QA";
import { useGetProductAllReview } from "../Hooks/review";
import { colorMap } from "./Detail";

interface LocationState {
    product: Product;
}

export const MoreDetails = () => {

    const location = useLocation();
    const { product } = location.state as LocationState;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [product?._id]);

    useEffect(() => {
        ReactGA.event({
            category: "Product",
            action: "View Product",
            label: product?.title,
        });
    }, [product]);

    const { mutateAsync: addToCart, isPending: cartPending } = useAddToCart();
    const { mutateAsync: addToWishList, isPending: wishListPending } = useAddToWishList();
    const { mutateAsync: removeFromWishList, isPending: removeFromWishListPending } = useRemoveFromWishList();
    const { data: wishListData } = useGetWishList();
    const { data: productReviews } = useGetProductAllReview(product?._id as string);
    const isPending = cartPending || wishListPending || removeFromWishListPending;

    const [count, setCount] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<string>();
    const [selectedColor, setSelectedColor] = useState<string>();
    const [selected, setSelected] = useState<number>(0);
    const [added, setAdded] = useState<boolean>(false);
    const [showSizeChart, setShowSizeChart] = useState<boolean>(false);

    const inStock = product?.variants?.reduce((acc: number, variant: any) => acc + variant.stock, 0) > 0;
    const isWishlisted = wishListData?.data?.wishlist?.some((item: any) => item.productId === product?._id);

    const handleAddToCart = async () => {
        try {

            ReactGA.event({
                category: "Cart",
                action: "Add To Cart",
                label: product?.title,
            });

            const data = await addToCart({ productId: product?._id as string, quantity: count, size: selectedSize, color: selectedColor })

            if (data) {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            }

        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const totalStock = product?.variants?.reduce((acc: number, variant: any) => acc + variant.stock, 0);
    const totalRating = productReviews?.reduce((acc: any, review: any) => acc + review.rating, 0);
    const averageRating = (totalRating ?? 0) / (productReviews?.length || 1);

    const StarRating = ({ rating = 0 }) => {
        return (
            <div className="flex gap-1 text-yellow-400 text-sm">
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


    return (
        <div className="bg-white min-h-screen pb-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="pt-6 sm:pt-16 w-full px-4 sm:px-8 lg:px-16 mx-auto flex flex-col lg:flex-row min-h-fit gap-10 lg:gap-16"
            >
                <div className="sticky top-24 flex flex-col-reverse lg:flex-row w-full lg:w-[60%] h-[55vh] sm:h-[70vh] lg:h-[800px] gap-3 lg:gap-5">
                    <div className="p-0 w-full lg:w-[12%] flex flex-row lg:flex-col gap-2 sm:gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0 h-20 sm:h-24 lg:h-full">
                        {product?.images?.map((i, index) => (
                            <div key={i} onClick={() => { setSelected(index) }} className={`h-full w-20 sm:w-24 lg:w-full lg:h-36 shrink-0 overflow-hidden cursor-pointer transition-all duration-300 relative ${selected == index ? "ring-1 ring-black ring-offset-2" : "opacity-50 hover:opacity-100"}`}>
                                <img src={i} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="w-full lg:w-[88%] h-[calc(100%-5.5rem)] sm:h-[calc(100%-6.5rem)] lg:h-full relative overflow-hidden bg-neutral-50">
                        <img src={product?.images[selected]} className="w-full h-full object-cover" alt="" />
                    </div>
                </div>

                <div className="w-full lg:w-[40%] h-auto lg:max-h-[800px] lg:overflow-y-auto no-scrollbar flex flex-col">
                    <div className="relative w-full flex flex-col h-full bg-transparent lg:py-6 lg:pl-4">

                        {isPending && (
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

                        <div className="flex-1 space-y-7">
                            <div>
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.25em] block mb-2">
                                    {product?.fit} &nbsp;·&nbsp; {product?.title}
                                </span>
                                <h1 className="editorial-text text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-[1.1]">
                                    {product?.seoTitle}
                                </h1>
                                <p className="mt-2 text-[10px] sm:text-xs text-neutral-400 font-medium tracking-widest uppercase">Atelier Ref: {product?.slug}</p>
                            </div>



                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-neutral-900">
                                    <StarRating rating={averageRating} />
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400 mt-0.5">{averageRating ? averageRating.toFixed(1) : ""}</span>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="editorial-text text-3xl sm:text-4xl font-light text-neutral-900">₹{product?.discountPrice === 0 ? product?.basePrice : product?.discountPrice}</span>
                                {product?.discountPrice !== 0 && (
                                    <>
                                        <span className="text-sm sm:text-base text-neutral-400 line-through font-light">₹{product?.basePrice}</span>
                                        <span className="bg-black text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest relative -top-1">
                                            Save ₹{Math.floor((product?.basePrice || 0) - (product?.discountPrice || 0))}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-neutral-500 font-light leading-relaxed">
                                {product?.description}
                            </p>

                            <div className="w-full h-px bg-neutral-200/60" />

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="mb-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                        Material
                                    </p>
                                    <p className="text-sm text-neutral-900 font-medium">
                                        {product?.material}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                        Cut & Fit
                                    </p>
                                    <p className="text-sm text-neutral-900 font-medium">
                                        {product?.fit}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                    Classifications
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product?.tags.map((t: string, i: number) => {
                                        return (
                                            <span key={i} className="text-[10px] text-neutral-500 font-semibold border border-neutral-200/80 rounded-none px-3 py-1.5 uppercase tracking-wider bg-neutral-50">
                                                {t}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Select Shade</p>
                                    <p className="text-[10px] text-neutral-900 font-medium uppercase tracking-wider">{selectedColor}</p>
                                </div>
                                <div className="flex gap-3">
                                    {(!selectedSize ? [...new Set(product?.variants.map((v) => v.color))] : [...new Set(product?.variants.filter((v: any) => v.size === selectedSize && v.stock > 0).map((v: any) => v.color))]).map((color: any) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-none transition-all duration-300 cursor-pointer relative shrink-0 ${selectedColor === color
                                                ? "ring-1 ring-offset-2 ring-black"
                                                : "hover:scale-110 ring-1 ring-neutral-200"
                                                }`}
                                            style={{ backgroundColor: colorMap[color] || color }}
                                        >
                                            {selectedColor === color && (
                                                <svg className="absolute inset-0 m-auto w-3.5 h-3.5" fill="none" stroke={['white', '#ffffff', '#fff'].includes((colorMap[color] || color).toLowerCase()) ? '#000' : '#fff'} strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Dimension / Size</p>
                                    <button
                                        onClick={() => setShowSizeChart(true)}
                                        className="text-[9px] font-bold text-neutral-900 uppercase tracking-widest underline underline-offset-4 hover:text-neutral-500 transition-colors cursor-pointer">
                                        Measurement Guide
                                    </button>
                                </div>

                                <div className="flex gap-2.5 flex-wrap">
                                    {(!selectedColor ? [... new Set(product?.variants.map((v: { size: string }) => v.size))] : product?.variants.filter((v: { color: string, stock: number }) => { if (v.color === selectedColor && v.stock > 0) return v }).map((v: { size: string }) => v.size)).map((s: string) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`h-11 px-5 rounded-none text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border ${selectedSize === s
                                                ? "bg-black text-white border-black shadow-none"
                                                : "bg-white text-neutral-600 border-neutral-200/80 hover:border-black hover:text-black"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />


                            <div>
                                <p className="mb-2 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Quantity</p>
                                <div className="flex items-center gap-1 bg-white border border-neutral-200/80 rounded-none w-fit overflow-hidden">
                                    <button
                                        onClick={() => setCount(Math.max(1, count - 1))}
                                        className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-black transition-all duration-200 cursor-pointer text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-black select-none">{count}</span>
                                    <button
                                        onClick={() => setCount(Math.min(10, count + 1))}
                                        className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-black transition-all duration-200 cursor-pointer text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="mt-8 w-full">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Atelier Availability</p>
                                        <p className="text-[9px] font-bold text-neutral-900 uppercase tracking-widest">{product?.soldCount} Units Dispatched</p>
                                    </div>
                                    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min(((product?.soldCount ?? 0) / (totalStock || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap mt-5 items-center gap-3">
                                    {inStock ? (
                                        <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 rounded-full px-3 py-1.5">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                            </span>
                                            <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">In Stock</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-3 py-1.5">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                            </span>
                                            <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest">Out of Stock</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200/60 mt-4">
                                    {[
                                        { icon: "🚚", text: "Complimentary Delivery" },
                                        { icon: "🔄", text: "Seamless Returns" },
                                        { icon: "✨", text: "Premium Atelier Quality" },
                                        { icon: "🛡️", text: "Artisan Guaranteed" },
                                    ].map((f) => (
                                        <div key={f.text} className="flex items-center gap-3 py-2">
                                            <span className="text-sm grayscale opacity-60">{f.icon}</span>
                                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.1em]">{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 py-4 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${added
                                            ? "bg-emerald-600 text-white"
                                            : "bg-black text-white hover:bg-neutral-800"
                                            }`}
                                    >
                                        {added ? "✓ Secured in Cart" : `Acquire Garment — ₹${(product?.discountPrice * count).toLocaleString()}`}
                                    </button>

                                    {isWishlisted ? (
                                        <button
                                            onClick={() => { removeFromWishList(product?._id as string) }}
                                            className="shrink-0 w-12 h-12 flex items-center justify-center text-red-500 hover:opacity-70 transition-opacity duration-300 cursor-pointer border border-neutral-200">
                                            <FaHeart className="text-lg" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { addToWishList(product?._id as string) }}
                                            className="shrink-0 w-12 h-12 flex items-center justify-center text-black hover:opacity-50 transition-opacity duration-300 cursor-pointer border border-neutral-200">
                                            <FaRegHeart className="text-lg" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div >

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-10 mb-10 w-[95vw] sm:w-[90vw] mx-auto"
            >
                <Reviews productId={product?._id as string} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <QA productId={product?._id as string} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-10 mb-10 w-[95vw] sm:w-[90vw] mx-auto"
            >
                <RecommendProduct recommendedProducts={[product]} />
            </motion.div>

            {
                showSizeChart && (
                    <SizeGuide setShowSizeChart={setShowSizeChart} />
                )
            }
        </div >
    )
}