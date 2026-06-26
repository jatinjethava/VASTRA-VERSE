import type { Product } from "../../Api/productApi";
import { IoCloseSharp } from "react-icons/io5";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    product: Product;
}

export const ShowDetails = ({
    setSelectedProduct,
    product
}: Props) => {
    const [imageIndex, setImageIndex] = useState<number>(0);

    return (
        <>
            <div onClick={() => {
                setSelectedProduct(null);
            }} className="animate-fade-in-up-delay-3 fixed top-0 left-0 right-0 bottom-0 z-10 bg-black/60 backdrop-blur-sm  opacity-50 transition-opacity duration-300"></div>
            <div className="animate-fade-in-up-delay-3 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-15 bg-white w-[90vw] max-w-6xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                    <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-full cursor-pointer transition-colors">
                        <IoCloseSharp size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-6">
                    <div className="grid relative grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="sticky top-0 self-start border-r border-gray-200 pr-6 space-y-4">
                            <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-100 group">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`${product.images[imageIndex]}`}
                                        alt={product.title}
                                        className="w-full h-[60vh] object-cover transition-transform duration-500"
                                        onClick={() => setImageIndex(imageIndex)}
                                    />
                                ) : (
                                    <div className="w-full flex justify-center items-center bg-gray-200">
                                        <ImageIcon size={64} className="text-gray-400" />
                                    </div>
                                )}
                                {product.isFeatured ? (
                                    <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg">
                                        FEATURED
                                    </span>
                                ) : (
                                    <span className="absolute top-4 left-4 bg-gray-500 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg">
                                        NOT FEATURED
                                    </span>
                                )}
                                {product.isPublished ? (
                                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg">
                                        PUBLISHED
                                    </span>
                                ) : (
                                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg">
                                        DRAFT
                                    </span>
                                )}
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 pb-2 custom-scrollbar">
                                    {product.images.map((img, idx) => (
                                        <img key={idx} src={`${img}`} onClick={() => setImageIndex(idx)} className={`${idx === imageIndex ? "scale-105 shadow-2xl border-2 border-black" : "scale-100 shadow-sm border-gray-200 border-2"} w-20 h-20 rounded-xl object-cover  shadow-sm shrink-0`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-3xl font-bold capitalize text-gray-900 leading-tight">
                                        {product.title}
                                    </h2>
                                    {product.slug && (
                                        <p className="text-xs text-yellow-600 mt-1 font-mono uppercase">
                                            @{product.slug}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {product.discountPrice && product.discountPrice > 0 && product.discountPrice !== product.basePrice && (
                                        <span className="text-3xl font-bold text-black">
                                            ₹{product.discountPrice}
                                        </span>
                                    )}
                                    <span className="text-lg text-gray-400 line-through">
                                        ₹{product.basePrice}
                                    </span>
                                    {product.discountPrice && product.discountPrice < product.basePrice && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold">
                                            {Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Category</p>
                                        <p className="font-semibold text-gray-900 capitalize truncate">
                                            {typeof product.category === 'string' ? product.category : (product.category as any)?.name || "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Total Stock</p>
                                        <p className="font-semibold text-gray-900">
                                            {product.variants?.reduce((acc, v) => acc + (Number(v.stock) || 0), 0) || 0} Units
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Gender</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {product.gender || "Unisex"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Fit</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {product.fit || "Regular"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Material</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {product.material || "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Rating</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {product.ratingsAverage || 0} / 5 ({product.ratingsQuantity || 0} reviews)
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition hover:bg-gray-100">
                                        <p className="text-gray-400 mb-1 text-xs uppercase font-semibold tracking-wider">Sold Count</p>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {product.soldCount || 0}
                                        </p>
                                    </div>
                                </div>

                                {product.tags && product.tags.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-xs uppercase font-semibold tracking-wider text-gray-400 mb-3">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-default"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.variants && product.variants.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-xs uppercase font-semibold tracking-wider text-gray-400 mb-3">Variants</p>

                                        <div className="flex gap-10 my-3">
                                            <div className="flex items-center gap-2">
                                                <p className="bg-green-500 rounded-full w-4 h-4"></p>
                                                <p className="text-sm">Available Stock</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="bg-yellow-500 rounded-full w-4 h-4"></p>
                                                <p className="text-sm">Low Stock</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="bg-red-500 rounded-full w-4 h-4"></p>
                                                <p className="text-sm">Out Of Stock</p>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                            <table className="w-full text-left text-sm text-gray-600">
                                                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 font-semibold">SKU</th>
                                                        <th className="px-4 py-3 font-semibold">Color</th>
                                                        <th className="px-4 py-3 font-semibold">Size</th>
                                                        <th className="px-4 py-3 font-semibold">Stock</th>
                                                        <th className="px-4 py-3 font-semibold">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {product.variants.map((variant, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 font-medium text-gray-900">{variant.sku || "N/A"}</td>
                                                            <td className="px-4 py-3">{variant.color || "N/A"}</td>
                                                            <td className="px-4 py-3">{variant.size || "N/A"}</td>
                                                            <td className="px-4 py-3">
                                                                {variant.stock && variant.stock >= 10 ? (
                                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                                        {variant.stock}
                                                                    </span>
                                                                ) : variant.stock && variant.stock >= 0 ? (
                                                                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                                                        {variant.stock}
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                                        Out of Stock
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-green-600">
                                                                {variant.discountPrice ? (
                                                                    <>
                                                                        <span className="text-gray-500 text-[10px] line-through mr-2">₹{variant.price}</span>
                                                                        <span className="font-semibold">₹{variant.discountPrice}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>₹{variant.price}</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};