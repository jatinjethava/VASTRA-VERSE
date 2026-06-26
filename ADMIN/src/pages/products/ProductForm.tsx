import { IoCloseSharp } from "react-icons/io5";
import { fabricTags, productTags } from "../../assets/tags";
import { useGetCategories } from "../../Hooks/category";

interface Props {
    setShowProductForm?: (value: boolean) => void;
    product: any;
    setProduct: React.Dispatch<React.SetStateAction<any>>;
    imagePreviews: string[];
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    addVariant: () => void;
    handleVariantChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    removeVariant: (index: number) => void;
    isPending?: boolean;
    removeTag: (index: number) => void;
    idUpdate?: boolean;
    setIdUpdate?: (value: boolean) => void;
    handleUpdate?: (e: React.FormEvent<HTMLFormElement>) => void;
    isUpdating?: boolean;
}

export const ProductForm = ({
    setShowProductForm,
    product,
    setProduct,
    imagePreviews,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleChange,
    addVariant,
    handleVariantChange,
    removeVariant,
    isPending,
    removeTag,
    idUpdate,
    setIdUpdate,
    handleUpdate,
    isUpdating
}: Props) => {

    const { data: categories } = useGetCategories();

    const productFlags = [
        {
            name: "isFeatured",
            label: "Featured",
            tooltip: "Highlighted product shown prominently across the store.",
        },
        {
            name: "isPublished",
            label: "Published",
            tooltip: "Visible to customers and available for purchase.",
        },
        {
            name: "isBestSeller",
            label: "Best Seller",
            tooltip: "Top-performing product based on sales volume.",
        },
        {
            name: "isNewArrival",
            label: "New Arrival",
            tooltip: "Recently added product to the catalog.",
        },
        {
            name: "limitedEdition",
            label: "Limited Edition",
            tooltip: "Special release available in limited quantity or time.",
        },
    ];

    return (
        <>
            <div className="fixed inset-0 z-60 flex justify-center items-start pt-10 pb-10 px-4 sm:px-6 overflow-y-auto">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                ></div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl relative z-10 flex flex-col max-h-[90vh] animate-fade-in-up">
                    <div className="p-6 sm:px-8 sm:pt-8 sm:pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-20">
                        <div className="w-full">
                            <h1 className="font-serif text-3xl text-center font-bold text-gray-800 dark:text-white">{idUpdate ? "Edit Product" : "Add Product"}</h1>
                            <div className="mx-auto bg-gray-400 h-0.5 w-65 mt-1 rounded-full"></div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowProductForm?.(false);
                                setIdUpdate?.(false);
                            }}
                            className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isPending || isUpdating && (
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
                    <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                        <form
                            onSubmit={idUpdate ? handleUpdate : handleSubmit}
                            className="space-y-3"
                        >
                            <div className="grid md:grid-cols-2 gap-6">

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter title"
                                        value={product.title}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map((category: any) => (
                                            <option key={category._id} value={category._id}>
                                                {category.level === 0
                                                    ? category.name
                                                    : `└ ${category.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm block mb-2 font-medium">
                                    Description
                                </label>

                                <textarea
                                    rows={4}
                                    name="description"
                                    placeholder="Enter description ..."
                                    value={product.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Base Price
                                    </label>

                                    <input
                                        type="number"
                                        name="basePrice"
                                        placeholder="Enter base price"
                                        value={product.basePrice}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Discount Price
                                    </label>

                                    <input
                                        type="number"
                                        name="discountPrice"
                                        placeholder='Enter discount price'
                                        value={product.discountPrice}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Cost Price
                                    </label>

                                    <input
                                        type="number"
                                        name="costPrice"
                                        placeholder='Enter cost price'
                                        value={product.costPrice}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    />
                                </div>

                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={product.gender}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    >
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="unisex">Unisex</option>
                                        <option value="kids">Kids</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm block mb-2 font-medium">
                                        Fit
                                    </label>

                                    <select
                                        name="fit"
                                        value={product.fit}
                                        onChange={handleChange}
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                    >
                                        <option value="slim">Slim</option>
                                        <option value="regular">Regular</option>
                                        <option value="oversized">Oversized</option>
                                    </select>
                                </div>

                            </div>
                            <div>
                                <label className="text-sm block mb-2 font-medium">
                                    Material
                                </label>

                                <select
                                    name="material"
                                    value={product.material}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                >
                                    <option value="">Select Material</option>
                                    {fabricTags.map((fabric, index) => (
                                        <option key={index} value={fabric}>
                                            {fabric}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-sm block mb-2 font-medium">
                                    Product Image
                                </label>

                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-400 dark:border-gray-600 px-6 py-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group">
                                    <input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleImageChange}
                                        title=" "
                                        accept="image/*"
                                    />

                                    <div className="text-center w-full flex flex-col items-center pointer-events-none z-20">
                                        {imagePreviews.length > 0 ? (
                                            <div className="flex flex-wrap gap-4 justify-center mb-4 pointer-events-auto">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group/image">
                                                        <img src={preview} alt={`Preview ${index}`} className="h-32 w-32 rounded-lg object-cover shadow-md" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(index); }}
                                                                className="text-white font-bold text-lg bg-red-500/90 px-2 py-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                                                            >
                                                                <IoCloseSharp size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                            </svg>
                                        )}

                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative font-semibold text-blue-600 dark:text-blue-400"
                                            >
                                                <span>Upload files</span>
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500 dark:text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>

                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm block font-medium">
                                        Variants
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="bg-gray-800 text-white px-5 py-2 rounded-xl"
                                    >
                                        Add Variant
                                    </button>
                                </div>

                                <div className="space-y-4">

                                    {product.variants.map((variant, index) => (

                                        <div
                                            key={index}
                                            className="border rounded-lg p-5 grid md:grid-cols-3 gap-4 relative"
                                        >

                                            <select
                                                value={variant.size}
                                                name="size"
                                                onChange={(e) => handleVariantChange(index, e)}
                                                className="border border-gray-400 rounded-lg px-2 py-2 outline-none focus:ring focus:ring-gray-500"
                                            >
                                                <option value="">Select size</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>

                                            <select
                                                value={variant.color}
                                                name="color"
                                                onChange={(e) => handleVariantChange(index, e)}
                                                className="border border-gray-400 rounded-lg px-2 py-2 outline-none focus:ring focus:ring-gray-500"
                                            >
                                                <option value="">Select color</option>
                                                <option value="White">White</option>
                                                <option value="Red">Red</option>
                                                <option value="Black">Black</option>
                                                <option value="Yellow">Yellow</option>
                                                <option value="Blue">Blue</option>
                                                <option value="Green">Green</option>
                                            </select>

                                            <input
                                                type="number"
                                                name="stock"
                                                placeholder="Stock"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    handleVariantChange(index, e)
                                                }
                                                className="border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                            />

                                            <input
                                                type="text"
                                                name="sku"
                                                placeholder="SKU"
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    handleVariantChange(index, e)
                                                }
                                                className="border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                            />

                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="Price"
                                                value={variant.price}
                                                onChange={(e) =>
                                                    handleVariantChange(index, e)
                                                }
                                                className="border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                            />

                                            <input
                                                type="number"
                                                name="discountPrice"
                                                placeholder="Discount Price"
                                                value={variant.discountPrice}
                                                onChange={(e) =>
                                                    handleVariantChange(index, e)
                                                }
                                                className="border border-gray-400 rounded-lg px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-sm px-1 text-gray-500 cursor-pointer hover:underline hover:underline-offset-4 rounded-lg w-fit"
                                            >
                                                remove
                                            </button>
                                        </div>

                                    ))}

                                </div>

                            </div>


                            <div className="grid md:grid-cols-2 gap-6 mt-5">
                                <div className="flex flex-col gap-3 md:col-span-2">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const newTag = e.target.value;
                                            if (newTag && !product.tags.includes(newTag as never)) {
                                                setProduct(prev => ({
                                                    ...prev,
                                                    tags: [...prev.tags, newTag] as never[]
                                                }));
                                            }
                                        }}
                                        className="w-full border border-gray-400 rounded-xl px-4 py-2 outline-none focus:ring focus:ring-gray-500 bg-white"
                                    >


                                        <option value="">Select Tags</option>
                                        {productTags.map((tag, index) => (
                                            <option key={index} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>

                                    {product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {product.tags.map((tag, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full pl-4 pr-1 py-1 w-fit shadow-sm hover:bg-gray-200 transition-colors"
                                                >
                                                    <span className="text-sm font-medium text-gray-700">{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeTag(i);
                                                        }}
                                                        className="flex items-center justify-center p-1 bg-white text-gray-500 hover:bg-red-500 hover:text-white rounded-full transition-all focus:outline-none shadow-sm"
                                                        title="Remove tag"
                                                    >
                                                        <IoCloseSharp size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-5">
                                <input
                                    type="text"
                                    name="seoTitle"
                                    placeholder="SEO Title"
                                    value={product.seoTitle}
                                    onChange={handleChange}
                                    className="border border-gray-400 rounded-xl px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                />

                                <input
                                    type="text"
                                    name="seoDescription"
                                    placeholder="SEO Description"
                                    value={product.seoDescription}
                                    onChange={handleChange}
                                    className="border border-gray-400 rounded-xl px-4 py-2 outline-none focus:ring focus:ring-gray-500"
                                />

                            </div>

                            <div className="flex gap-8 mt-2">

                                {productFlags.map((flag) => (
                                    <div key={flag.name} className="relative group flex items-center">
                                        <label className="text-sm flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={flag.name}
                                                checked={(product as any)[flag.name] || false}
                                                onChange={handleChange}
                                            />
                                            {flag.label}
                                        </label>
                                        <div className="absolute bottom-full left-30 -translate-x-1/2 mb-2 w-60 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal text-center">
                                            {flag.tooltip}
                                            <div className="absolute top-full left-1/4 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                        </div>
                                    </div>
                                ))}


                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-90"
                            >
                                {idUpdate ? "Update Product" : "Create Product"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}