import { useState } from "react";
import { useFetchAllCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, useToggleCampaign } from "../../Hooks/marketing";
import { useGetCategories } from "../../Hooks/category";
import { useGetProducts } from "../../Hooks/product";
import { PlusCircle, Trash2, Edit, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const Campaign = () => {
    const { data: campaignsResponse, isLoading: campaignsLoading } = useFetchAllCampaigns();
    const campaigns = campaignsResponse || campaignsResponse || [];
    console.log(campaigns)

    const { data: categoriesData } = useGetCategories();
    const categories = categoriesData || [];

    const { data: productsData } = useGetProducts();
    const products = productsData?.products || [];

    const { mutateAsync: createCampaign, isPending: isCreating } = useCreateCampaign();
    const { mutateAsync: updateCampaign, isPending: isUpdating } = useUpdateCampaign();
    const { mutateAsync: deleteCampaign } = useDeleteCampaign();
    const { mutateAsync: toggleCampaign } = useToggleCampaign();

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

    const handleEdit = (campaign: any) => {
        setFormData({
            name: campaign.name || "",
            description: campaign.description || "",
            discountType: campaign.discountType || "percentage",
            discountValue: campaign.discountValue || "",
            target: campaign.target || "all",
            targetIds: campaign.targetIds || [],
            startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
            endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
            isActive: campaign.isActive ?? true,
        });
        setEditingId(campaign._id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingId && !imageFile) {
            toast.error("Please upload an image for the campaign.");
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
                await updateCampaign({ id: editingId, data: payload as any });
            } else {
                await createCampaign(payload as any);
            }
            resetForm();
        } catch (error) {
            console.error("Error submitting campaign", error);
        }
    };

    if (campaignsLoading) {
        return (
            <div className="flex h-[55vh] items-center justify-center">
                <div className="dot-spinner">
                    <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 animate-fade-in-up">
            {!isFormOpen ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Campaigns</h2>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={20} />
                            Create Campaign
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.length > 0 ? campaigns.map((campaign: any) => (
                            <div key={campaign._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden relative bg-gray-100">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold ${campaign.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {campaign.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-white/90 text-gray-800 shadow-sm">
                                        {campaign.discountValue}{campaign.discountType === 'percentage' ? '%' : '₹'} OFF
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{campaign.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{campaign.description || 'No description provided.'}</p>

                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <div className="text-gray-600">
                                            <span className="font-semibold block text-gray-900">Valid Till</span>
                                            {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </div>
                                        <div className="text-right text-gray-600">
                                            <span className="font-semibold block text-gray-900">Target</span>
                                            <span className="capitalize">{campaign.target}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => toggleCampaign(campaign._id)}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${campaign.isActive ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                        >
                                            {campaign.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(campaign)}
                                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this campaign?')) {
                                                    deleteCampaign(campaign._id);
                                                }
                                            }}
                                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                                <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                                <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
                                <p className="text-gray-500 mt-1">Create your first marketing campaign to boost sales.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Campaign" : "Create New Campaign"}</h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="e.g. Summer Sale 2026"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                                        placeholder="Short description of the campaign..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image {editingId ? '(Optional)' : '*'}</label>
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
                                        <span className="ml-3 text-sm font-medium text-gray-700">Campaign is Active</span>
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
                                {editingId ? "Update Campaign" : "Publish Campaign"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};