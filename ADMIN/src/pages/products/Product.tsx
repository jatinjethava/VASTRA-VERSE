import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { toast } from "sonner";
import { useAddProduct, useGetProducts } from "../../Hooks/product";
import { ProductList } from "./productList";
import "../../index.css"
import { ProductForm } from "./ProductForm";
import { AlertTriangle } from "lucide-react";
import { LowProduct } from "./LowProduct";

export const Product = () => {

    const { mutate, isPending } = useAddProduct();
    const { data: allProducts } = useGetProducts();

    const [product, setProduct] = useState({
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
        limitedEdition: false,
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
    const [showProductForm, setShowProductForm] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [showLowProduct, setShowLowProduct] = useState<boolean>(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        mutate(product, {
            onSuccess: () => {
                setProduct({
                    title: "",
                    description: "",
                    basePrice: "",
                    discountPrice: "",
                    costPrice: "",
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
                    limitedEdition: false,
                    seoTitle: "",
                    seoDescription: "",
                    variants: [
                        {
                            size: "",
                            color: "",
                            stock: "",
                            sku: "",
                            price: "",
                            discountPrice: "",
                        }
                    ]
                });
                setImagePreviews([]);
                setShowProductForm(false);
            }
        });
    };

    const removeTag = (index: number) => {
        const filtered = product.tags.filter((_, i) => i !== index);
        setProduct({ ...product, tags: filtered });
    }

    const lowProduct = allProducts?.filter((product: any) =>
        product.variants?.some(
            (variant: any) => variant.stock <= 5
        )
    );

    return (
        <>
            <div className="animate-fade-in-up flex items-center justify-between">
                <div className="flex flex-wrap justify-between items-center w-full">
                    <div className="w-1/2">
                        <h1 className=" text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                        <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dolorum tempora totam sint, cupiditate provident minima dolor, laborum reprehenderit rem officiis id? Iste recusandae voluptates nulla neque placeat porro sunt.</p>
                    </div>
                    <div className="w-fit animate-fade-in-up">
                        <button onClick={() => setShowProductForm(true)} className="delay-200 cursor-pointer shadow-md bg-gray-800 text-gray-50 px-3 py-2 rounded-md transition-colors flex items-center gap-2"><IoAdd color="white" />Add Product</button>
                    </div>
                </div>
            </div>

            {lowProduct?.length > 0 && (
                <div
                    onClick={() => setShowLowProduct(true)}
                    className="animate-fade-in-up hover:animate-zoom-in cursor-pointer mt-5 ml-auto flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                    <AlertTriangle className="w-5 h-5 text-yellow-600 animate-pulse" />

                    <div>
                        <p className="text-xs text-gray-500">
                            Inventory Alert
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                            {lowProduct?.length || 0} Low Stock Products
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-5">
                <div className="relative">
                    <label
                        htmlFor="category"
                        className="absolute -top-2 left-3 tracking-wider bg-white px-1 text-xs font-medium text-gray-500"
                    >
                        Filter By
                    </label>

                    <select
                        id="categoryFilter"
                        name="categoryFilter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="min-w-xs rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                    >
                        <option value="allCategory">All Categories</option>
                        <option value="isFeatured">⭐ Featured</option>
                        <option value="isPublished">📢 Published</option>
                        <option value="isBestSeller">🔥 Best Seller</option>
                        <option value="isNewArrival">🆕 New Arrival</option>
                        <option value="limitedEdition">💎 Limited Edition</option>
                    </select>
                </div>
            </div>

            {showLowProduct && (
                <LowProduct lowProduct={lowProduct} setShowLowProduct={setShowLowProduct} />
            )}

            {showProductForm && (
                <ProductForm
                    setShowProductForm={setShowProductForm}
                    product={product}
                    setProduct={setProduct}
                    imagePreviews={imagePreviews}
                    handleImageChange={handleImageChange}
                    removeImage={removeImage}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    addVariant={addVariant}
                    handleVariantChange={handleVariantChange}
                    removeVariant={removeVariant}
                    isPending={isPending}
                    removeTag={removeTag}
                    idUpdate={false}
                />
            )}

            <div>
                <ProductList categoryFilter={categoryFilter} />
            </div>
        </>
    );
}