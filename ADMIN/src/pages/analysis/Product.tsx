import { useProductAnalysis, useViewProductAnalysis, useWishlistedAnalysis, useCategoryAnalysis } from "../../Hooks/analysis";
import { useGetCategories } from "../../Hooks/category";
import '../../index.css'

export const ProductAnalysis = () => {

    const { data: productAnalysis, isLoading: productAnalysisLoading } = useProductAnalysis();
    const { data: viewProductAnalysis, isLoading: viewProductAnalysisLoading } = useViewProductAnalysis();
    const { data: wishlistedAnalysis, isLoading: wishlistedAnalysisLoading } = useWishlistedAnalysis();
    const { data: categoryAnalysis, isLoading: categoryAnalysisLoading } = useCategoryAnalysis();
    const { data: allCategories } = useGetCategories();
    const isLoading = productAnalysisLoading || viewProductAnalysisLoading || wishlistedAnalysisLoading || categoryAnalysisLoading

    const categoryArr = categoryAnalysis?.categoryAnalysis?.map((cat: any) => allCategories?.find((category: any) => category._id === cat._id))

    return (
        <div className="relative min-h-screen">
            {isLoading && (
                <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
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

            <div className="my-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl text-gray-800 tracking-tight">Top Selling Products</h1>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-100">
                        Top 10
                    </span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Sold</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productAnalysis?.topProducts?.map((product: any, index: number) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                #{index + 1}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden">
                                                    {product.product?.images?.[0] ? (
                                                        <img
                                                            src={product.product.images[0]}
                                                            alt={product.product?.title || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{product.product?.title || product.product?.name || 'Unknown Product'}</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">ID: {product._id ? product._id.slice(0, 6).toUpperCase() : "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 text-green-600 font-bold text-sm border border-green-100">
                                                {product.totalSold}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="text-sm font-bold text-gray-800">
                                                ₹{product.revenue?.toLocaleString('en-IN') || 0}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!productAnalysis?.topProducts || productAnalysis.topProducts.length === 0) && !isLoading && (
                            <div className="py-12 text-center text-gray-500">
                                No sales data available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="my-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl text-gray-800 tracking-tight">Low Selling Products</h1>
                    <span className="px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-100">
                        Bottom 10
                    </span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Sold</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productAnalysis?.lowSelling?.map((product: any, index: number) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                                #{index + 1}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden ">
                                                    {product.product?.images?.[0] ? (
                                                        <img
                                                            src={product.product.images[0]}
                                                            alt={product.product?.title || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{product.product?.title || product.product?.name || 'Unknown Product'}</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">ID: {product._id ? product._id.slice(0, 6).toUpperCase() : "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-sm border border-red-100">
                                                {product.totalSold}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="text-sm font-bold text-gray-800">
                                                ₹{product.revenue?.toLocaleString('en-IN') || 0}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!productAnalysis?.lowSelling || productAnalysis.lowSelling.length === 0) && !isLoading && (
                            <div className="py-12 text-center text-gray-500">
                                No sales data available yet.
                            </div>
                        )}
                    </div>
                </div>
                <div className="my-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl text-gray-800 tracking-tight">Most Viewed Products</h1>
                        <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full border border-purple-100">
                            Top 10 Viewed
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Views</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {viewProductAnalysis?.mostViewProduct?.map((product: any, index: number) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                            <td className="py-4 px-6 w-24">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                                    #{index + 1}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden">
                                                        {product.product?.images?.[0] ? (
                                                            <img
                                                                src={product.product.images[0]}
                                                                alt={product.product?.title || 'Product'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{product.product?.title || product.product?.name || 'Unknown Product'}</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">ID: {product._id ? product._id.slice(0, 6).toUpperCase() : "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-bold text-sm border border-purple-100">
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {product.viewCount?.toLocaleString('en-IN') || 0} Views
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!viewProductAnalysis?.mostViewProduct || viewProductAnalysis.mostViewProduct.length === 0) && !isLoading && (
                                <div className="py-12 text-center text-gray-500">
                                    No view data available yet.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl text-gray-800 tracking-tight">Most Wishlisted Products</h1>
                            <span className="px-4 py-1.5 bg-pink-50 text-pink-600 text-sm font-semibold rounded-full border border-pink-100">
                                Top 10 Loved
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {wishlistedAnalysis?.mostWishlisted?.map((product: any, index: number) => (
                                <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        {product.product?.images?.[0] ? (
                                            <img
                                                src={product.product.images[0]}
                                                alt={product.product?.title || 'Product'}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 font-bold text-xs shadow-sm">
                                            #{index + 1}
                                        </div>
                                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/90 backdrop-blur-sm flex items-center text-white text-xs font-bold shadow-sm">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            {product.wishlistCount}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-pink-600 transition-colors">
                                            {product.product?.title || product.product?.name || 'Unknown Product'}
                                        </h3>
                                        <p className="text-xs text-gray-500">ID: {product._id ? product._id.slice(0, 6).toUpperCase() : "N/A"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!wishlistedAnalysis?.mostWishlisted || wishlistedAnalysis.mostWishlisted.length === 0) && !isLoading && (
                            <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                                No wishlist data available yet.
                            </div>
                        )}
                    </div>
                    <div className="my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl text-gray-800 tracking-tight">Category Sales Analysis</h1>
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full border border-indigo-100">
                                Revenue by Category
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {categoryAnalysis?.categoryAnalysis?.map((category: any, index: number) => (
                                <div key={category._id || index} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    {categoryArr[index]?.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5">ID: {categoryArr[index]?._id || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                                            {category.totalSold} Sold
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 font-medium">Total Revenue</span>
                                        <span className="text-lg font-bold text-gray-800">
                                            ₹{category.revenue?.toLocaleString('en-IN') || 0}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!categoryAnalysis?.categoryAnalysis || categoryAnalysis.categoryAnalysis.length === 0) && !isLoading && (
                            <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                                No category sales data available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}