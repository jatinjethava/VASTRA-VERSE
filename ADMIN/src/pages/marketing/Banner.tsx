import { useState } from "react";
import { PlusCircle, Edit, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { useFetchAllBanner, useCreateBanner, useUpdateBanner, useDeleteBanner } from "../../Hooks/marketing";
import { toast } from "sonner";

export const Banner = () => {
    const { data: bannersResponse, isLoading: bannersLoading, isError: bannersIsError } = useFetchAllBanner();
    const banners = bannersResponse || [];

    const { mutateAsync: createBanner, isPending: isCreating } = useCreateBanner();
    const { mutateAsync: updateBanner, isPending: isUpdating } = useUpdateBanner();
    const { mutateAsync: deleteBanner } = useDeleteBanner();
    const isPending = isCreating || isUpdating;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        bgImage: ""
    });
    const [bgImageFile, setBgImageFile] = useState<File | null>(null);
    const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            bgImage: "",
        });
        setBgImageFile(null);
        setBgImagePreview(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (banner: any) => {
        setFormData({
            title: banner.title || "",
            description: banner.description || "",
            bgImage: banner.bgImage || "",
        });
        setBgImagePreview(banner.bgImage ? `${banner.bgImage}` : null);
        setEditingId(banner._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            await deleteBanner(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!editingId && !bgImageFile)) {
            toast.error("Please upload images for the banner.");
            return;
        }

        const payload = new FormData();
        payload.append("title", formData.title);
        payload.append("description", formData.description);

        if (bgImageFile) {
            payload.append("bgImage", bgImageFile);
        }

        try {
            if (editingId) {
                await updateBanner({ id: editingId, data: payload as any });
            } else {
                await createBanner(payload as any);
            }
            resetForm();
        } catch (error) {
            console.error("Error submitting banner", error);
        }
    };

    if (bannersLoading) {
        return <div className="flex h-[55vh] items-center justify-center">
            <div className="dot-spinner">
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div><div className="dot-spinner__dot"></div>
            </div>
        </div>
    }

    if (bannersIsError) {
        return <div>Error while fetching banners...</div>
    }

    return (
        <div className="mt-6 animate-fade-in-up">
            {!isFormOpen ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Banners</h2>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={20} />
                            Create Banner
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners && banners.length > 0 ? banners.map((banner: any) => (
                            <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                <div className="h-52 relative flex items-center justify-center overflow-hidden">
                                    {banner.bgImage ? (
                                        <img src={`${banner.bgImage}`} alt="Background" className="w-full h-full object-cover absolute top-0 left-0" />
                                    ) : (
                                        <div className="w-full h-full  opacity-50 absolute top-0 left-0"></div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{banner.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{banner.description}</p>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
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
                                <h3 className="text-lg font-medium text-gray-900">No banners found</h3>
                                <p className="text-gray-500 mt-1">Create your first banner to display on the storefront.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Banner" : "Create New Banner"}</h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                        placeholder="e.g. Summer Collection"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                                        placeholder="Short description for the banner..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Image {editingId ? '(Optional)' : '*'}</label>
                                    {bgImagePreview && (
                                        <div className="mb-2 h-20 w-full rounded-md overflow-hidden bg-gray-100">
                                            <img src={bgImagePreview} alt="Bg Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setBgImageFile(e.target.files[0]);
                                                setBgImagePreview(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 outline-none"
                                    />
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
                                disabled={isPending}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isPending && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                )}
                                {editingId ? "Update Banner" : "Publish Banner"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};