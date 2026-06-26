import { useState } from 'react';
import '../../index.css';
import { useIncreaseStock } from '../../Hooks/product';

interface Props {
    lowProduct: any[];
    setShowLowProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LowProduct = ({ lowProduct, setShowLowProduct }: Props) => {

    const { mutate: increaseProductStock } = useIncreaseStock();
    const [productId, setProductId] = useState<string>("");
    const [sku, setSku] = useState<string>("");
    const [increaseStock, setIncreaseStock] = useState<boolean>(false);
    const [stock, setStock] = useState<string>("");

    const [productNameFilter, setProductNameFilter] = useState<string>("all");
    const [sizeFilter, setSizeFilter] = useState<string>("all");
    const [colorFilter, setColorFilter] = useState<string>("all");
    const [priceFilter, setPriceFilter] = useState<string>("all");
    const [stockFilter, setStockFilter] = useState<string>("all");

    const handleStockUpdate = () => {
        increaseProductStock({ id: productId, stock: Number(stock), sku });
        setIncreaseStock(false);
        setStock("");
    }

    const lowStockVariants = lowProduct?.flatMap((product: any) =>
        product.variants
            ?.filter((variant: any) => variant.stock <= 5)
            ?.map((variant: any) => ({
                productId: product._id,
                title: product.title,
                image: product.images?.[0],
                sku: variant.sku,
                size: variant.size,
                color: variant.color,
                stock: variant.stock,
                price: variant.discountPrice || variant.price,
            }))
    ) || [];

    const productName = Array.from(new Set(lowStockVariants.map((item: any) => item.title))).filter(Boolean);
    const productSize = Array.from(new Set(lowStockVariants.map((item: any) => item.size))).filter(Boolean);
    const productcolor = Array.from(new Set(lowStockVariants.map((item: any) => item.color))).filter(Boolean);
    const productPrice = Array.from(new Set(lowStockVariants.map((item: any) => item.price))).filter(Boolean);
    const productStock = Array.from(new Set(lowStockVariants.map((item: any) => item.stock))).filter(item => item !== undefined && item !== null);

    const filterProduct = lowStockVariants?.filter((item: any) => {
        const matchName = productNameFilter === "all" || productNameFilter === "" || item.title === productNameFilter || item.sku === productNameFilter;
        const matchSize = sizeFilter === "all" || sizeFilter === "" || item.size === sizeFilter;
        const matchColor = colorFilter === "all" || colorFilter === "" || item.color === colorFilter;
        const matchPrice = priceFilter === "all" || priceFilter === "" || item.price === Number(priceFilter);
        const matchStock = stockFilter === "all" || stockFilter === "" || item.stock === Number(stockFilter);

        return matchName && matchSize && matchColor && matchPrice && matchStock;
    });

    return (
        <>
            <div
                onClick={() => setShowLowProduct(false)}
                className="animate-fade-in-up fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[85%] max-h-[85vh] flex flex-col overflow-hidden z-50 transform transition-all"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Low Stock Alerts
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Variants with 5 or fewer items remaining in inventory.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowLowProduct(false)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="overflow-auto flex-1 bg-gray-50/50">
                        <table className="w-full text-sm text-left">
                            <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-black ring-opacity-5">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className="flex justify-between gap-2">
                                            <span>Product</span>
                                            <select
                                                name="productName"
                                                id="productName"
                                                value={productNameFilter}
                                                onChange={(e) => setProductNameFilter(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-xs w-36 px-3 py-1 rounded-md cursor-pointer"
                                            >
                                                <option value="">All</option>
                                                {productName?.map((item: string, index: number) => (
                                                    <option key={index} value={item}>
                                                        {item.length > 25 ? item.slice(0, 25) + "..." : item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">SKU</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className='flex gap-2 justify-between items-center'>
                                            <span>Size</span>
                                            <select
                                                name="size"
                                                id="size"
                                                value={sizeFilter}
                                                onChange={(e) => setSizeFilter(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-xs px-3 py-1 rounded-md cursor-pointer"
                                            >
                                                <option value="">All</option>
                                                {productSize?.map((item: string, index: number) => (
                                                    <option key={index} value={item}>
                                                        {item.length > 25 ? item.slice(0, 25) + "..." : item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className='flex gap-2 justify-between items-center'>
                                            <span>Color</span>
                                            <select
                                                name="color"
                                                id="color"
                                                value={colorFilter}
                                                onChange={(e) => setColorFilter(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-xs px-3 py-1 rounded-md cursor-pointer"
                                            >
                                                <option value="">All</option>
                                                {productcolor?.map((item: string, index: number) => (
                                                    <option key={index} value={item}>
                                                        {item.length > 25 ? item.slice(0, 25) + "..." : item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className='flex gap-2 justify-between items-center'>
                                            <span>Price</span>
                                            <select
                                                name="price"
                                                id="price"
                                                value={priceFilter}
                                                onChange={(e) => setPriceFilter(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-xs px-3 py-1 rounded-md cursor-pointer"
                                            >
                                                <option value="">All</option>
                                                {productPrice?.map((item: string, index: number) => (
                                                    <option key={index} value={item}>
                                                        {item.length > 25 ? item.slice(0, 25) + "..." : item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className='flex gap-2 justify-between items-center'>
                                            <span>Stock</span>
                                            <select
                                                name="stock"
                                                id="stock"
                                                value={stockFilter}
                                                onChange={(e) => setStockFilter(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-xs px-3 py-1 rounded-md cursor-pointer"
                                            >
                                                <option value="">All</option>
                                                {productStock?.map((item: string, index: number) => (
                                                    <option key={index} value={item}>
                                                        {item.length > 25 ? item.slice(0, 25) + "..." : item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <div className='flex gap-2 justify-between items-center'>
                                            <span>Status</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filterProduct?.map((item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50/80 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-2">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            {item.sku || '-'}
                                        </td>

                                        <td className="px-6 py-4 text-gray-800">
                                            {item.size || '-'}
                                        </td>

                                        <td className="px-6 py-4 text-gray-800">
                                            {item.color || '-'}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{item.price || 0}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                                {item.stock}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.stock === 0
                                                    ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                                    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                                                    }`}
                                            >
                                                {item.stock === 0
                                                    ? "Out of Stock"
                                                    : "Low Stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setIncreaseStock(true);
                                                    setProductId(item.productId);
                                                    setSku(item.sku);
                                                }}
                                                className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!lowStockVariants || lowStockVariants.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No low stock variants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {increaseStock && (
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIncreaseStock(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up transform transition-all">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-white">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                    Increase Stock
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Increase the stock of the selected variant.
                                </p>
                            </div>

                            <button
                                onClick={() => setIncreaseStock(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 sm:h-6 sm:w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <div className="flex flex-col gap-2">
                                <label>Stock</label>
                                <input type="number"
                                    value={stock}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setStock(e.target.value)
                                    }}
                                    placeholder="Enter stock"
                                    className="border-gray-200 border p-2 rounded-md" />
                            </div>

                            <button onClick={handleStockUpdate} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md">Update Stock</button>
                        </div>
                    </div>
                </div >
            )}

        </>
    )
}