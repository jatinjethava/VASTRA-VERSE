import { useEffect, useState } from "react";
import { FaArrowRight, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import type { Product } from "../Api/productApi";
import { useAddToCart } from "../Hooks/cart";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import '../index.css'
import { useAddToWishList, useRemoveFromWishList, useGetWishList } from "../Hooks/wishList";
import { toast } from "sonner";
import ReactGA from "react-ga4";
import { useGetProductAllReview } from "../Hooks/review";

export const colorMap: Record<string, string> = {
    "Black": "#000000",
    "White": "#FFFFFF",
    "Gray": "#808080",
    "Charcoal": "#36454F",
    "Navy": "#000080",
    "Navy Blue": "#000080",
    "Royal Blue": "#4169E1",
    "Sky Blue": "#87CEEB",
    "Red": "#FF0000",
    "Maroon": "#800000",
    "Burgundy": "#800020",
    "Green": "#008000",
    "Olive": "#808000",
    "Mint": "#98FF98",
    "Yellow": "#FFFF00",
    "Mustard": "#FFDB58",
    "Orange": "#FFA500",
    "Coral": "#FF7F50",
    "Pink": "#FFC0CB",
    "Hot Pink": "#FF69B4",
    "Purple": "#800080",
    "Lavender": "#E6E6FA",
    "Brown": "#A52A2A",
    "Tan": "#D2B48C",
    "Beige": "#F5F5DC",
    "Cream": "#FFFDD0",
    "Khaki": "#F0E68C",
    "Teal": "#008080",
    "Cyan": "#00FFFF",
    "Gold": "#FFD700",
    "Silver": "#C0C0C0"
};

export const Detail = ({
    curruntProduct,
    showDetail,
    setShowDetail,
}: {
    curruntProduct: Product;
    showDetail: boolean;
    setShowDetail: (v: boolean) => void;
}) => {

    const { mutateAsync: addToCart, isPending: cartPending } = useAddToCart();
    const { mutateAsync: addToWishList } = useAddToWishList();
    const { mutateAsync: removeFromWishList } = useRemoveFromWishList();
    const { data: wishListData } = useGetWishList();
    const { data: productReviews } = useGetProductAllReview(curruntProduct?._id as string);
    const isPending = cartPending;

    const navigate = useNavigate();
    const [count, setCount] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [activeImage, setActiveImage] = useState<number>(0);
    const [added, setAdded] = useState<boolean>(false);

    useEffect(() => {
        ReactGA.event({
            category: "Product",
            action: "View Product",
            label: curruntProduct?.title,
        });
    }, [curruntProduct]);


    useEffect(() => {
        if (showDetail) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showDetail]);

    const handleAdd = async () => {

        if (!selectedColor) {
            toast.error("Please select color", {
                duration: 1500
            });
            return;
        }

        if (!selectedSize) {
            toast.error("Please select size", {
                duration: 1500
            });
            return;
        }

        if (curruntProduct?.variants?.some((v: { size: string, stock: number }) => v.size === selectedSize && v.stock === 0)) {
            toast.error("Selected size is out of stock", {
                duration: 1500
            });
            return;
        }

        ReactGA.event({
            category: "Cart",
            action: "Add To Cart",
            label: curruntProduct.title,
        });

        const data = await addToCart({ productId: curruntProduct?._id as string, quantity: count, size: selectedSize, color: selectedColor })

        if (data) {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
            setShowDetail(false)
        }
    };

    const moreDetails = (product: Product) => {
        navigate("/more-details", { replace: true, state: { product } })
    }

    const inStock = curruntProduct?.variants.reduce((acc, variant) => acc + variant.stock, 0) > 0;
    const isWishlisted = wishListData?.data?.wishlist?.some((item: any) => item.productId === curruntProduct?._id);
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
        <div
            className={`fixed inset-0 z-10000 flex items-center justify-center transition-all duration-500 ${showDetail ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >

            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDetail(false)}
            />

            <div
                className={`relative w-[95%] max-w-6xl h-[90vh] bg-white rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-500 ${showDetail ? "scale-100 translate-y-0" : "scale-95 translate-y-6"
                    }`}
            >

                {isPending && (
                    <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/60">
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

                <button
                    onClick={() => setShowDetail(false)}
                    className="absolute top-4 right-4 z-[10000] p-2 bg-white flex items-center justify-center text-black hover:opacity-70 transition-opacity cursor-pointer border border-black/10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-full md:w-[55%] h-[45vh] md:h-full bg-gray-50 relative flex flex-col shrink-0 border-r border-gray-100">

                    <div className="flex-1 relative overflow-hidden bg-gray-100">
                        <img
                            src={curruntProduct?.images[activeImage] || curruntProduct?.images[0]}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            alt="Product"
                        />

                        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-col gap-2">
                            {curruntProduct?.isBestSeller && (
                                <span className="bg-black text-white text-[9px] font-medium uppercase tracking-[0.15em] px-3 py-1.5 rounded-none">
                                    Bestseller
                                </span>
                            )}
                            <span className="bg-white text-black border border-black/10 text-[9px] font-medium uppercase tracking-[0.15em] px-3 py-1.5 rounded-none">
                                {curruntProduct?.discountPrice === 0 ? "New Arrival" : `${Math.floor(((curruntProduct?.basePrice - curruntProduct?.discountPrice) / curruntProduct?.basePrice) * 100)}% Off`}
                            </span>
                        </div>
                    </div>


                    <div className="flex justify-between items-center gap-2 p-3 sm:p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            {curruntProduct?.images?.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-14 h-14 sm:w-20 sm:h-20 rounded-none overflow-hidden transition-all duration-200 cursor-pointer shrink-0 border ${activeImage === i
                                        ? "border-black"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                        <div className="pl-2 shrink-0">
                            <button
                                className={`group py-2 rounded-none font-medium text-xs tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer text-black hover:text-gray-500`}
                                onClick={() => moreDetails(curruntProduct)}
                            >
                                <span className="flex justify-center items-center gap-2">
                                    <span className="hidden sm:inline border-b border-black group-hover:border-gray-500 pb-0.5">Show Details</span>
                                    <span className="sm:hidden border-b border-black group-hover:border-gray-500 pb-0.5">Details</span>
                                    <FaArrowRight className="w-3 h-3" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>


                <div className="w-full md:w-[45%] flex flex-col flex-1 md:h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 space-y-5 sm:space-y-6">

                        <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-widest">Streetwear</span>
                        <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-widest"> - </span>
                        <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-widest">{curruntProduct?.title}</span>


                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {curruntProduct?.seoTitle}
                            </h2>
                            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[12px] text-gray-400 font-medium break-all">@{curruntProduct?.slug}</p>
                        </div>


                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs text-black">
                                <StarRating rating={averageRating} />
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium">{averageRating ? averageRating.toFixed(1) : ""}</span>
                        </div>


                        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                            <span className="text-2xl sm:text-3xl font-light text-black">₹{curruntProduct?.discountPrice ? curruntProduct?.discountPrice : curruntProduct?.basePrice}</span>
                            {curruntProduct?.discountPrice !== 0 && (
                                <span className="text-base sm:text-lg text-gray-400 line-through font-light">₹{curruntProduct?.basePrice}</span>
                            )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                            {curruntProduct?.description}
                        </p>


                        <div className="h-[1px] bg-black/10" />


                        <div>
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <p className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider">Color</p>
                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{selectedColor}</p>
                            </div>
                            <div className="flex gap-3">
                                {!selectedSize && (
                                    <>
                                        {[...new Set(curruntProduct?.variants.map((v) => v.color))].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-none transition-all duration-200 cursor-pointer relative ${selectedColor === color
                                                    ? "border-[3px] border-black"
                                                    : "border border-gray-300 hover:border-gray-500"
                                                    }`}
                                                style={{ backgroundColor: colorMap[color] || color }}
                                            >
                                                {selectedColor === color && (
                                                    <svg className="absolute inset-0 m-auto w-4 h-4" fill="none" stroke={['white', '#ffffff', '#fff'].includes((colorMap[color] || color).toLowerCase()) ? '#111' : '#fff'} strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {selectedSize && (
                                    <>
                                        {[...new Set(curruntProduct?.variants.filter((v: any) => v.size === selectedSize && v.stock > 0).map((v: any) => v.color))].map((color: any) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-none transition-all duration-200 cursor-pointer relative ${selectedColor === color
                                                    ? "border-[3px] border-black"
                                                    : "border border-gray-300 hover:border-gray-500"
                                                    }`}
                                                style={{ backgroundColor: colorMap[color] || color }}
                                            >
                                                {selectedColor === color && (
                                                    <svg className="absolute inset-0 m-auto w-4 h-4" fill="none" stroke={['white', '#ffffff', '#fff'].includes((colorMap[color] || color).toLowerCase()) ? '#111' : '#fff'} strokeWidth="2" viewBox="0 0 24 24">
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
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <p className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider">Size</p>
                            </div>

                            {!selectedColor && (
                                <div className="flex gap-2 flex-wrap">
                                    {[... new Set(curruntProduct?.variants.map((v: { size: string }) => v.size))].map((s: string) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`h-8 sm:h-10 px-4 text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer rounded-none border ${selectedSize === s
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                                {curruntProduct?.variants.filter((v: { color: string, stock: number }) => { if (v.color === selectedColor && v.stock > 0) return v }).map((v: { size: string }) => (
                                    <button
                                        key={v.size}
                                        onClick={() => setSelectedSize(v.size)}
                                        className={`h-8 sm:h-10 px-4 text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer rounded-none border ${selectedSize === v.size
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-gray-300 hover:border-black"
                                            }`}
                                    >
                                        {v.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[1px] bg-black/10" />


                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 sm:mb-3">Quantity</p>
                            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-none w-fit overflow-hidden">
                                <button
                                    onClick={() => setCount(Math.max(1, count - 1))}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-all duration-200 cursor-pointer text-base sm:text-lg font-light"
                                >
                                    −
                                </button>
                                <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium text-black select-none">{count}</span>
                                <button
                                    onClick={() => setCount(Math.min(10, count + 1))}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-all duration-200 cursor-pointer text-base sm:text-lg font-light"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {inStock ? (
                            <div className="flex items-center gap-2 w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                                </span>
                                <p className="text-[10px] sm:text-[11px] font-medium text-black uppercase tracking-[0.1em]">In Stock</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400" />
                                </span>
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-[0.1em]">Out of Stock</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-black/10 bg-white px-4 py-4 sm:px-6 md:px-8 sm:py-5 flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleAdd}
                            className={`flex-1 py-4 rounded-none font-medium text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer border ${added
                                ? "bg-white text-black border-black"
                                : "bg-black text-white border-black hover:bg-transparent hover:text-black"
                                }`}
                        >
                            {added ? "✓ Added" : `Add to Cart — ₹${(curruntProduct?.discountPrice ? curruntProduct?.discountPrice * count : curruntProduct?.basePrice * count).toLocaleString()}`}
                        </button>

                        {isWishlisted ? (
                            <button
                                onClick={() => {
                                    if (!localStorage.getItem("token")) {
                                        toast.error("Please login to manage wishlist", { duration: 1500 });
                                        return;
                                    }
                                    removeFromWishList(curruntProduct?._id as string);
                                }}
                                aria-label="Remove from wishlist"
                                className="w-12 h-12 rounded-none border border-black bg-white flex items-center justify-center text-red-500 hover:bg-gray-100 transition-all duration-200 cursor-pointer shrink-0 active:scale-90">
                                <FaHeart className="text-[16px] sm:text-[18px] transition-transform duration-200" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!localStorage.getItem("token")) {
                                        toast.error("Please login to manage wishlist", { duration: 1500 });
                                        return;
                                    }
                                    addToWishList(curruntProduct);
                                }}
                                aria-label="Add to wishlist"
                                className="w-12 h-12 rounded-none border border-black/20 bg-white flex items-center justify-center text-black hover:border-black transition-all duration-200 cursor-pointer shrink-0 active:scale-90">
                                <FaRegHeart className="text-[16px] sm:text-[18px] transition-transform duration-200" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};