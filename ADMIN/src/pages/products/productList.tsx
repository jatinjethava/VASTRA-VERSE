import { useState } from "react";
import { Edit, Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { useGetProducts, useDeleteProduct, useUpdateProduct } from "../../Hooks/product";
import type { Product } from "../../Api/productApi";
import '../../index.css'
import { ShowDetails } from "./ShowDetails";
import { ProductForm } from "./ProductForm";
import { toast } from "sonner";
import { useGetCategories } from "../../Hooks/category";

export const ProductList = ({ categoryFilter }: { categoryFilter: string }) => {

    const { data: products, isLoading, isError, error } = useGetProducts();
    const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
    const { data: category } = useGetCategories();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [idUpdate, setIdUpdate] = useState<boolean>(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [product, setProduct] = useState<Product>({
        title: "",
        description: "",
        basePrice: null,
        discountPrice: null,
        costPrice: null,
        category: "",
        gender: "men",
        material: "",
        fit: "regular",
        images: [],
        tags: [],
        isFeatured: false,
        isPublished: false,
        isBestSeller: false,
        isNewArrival: false,
        seoTitle: "",
        seoDescription: "",
        variants: [
            {
                size: "",
                color: "",
                stock: null,
                sku: "",
                price: null,
                discountPrice: null,
            }
        ]
    });
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setProduct(prev => ({ ...prev, images: [...prev.images, ...(files as any)] }));
        }
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setProduct(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const addVariant = () => {
        setProduct({
            ...product,
            variants: [
                ...product.variants,
                {
                    size: "",
                    color: "",
                    stock: null,
                    sku: "",
                    price: null,
                    discountPrice: null,
                }
            ]
        });
    };

    const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = [...product.variants];
        updated[index] = { ...updated[index], [name]: value };
        setProduct({ ...product, variants: updated });
    };

    const removeVariant = (index: number) => {
        const filtered = product.variants.filter((_, i) => i !== index);

        setProduct((prev) => ({
            ...prev,
            variants: filtered,
        }));
    };

    const removeTag = (index: number) => {
        const filtered = product.tags.filter((_, i) => i !== index);
        setProduct({ ...product, tags: filtered });
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const invalidField = Object.keys(product).find((key) => {

            const value = (product as any)[key];

            return (
                value === null ||
                value === undefined ||
                value === "" ||
                (Array.isArray(value.variants) && value.length === 0)
            );
        });

        if (invalidField) {

            toast.error(`${invalidField} is required`, {
                duration: 1500,
            });

            return;
        }

        await updateProduct({ id: product._id as string, product });

        setProduct({
            title: "",
            description: "",
            basePrice: null,
            discountPrice: null,
            costPrice: null,
            category: "",
            gender: "men",
            material: "",
            fit: "regular",
            images: [],
            tags: [],
            isFeatured: false,
            isPublished: false,
            isBestSeller: false,
            isNewArrival: false,
            seoTitle: "",
            seoDescription: "",
            variants: [
                {
                    size: "",
                    color: "",
                    stock: null as any,
                    sku: "",
                    price: null as any,
                    discountPrice: null as any,
                }
            ]
        });
        setIdUpdate(false);
        setImagePreviews([]);
        setIdUpdate(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete it?")) {
            await deleteProduct(id);
        }
    };

    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterMaterial, setFilterMaterial] = useState<string>("all");
    const [filterPrice, setFilterPrice] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const uniqueMaterials = Array.from(new Set(products?.map((p: any) => p.material).filter(Boolean)));

    const filterProducts = products?.filter((product: any) => {
        let matches = true;

        if (categoryFilter === "allCategory") {
            matches = true;
        }

        if (categoryFilter === "isFeatured") {
            matches = product.isFeatured;
        }

        if (categoryFilter === "isPublished") {
            matches = product.isPublished;
        }

        if (categoryFilter === "isBestSeller") {
            matches = product.isBestSeller;
        }

        if (categoryFilter === "isNewArrival") {
            matches = product.isNewArrival;
        }

        if (categoryFilter === "limitedEdition") {
            matches = product.limitedEdition;
        }

        if (filterCategory !== "all" && product.category !== filterCategory) {
            matches = false;
        }

        if (filterMaterial !== "all" && product.material !== filterMaterial) {
            matches = false;
        }

        if (filterStatus !== "all") {
            if (filterStatus === "published" && !product.isPublished) matches = false;
            if (filterStatus === "draft" && product.isPublished) matches = false;
        }

        if (filterPrice !== "all") {
            const price = product.discountPrice || product.basePrice || 0;
            if (filterPrice === "under500" && price >= 500) matches = false;
            if (filterPrice === "500to1000" && (price < 500 || price > 1000)) matches = false;
            if (filterPrice === "over1000" && price <= 1000) matches = false;
        }

        return matches;
    });

    return (
        <>
            <div className="mt-5 lg:col-span-2 bg-gray-100 border border-gray-200 rounded-lg animate-fade-in-up-delay-3">
                <div className="flex items-center justify-between p-5 pb-0">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            Product List
                        </h2>
                        <p className="text-xs text-gray-600 mt-0.5">
                            Manage your products
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto mt-4 relative">
                    {isLoading ? (
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
                    ) : isError ? (
                        <div className="p-10 text-center text-red-500 text-sm">
                            Error loading products: {(error as Error)?.message}
                        </div>
                    ) : !products || products.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 text-sm">
                            <div className="bg-white text-gray-500 w-fit m-auto px-4 py-5 shadow-lg shadow-gray-400 rounded-lg">
                                No products found. Add a product to see it here.
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        Description
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <span>Category</span>
                                            <select
                                                value={filterCategory}
                                                onChange={(e) => setFilterCategory(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                {category?.map((cat: any) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <span>Material</span>
                                            <select
                                                value={filterMaterial}
                                                onChange={(e) => setFilterMaterial(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                {uniqueMaterials.map((mat: any, idx) => (
                                                    <option key={idx} value={mat}>
                                                        {mat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex flex-col gap-1">
                                            <span>Price</span>
                                            <select
                                                value={filterPrice}
                                                onChange={(e) => setFilterPrice(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                <option value="under500">Under ₹500</option>
                                                <option value="500to1000">₹500 - ₹1000</option>
                                                <option value="over1000">Over ₹1000</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                                        Stock
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex flex-col gap-1">
                                            <span>Status</span>
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="border border-gray-300 rounded text-xs px-1 py-0.5 outline-none bg-white font-normal"
                                            >
                                                <option value="all">All</option>
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-600 uppercase tracking-wider text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filterProducts || []).map((product: Product) => {
                                    const totalStock = product.variants?.reduce((acc, v) => acc + (Number(v.stock) || 0), 0) || 0;
                                    const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
                                    console.log(firstImage)
                                    return (
                                        <tr
                                            key={product._id || product.title}
                                            className="border-b border-gray-200 last:border-b-0 hover:bg-gray-200 transition-colors"
                                        >
                                            <td className="px-5 w-40 py-3.5 flex items-center gap-3 overflow-hidden">
                                                {firstImage ? (
                                                    <img src={`${firstImage}`} alt={product.title} className="w-15 h-15 rounded-md object-cover border border-gray-300" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-gray-300 flex items-center justify-center text-gray-500 border border-gray-300">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 truncate" title={product.title}>
                                                        {product.title.length > 5 ? product.title.slice(0, 5) + "..." : product.title}
                                                    </p>
                                                    <p className="text-[11px] text-gray-600">
                                                        {product.gender || "Unisex"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <span className="text-xs max-w-96 line-clamp-1  text-gray-600 ">
                                                    {product.description}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {category?.find((c: any) => c._id === product.category)?.name || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {product.material}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-sm font-semibold text-green-600">
                                                    ₹{product.basePrice}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 hidden sm:table-cell">
                                                <span className="text-sm text-gray-600">
                                                    {totalStock} in stock
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {product.isPublished ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button title="View"
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="p-1.5 rounded-md hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-900 cursor-pointer border-none bg-transparent">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button title="Edit"
                                                        onClick={() => {
                                                            setIdUpdate(true),
                                                                setProduct(product),
                                                                setImagePreviews(product.images || [])
                                                        }}
                                                        className="p-1.5 rounded-md hover:bg-gray-300 transition-colors text-blue-600 hover:text-blue-800 cursor-pointer border-none bg-transparent">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button title="Delete"
                                                        onClick={() => {
                                                            handleDelete(product._id as string);
                                                        }} className="p-1.5 rounded-md hover:bg-gray-300 transition-colors text-red-600 hover:text-red-800 cursor-pointer border-none bg-transparent">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    )}
                    {isDeleting && (
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
                    )}
                </div>
            </div>

            {
                selectedProduct && (
                    <>
                        <ShowDetails setSelectedProduct={setSelectedProduct} product={selectedProduct} />
                    </>
                )
            }

            {idUpdate && (
                <ProductForm
                    idUpdate={idUpdate}
                    handleUpdate={handleUpdate}
                    handleImageChange={handleImageChange}
                    addVariant={addVariant}
                    handleVariantChange={handleVariantChange}
                    handleChange={handleChange}
                    removeVariant={removeVariant}
                    removeImage={removeImage}
                    removeTag={removeTag}
                    isUpdating={isUpdating}
                    product={product}
                    imagePreviews={imagePreviews}
                    setProduct={setProduct}
                    setIdUpdate={setIdUpdate} />
            )}
        </>
    );
};