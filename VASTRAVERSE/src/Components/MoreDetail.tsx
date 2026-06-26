import { useEffect, useState } from "react"
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
    const isWishlisted = wishListData?.data?.wishlist?.includes(product?._id as string);

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
        <>
            <div className="mt-6 sm:mt-10 w-[95vw] sm:w-[90vw] mx-auto flex flex-col lg:flex-row min-h-fit lg:h-[700px] gap-4 lg:gap-0">
                <div className="flex flex-col-reverse lg:flex-row w-full lg:w-[60%] h-[50vh] sm:h-[60vh] lg:h-full gap-2 lg:gap-0">
                    <div className="p-0 lg:p-2 w-full lg:w-[15%] flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0 h-20 sm:h-24 lg:h-full">
                        {product?.images?.map((i, index) => (
                            <div key={i} onClick={() => { setSelected(index) }} className={`h-full w-20 sm:w-24 lg:w-full lg:h-32 shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${selected == index ? "shadow-md border-2 border-gray-900" : "border border-gray-200 hover:border-gray-400"}`}>
                                <img src={i} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="p-0 lg:p-2 w-full lg:w-[85%] h-[calc(100%-5.5rem)] sm:h-[calc(100%-6.5rem)] lg:h-full">
                        <img src={product?.images[selected]} className="w-full h-full rounded-xl object-cover" alt="" />
                    </div>
                </div>
                <div className="w-full lg:w-[40%] h-auto lg:h-full flex flex-col bg-white rounded-xl lg:rounded-none">
                    <div className="relative w-full flex flex-col h-full">

                        {isPending && (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50 rounded-xl">
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

                        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6">

                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                                <span>{product?.fit}</span>
                                <span>·</span>
                                <span>{product?.title}</span>
                            </div>


                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                    {product?.seoTitle}
                                </h2>
                                <p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium">@{product?.slug}</p>
                            </div>



                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-500">
                                    <StarRating rating={averageRating} />
                                </span>
                                <span style={{ fontSize: 11, color: "#aaa" }}>{averageRating ? averageRating.toFixed(1) : ""}</span>
                            </div>


                            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">₹{product?.discountPrice === 0 ? product?.basePrice : product?.discountPrice}</span>
                                {product?.discountPrice === 0 ? "" : <span className="text-base sm:text-lg text-gray-400 line-through font-medium">₹{product?.basePrice}</span>}
                                {product?.discountPrice === 0 ? "" : <span className="bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full">
                                    Save ₹{product?.basePrice - product?.discountPrice}
                                </span>}
                            </div>

                            <p className="text-sm text-gray-500 leading-relaxed">
                                {product?.description}
                            </p>


                            <div className="h-px bg-gray-100" />

                            <div className="grid grid-cols-3">
                                <div>
                                    <p className="mb-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Fabric
                                    </p>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {product?.material}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                                        Wash Care
                                    </p>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {product?.fit}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Tags
                                </p>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {product?.tags.map((t: string, i: number) => {
                                        return (
                                            <span key={i} className="text-xs sm:text-sm text-gray-400 font-medium border border-gray-200 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1">
                                                {t}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Color</p>
                                    <p className="text-xs text-gray-400 font-medium">{selectedColor}</p>
                                </div>
                                <div className="flex gap-3">
                                    {!selectedSize && (
                                        <>
                                            {[...new Set(product?.variants.map((v) => v.color))].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    title={color}
                                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 cursor-pointer relative shrink-0 ${selectedColor === color
                                                        ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                                                        : "hover:scale-105 ring-1 ring-gray-200"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {selectedColor === color && (
                                                        <svg className="absolute inset-0 m-auto w-4 h-4" fill="none" stroke={['white', '#ffffff', '#fff'].includes(color.toLowerCase()) ? '#111' : '#fff'} strokeWidth="3" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {selectedSize && (
                                        <>
                                            {[...new Set(product?.variants.filter((v: any) => v.size === selectedSize && v.stock > 0).map((v: any) => v.color))].map((color: any) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    title={color}
                                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 cursor-pointer relative shrink-0 ${selectedColor === color
                                                        ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                                                        : "hover:scale-105 ring-1 ring-gray-200"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {selectedColor === color && (
                                                        <svg className="absolute inset-0 m-auto w-4 h-4" fill="none" stroke={['white', '#ffffff', '#fff'].includes(color.toLowerCase()) ? '#111' : '#fff'} strokeWidth="3" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>


                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Size</p>
                                    <button
                                        onClick={() => setShowSizeChart(true)}
                                        className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors cursor-pointer">
                                        Size Guide
                                    </button>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {!selectedColor && (
                                        <div className="flex gap-2 flex-wrap">
                                            {[... new Set(product?.variants.map((v: { size: string }) => v.size))].map((s: string) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedSize(s)}
                                                    className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${selectedSize === s
                                                        ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 flex-wrap">
                                        {product?.variants.filter((v: { color: string, stock: number }) => { if (v.color === selectedColor && v.stock > 0) return v }).map((v: { size: string }) => (
                                            <button
                                                key={v.size}
                                                onClick={() => setSelectedSize(v.size)}
                                                className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${selectedSize === v.size
                                                    ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {v.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />


                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Quantity</p>
                                <div className="flex items-center gap-1 bg-gray-50 rounded-xl w-fit border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => setCount(Math.max(1, count - 1))}
                                        className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 cursor-pointer text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-gray-900 select-none">{count}</span>
                                    <button
                                        onClick={() => setCount(Math.min(10, count + 1))}
                                        className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 cursor-pointer text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Sold Units</p>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gray-900 rounded-full transition-all duration-300 ease-out"
                                        style={{
                                            width: `${Math.min(
                                                ((product?.soldCount ?? 0) / (totalStock || 1)) * 100,
                                                100
                                            )}%`
                                        }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{product?.soldCount} units sold</p>
                            </div>

                            {inStock ? (
                                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 w-fit">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                    </span>
                                    <p className="text-xs font-semibold text-emerald-700">In Stock — Ready to Ship</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 w-fit">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                    </span>
                                    <p className="text-xs font-semibold text-red-700">Out of Stock</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: "🚚", text: "Free Shipping" },
                                    { icon: "🔄", text: "Easy Returns" },
                                    { icon: "✨", text: "Premium Cotton" },
                                    { icon: "🛡️", text: "Quality Guaranteed" },
                                ].map((f) => (
                                    <div key={f.text} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                                        <span className="text-sm">{f.icon}</span>
                                        <span className="text-[11px] font-semibold text-gray-600">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 lg:static border-t border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 flex items-center gap-2 sm:gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:shadow-none">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${added
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40"
                                    }`}
                            >
                                {added ? "✓ Added to Cart!" : `Add to Cart — ₹${(product?.discountPrice * count).toLocaleString()}`}
                            </button>

                            {isWishlisted ? (
                                <button
                                    onClick={() => { removeFromWishList(product?._id as string) }}
                                    className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-red-200 bg-white flex items-center justify-center text-red-500 hover:border-red-200 transition-all duration-200 cursor-pointer">
                                    <FaHeart className="text-lg sm:text-xl" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => { addToWishList(product?._id as string) }}
                                    className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all duration-200 cursor-pointer">
                                    <FaRegHeart className="text-lg sm:text-xl" />
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 mb-10 w-[95vw] sm:w-[90vw] mx-auto">
                <Reviews productId={product?._id as string} />
            </div>

            <div>
                <QA productId={product?._id as string} />
            </div>

            <div className="mt-10 mb-10 w-[95vw] sm:w-[90vw] mx-auto">
                <RecommendProduct recommendedProducts={[product]} />
            </div>

            {showSizeChart && (
                <SizeGuide setShowSizeChart={setShowSizeChart} />
            )}
        </>
    )
}