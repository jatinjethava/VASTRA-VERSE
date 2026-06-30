import { useState } from "react";
import { HiMiniPlus } from "react-icons/hi2";
import { useAddCategory, useGetParentCategories, useGetCategories, useUpdateCategory, useDeleteCategory } from "../Hooks/category";
import '../index.css'

export const Category = () => {

    const { mutateAsync: createCategory, isPending: isCreating } = useAddCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
    const { data: parentCategories } = useGetParentCategories();
    const { data: categories, isLoading: isFetchingCategories } = useGetCategories();

    const [editingId, setEditingId] = useState<string | null>(null);

    const isPending = isCreating || isUpdating || isDeleting;

    const [category, setCategory] = useState({
        name: "",
        slug: "",
        description: "",
        banner: "",
        parentCategory: "",
        sortOrder: 0,
        seoTitle: "",
        seoDescription: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const file = (e.target as HTMLInputElement).files?.[0];
        setCategory(prev => ({ ...prev, [name]: file ? file : value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending) return;

        const formData = new FormData();
        formData.append("name", category.name);
        formData.append("slug", category.slug);
        formData.append("description", category.description);
        if (category.banner) {
            formData.append("banner", category.banner);
        }
        formData.append("parentCategory", category.parentCategory);
        formData.append("sortOrder", category.sortOrder.toString());
        formData.append("seoTitle", category.seoTitle);
        formData.append("seoDescription", category.seoDescription);

        if (editingId) {
            await updateCategory({ id: editingId, category: formData });
        } else {
            await createCategory(formData);
        }

        setEditingId(null);
        setCategory({
            name: "",
            slug: "",
            description: "",
            banner: null as any,
            parentCategory: "",
            sortOrder: 0,
            seoTitle: "",
            seoDescription: "",
        });
        e.currentTarget.reset();
    }

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        setCategory({
            name: item.name || "",
            slug: item.slug || "",
            description: item.description || "",
            banner: null as any,
            parentCategory: item.parentCategory || "",
            sortOrder: item.sortOrder || 0,
            seoTitle: item.seoTitle || "",
            seoDescription: item.seoDescription || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(id);
        }
    };

    return (
        <>
            <div className="relative">

                {isPending && (
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

                <div className="mb-4 flex items-center gap-3">
                    <HiMiniPlus className="text-gray-400 text-xl" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Categories</h3>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-md shadow-gray-200 w-full" >

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={category.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Men"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={category.slug}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                                placeholder="men"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                name="description"
                                value={category.description}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Category description..."
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Banner Image
                            </label>

                            <input
                                type="file"
                                name="banner"
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none cursor-pointer file:bg-gray-200 file:border-0 file:rounded-lg file:px-4 file:py-2 file:font-medium"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Parent Category
                            </label>

                            <select
                                name="parentCategory"
                                value={category.parentCategory}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                            >
                                <option value=""> Root Category </option>
                                {parentCategories?.map((item: any) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Sort Order
                            </label>

                            <input
                                type="number"
                                name="sortOrder"
                                value={category.sortOrder}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                SEO Title
                            </label>

                            <input
                                type="text"
                                name="seoTitle"
                                value={category.seoTitle}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Your Seo Title"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                SEO Description
                            </label>

                            <textarea
                                rows={3}
                                name="seoDescription"
                                value={category.seoDescription}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 border-gray-300 focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Seo Description"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg"
                        >
                            {editingId ? "Update Category" : "Save Category"}
                        </button>

                    </form>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-lg">Existing Categories</h3>

                    {isFetchingCategories ? (
                        <p className="text-gray-500">Loading categories...</p>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md shadow-gray-200 overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                                        <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categories?.map((cat: any) => (
                                        <tr key={cat._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{cat.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{cat.slug}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{cat.sortOrder}</td>
                                            <td className="px-6 py-4 text-sm text-right whitespace-nowrap font-medium">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!categories || categories.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}