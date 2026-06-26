import { useState } from "react";
import { PlusCircle, ImageIcon, Edit, Trash2, X } from "lucide-react";
import { useFetchAllFlashSales, useCreateFlashSales, useUpdateFlashSales, useDeleteFlashSales, useToggleFlashSales } from "../../Hooks/marketing";
import { useGetCategories } from "../../Hooks/category";
import { useGetProducts } from "../../Hooks/product";
import { toast } from "sonner";

export const FlashSales = () => {
    const { data: flashSalesResponse, isLoading: flashSalesLoading, isError } = useFetchAllFlashSales();
    const flashSales = flashSalesResponse || [];

    const { data: categoriesData } = useGetCategories();
    const categories = categoriesData || [];

    const { data: productsData } = useGetProducts();
    const products = productsData || [];

    const { mutateAsync: createFlashSales, isPending: isCreating } = useCreateFlashSales();
    const { mutateAsync: updateFlashSales, isPending: isUpdating } = useUpdateFlashSales();
    const { mutateAsync: deleteFlashSales } = useDeleteFlashSales();
    const { mutateAsync: toggleFlashSales } = useToggleFlashSales();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        target: "all",
        targetIds: [] as string[],
        startDate: "",
        endDate: "",
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            discountType: "percentage",
            discountValue: "",
            target: "all",
            targetIds: [],
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setImageFile(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (flashSale: any) => {
        setFormData({
            name: flashSale.name || "",
            description: flashSale.description || "",
            discountType: flashSale.discountType || "percentage",
            discountValue: flashSale.discountValue || "",
            target: flashSale.target || "all",
            targetIds: flashSale.targetIds || [],
            startDate: flashSale.startDate ? new Date(flashSale.startDate).toISOString().split('T')[0] : "",
            endDate: flashSale.endDate ? new Date(flashSale.endDate).toISOString().split('T')[0] : "",
            isActive: flashSale.isActive ?? true,
        });
        setEditingId(flashSale._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this flash sale?')) {
            await deleteFlashSales(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingId && !imageFile) {
            toast.error("Please upload an image for the flash sale.");
            return;
        }

        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        payload.append("discountType", formData.discountType);
        payload.append("discountValue", formData.discountValue.toString());
        payload.append("target", formData.target);
        formData.targetIds.forEach(id => {
            payload.append("targetIds", id);
        });
        payload.append("startDate", formData.startDate);
        payload.append("endDate", formData.endDate);
        payload.append("isActive", formData.isActive.toString());

        if (imageFile) {
            payload.append("image", imageFile);
        }

        try {
            if (editingId) {
                await updateFlashSales({ id: editingId, data: payload as any });
            } else {
                await createFlashSales(payload as any);
            }
            resetForm();
        } catch (error) {
            console.error("Error submitting flash sale", error);
        }
    };

    if (flashSalesLoading) {
        return <div className="flex h-[55vh] items-center justify-center">
            <div className="dot-spinner">
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
            </div>
        </div>
    }

    if (isError) {
        return <div>Error while fetching flash sales...</div>
    }

    return (
        <div className="mt-6 animate-fade-in-up">
            {!isFormOpen ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Flash Sales</h2>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={20} />
                            Create Flash Sales
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flashSales && flashSales.length > 0 ? flashSales.map((flashSale: any) => (
                            <div key={flashSale._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden relative bg-gray-100">
                                    {flashSale.image ? (
                                        <img src={flashSale.image} alt={flashSale.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold ${flashSale.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {flashSale.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-white/90 text-gray-800 shadow-sm">
                                        {flashSale.discountValue}{flashSale.discountType === 'percentage' ? '%' : '₹'} OFF
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{flashSale.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 mb-4 line-clamp-2">{flashSale.description}</p>

                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <div className="text-gray-600">
                                            <span className="font-semibold block text-gray-900">Valid Till</span>
                                            {flashSale.endDate ? new Date(flashSale.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </div>
                                        <div className="text-right text-gray-600">
                                            <span className="font-semibold block text-gray-900">Target</span>
                                            <span className="capitalize">{flashSale.target}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => toggleFlashSales(flashSale._id)}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${flashSale.isActive ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                        >
                                            {flashSale.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(flashSale)}
                                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                            title="Edit Campaign"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(flashSale._id)}
                                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                            title="Delete Campaign"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                                <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                                <h3 className="text-lg font-medium text-gray-900">No flash sales found</h3>
                                <p className="text-gray-500 mt-1">Create your first flash sale to boost sales.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Flash Sale" : "Create New Flash Sale"}</h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Flash Sale Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="e.g. Summer Flash Sale 2026"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                                        placeholder="Short description of the flash sale..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Flash Sale Image {editingId ? '(Optional)' : '*'}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImageFile(e.target.files[0]);
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white transition-all"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                            placeholder="e.g. 15"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience / Scope *</label>
                                    <select
                                        value={formData.target}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                target: e.target.value,
                                                targetIds: []
                                            })
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white transition-all"
                                    >
                                        <option value="all">Storewide (All Products)</option>
                                        <option value="category">Specific Categories</option>
                                        <option value="product">Specific Products</option>
                                    </select>
                                </div>

                                {formData.target === "category" && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Categories *</label>
                                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {categories.map((cat: any) => (
                                                <label key={cat._id} className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                                        checked={formData.targetIds.includes(cat._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, targetIds: [...formData.targetIds, cat._id] });
                                                            } else {
                                                                setFormData({ ...formData, targetIds: formData.targetIds.filter(id => id !== cat._id) });
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                                                </label>
                                            ))}
                                            {categories.length === 0 && <p className="text-sm text-gray-500">No categories found.</p>}
                                        </div>
                                    </div>
                                )}

                                {formData.target === "product" && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Products *</label>
                                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {products.map((prod: any) => (
                                                <label key={prod._id} className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                                        checked={formData.targetIds.includes(prod._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, targetIds: [...formData.targetIds, prod._id] });
                                                            } else {
                                                                setFormData({ ...formData, targetIds: formData.targetIds.filter(id => id !== prod._id) });
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        {prod.images?.[0] && <img src={prod.images[0]} alt="" className="w-8 h-8 rounded object-cover" />}
                                                        <span className="text-sm font-medium text-gray-800 line-clamp-1">{prod.title}</span>
                                                    </div>
                                                </label>
                                            ))}
                                            {products.length === 0 && <p className="text-sm text-gray-500">No products found.</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">Flash Sale is Active</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating || (formData.target !== 'all' && formData.targetIds.length === 0)}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {(isCreating || isUpdating) && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                )}
                                {editingId ? "Update Flash Sale" : "Publish Flash Sale"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};