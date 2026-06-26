import { useState } from "react";
import { Card } from "../../Components/card";
import { BlogSlider } from "../../Components/slider/BlogSlider";
import { useShopBySlug, useGetChildCategoriesBySlug } from "../../Hooks/product";
import type { Product } from "../../Api/productApi";
import '../../App.css'

export const Men = () => {

    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState({
        category: "",
        fit: "",
        maxPrice: null,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: false,
        limitedEdition: false
    });

    const { data, isLoading, isError } = useShopBySlug("men", filter.category, filter.fit, filter.maxPrice, filter.isFeatured, filter.isBestSeller, filter.isNewArrival, filter.limitedEdition);
    const { data: parentCategory } = useShopBySlug("men");
    const { data: categoriesData } = useGetChildCategoriesBySlug("men");

    const categories = categoriesData || [];
    const fits = [...new Set(parentCategory?.map((item: any) => item.fit))];

    const handleClearFilters = () => {
        setFilter({
            category: "",
            fit: "",
            maxPrice: null,
            isFeatured: false,
            isBestSeller: false,
            isNewArrival: false,
            limitedEdition: false
        });
    };

    return (
        <div className="min-h-screen py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 relative">

            <div className="max-w-7xl mx-auto text-center mb-6 sm:mb-12 space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-sm font-semibold text-gray-400 uppercase tracking-widest">Premium Drops</span>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-500 tracking-tight">MEN'S <span className="text-gray-800">STREETWEAR</span> COLLECTION</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-base font-medium leading-relaxed">
                    Elevate your wardrobe with relaxed silhouettes, heavyweight fabrics, and custom-finished details.
                </p>
                <div className="w-10 sm:w-16 h-1 bg-gray-900 mx-auto rounded-full mt-2 sm:mt-4"></div>
            </div>

            <div className="max-w-7xl mx-auto mb-7 flex justify-between items-center bg-white py-4 px-6 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-2 sm:px-3 md:px-4 py-2 md:py-2.5 text-[8px] sm:text-[10px] md:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-gray-900/10"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <p>Filter & Sort</p>
                </button>

                <div className="hidden md:flex items-center gap-2">
                    {filter.category && (
                        <span className="text-[8px] sm:text-[10px] md:text-sm font-bold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            {categoriesData.find((cat: any) => cat._id === filter.category)?.name}
                            <button onClick={() => setFilter({ ...filter, category: "" })} className="hover:text-red-500 font-extrabold cursor-pointer">✕</button>
                        </span>
                    )}
                    {filter.fit && (
                        <span className="text-[8px] sm:text-[10px] md:text-sm font-bold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            {filter.fit} Fit
                            <button onClick={() => setFilter({ ...filter, fit: "" })} className="hover:text-red-500 font-extrabold cursor-pointer">✕</button>
                        </span>
                    )}
                    {filter.maxPrice && (
                        <span className="text-[8px] sm:text-[10px] md:text-sm font-bold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            {`Under ₹${filter.maxPrice}`}
                            <button onClick={() => setFilter({ ...filter, maxPrice: null })} className="hover:text-red-500 font-extrabold cursor-pointer">✕</button>
                        </span>
                    )}
                </div>

                <p className="text-[8px] sm:text-[10px] md:text-base lg:text-base font-semibold text-gray-500 uppercase tracking-wider">
                    Showing {data?.length ?? 0} Items
                </p>
            </div>

            <div className="mb-8 lg:mb-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 max-w-7xl mx-auto px-4 lg:px-0">
                <label className="bg-gray-100 shadow-sm hover:shadow-md px-2 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-xl cursor-pointer transition-all border border-gray-200/60">
                    <input type="checkbox" checked={filter.isFeatured} onChange={(e) => setFilter({ ...filter, isFeatured: e.target.checked })} className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-gray-900 cursor-pointer flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Featured</span>
                </label>
                <label className="bg-gray-100 shadow-sm hover:shadow-md px-2 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-xl cursor-pointer transition-all border border-gray-200/60">
                    <input type="checkbox" checked={filter.isBestSeller} onChange={(e) => setFilter({ ...filter, isBestSeller: e.target.checked })} className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-gray-900 cursor-pointer flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Best Seller</span>
                </label>
                <label className="bg-gray-100 shadow-sm hover:shadow-md px-2 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-xl cursor-pointer transition-all border border-gray-200/60">
                    <input type="checkbox" checked={filter.isNewArrival} onChange={(e) => setFilter({ ...filter, isNewArrival: e.target.checked })} className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-gray-900 cursor-pointer flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">New Arrival</span>
                </label>
                <label className="bg-gray-100 shadow-sm hover:shadow-md px-2 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-xl cursor-pointer transition-all border border-gray-200/60">
                    <input type="checkbox" checked={filter.limitedEdition} onChange={(e) => setFilter({ ...filter, limitedEdition: e.target.checked })} className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-gray-900 cursor-pointer flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Limited Edition</span>
                </label>
            </div>

            <div className="max-w-7xl mx-auto">

                <div className='relative mt-1.5 min-h-50'>
                    {isLoading ?
                        (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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
                        ) : (
                            <>
                                {
                                    isError ? (
                                        <>
                                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50" >
                                                <div className='flex flex-col items-center gap-5'>
                                                    <h1 className='text-sm font-bold text-gray-500 tracking-tight mb-5'>Not Any Product Founds!</h1>
                                                </div>
                                            </div>
                                        </>
                                    ) : (

                                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-10 place-content-center place-items-center'>
                                            {
                                                data.length > 0 ? (
                                                    data.map((product: Product) => (
                                                        <Card key={product._id} product={product} />
                                                    ))
                                                ) : (
                                                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2V6c0-1.105.895-2 2-2z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                        </svg>
                                                        <p className="text-gray-500 text-lg font-medium">No products found</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>

            <div className="mt-20 mb-15 text-center max-w-7xl mx-auto space-y-4">
                <span className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase tracking-widest">Satisfy Your Craving</span>
                <h2 className="text-[20px] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-500 tracking-tight">
                    READ <span className="text-gray-700">THOUGHTFUL</span> ARTICLES
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-[10px] sm:text-sm md:text-base font-medium leading-relaxed">
                    Explore the latest trends, style tips, and stories behind our latest collections.
                </p>

                <div className="w-[50px] sm:w-[100px] md:w-[150px] lg:w-[200px] mx-auto border-t border-gray-300"></div>
            </div>
            <div className="w-[90vw] mx-auto flex justify-center items-center">
                <BlogSlider />
            </div>

            {showFilter && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1000 transition-opacity duration-300"
                        onClick={() => setShowFilter(false)}
                    />
                    <aside className="fixed top-0 left-0 z-1010 h-full w-[85vw] sm:w-96 bg-white p-5 sm:p-8 border-r border-gray-100 space-y-6 sm:space-y-8 shadow-[10px_0_40px_rgba(0,0,0,0.15)] overflow-y-auto transition-transform duration-500">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg uppercase tracking-wide">Filters</h3>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <button
                                    onClick={handleClearFilters}
                                    disabled={!filter.category && !filter.fit && filter.maxPrice === null && !filter.isFeatured && !filter.isBestSeller && !filter.isNewArrival && !filter.limitedEdition}
                                    className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors uppercase tracking-wider cursor-pointer"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="text-gray-800 hover:text-gray-600 transition-colors cursor-pointer text-xl font-black"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">Category</h4>
                            <div className="flex flex-col gap-2">
                                {categories?.flat()?.map((cat: any) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setFilter({ ...filter, category: filter.category === cat._id ? "" : cat._id })}
                                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${filter.category === cat._id
                                            ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="truncate pr-2">{cat.name}</span>
                                        {filter.category === cat._id && <span className="text-[10px] sm:text-xs flex-shrink-0">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">Fit Profile</h4>
                            <div className="flex flex-wrap gap-2">
                                {fits.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter({ ...filter, fit: filter.fit === f ? "" : f })}
                                        className={`px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer border ${filter.fit === f
                                            ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-900/10"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">Max Price</h4>
                                <span className="text-xs sm:text-sm font-extrabold text-gray-900 bg-gray-50 px-2 sm:px-3 py-1 rounded-lg">
                                    ₹{filter.maxPrice}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="500"
                                max="5000"
                                step="100"
                                value={filter.maxPrice || 5000}
                                onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                            />
                            <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 font-bold">
                                <span>₹500</span>
                                <span>₹5000</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowFilter(false)}
                            className="w-full mt-4 sm:mt-6 bg-gray-900 hover:bg-gray-800 text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-gray-900/10"
                        >
                            Apply Filters
                        </button>
                    </aside>
                </>
            )}
        </div>
    );
};