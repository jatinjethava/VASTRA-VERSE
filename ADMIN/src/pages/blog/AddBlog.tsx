import { useState } from "react";
import {
    IoTrash, IoImageOutline, IoDocumentTextOutline, IoSettingsOutline, IoInformationCircleOutline, IoAddOutline, IoCheckmarkCircleOutline, IoSaveOutline,
    IoCloseSharp
} from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useCreateBlog, useUpdateBlogs } from "../../Hooks/blog";
import { toast } from "sonner";
import { BLOG_CATEGORY } from "../../interface/enum";
import '../../index.css'
import { useNavigate, useLocation } from "react-router"
import type { Blogs } from "../../Api/blogApi";

export const AddBlog = () => {

    const { mutateAsync: createBlog, isPending: isCreateBlogPending } = useCreateBlog();
    const { mutateAsync: updateBlog, isPending: isUpdateBlogPending } = useUpdateBlogs();

    const isPending = isCreateBlogPending || isUpdateBlogPending;

    const location = useLocation();
    const blog: Blogs | null = location.state?.blog;
    const isEdit: boolean = location.state?.edit;

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: blog?.title || "",
        description: blog?.description || "",
        subTitle: blog?.subTitle || "",
        subDescription: blog?.subDescription || "",
        featuredImage: null as File | null,
        images: [] as File[],
        content: blog?.content || [""],
        category: blog?.category || "FASHION_TRENDS",
        seoTitle: blog?.seoTitle || "",
        seoDescription: blog?.seoDescription || "",
        seoKeywords: blog?.seoKeywords?.join(", ") || "",
        status: blog?.status || "draft",
    });

    const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(blog?.featuredImage as string || null);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>(blog?.images as string[] || []);

    const addContentSection = () => {
        setFormData((prev) => ({
            ...prev,
            content: [...prev.content, ""],
        }));
    };

    const removeSection = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        if (!files || files.length === 0) return;

        const selectedFiles = Array.from(files);

        if (name === "featuredImage") {
            const file = selectedFiles[0];
            const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

            if (!validImageTypes.includes(file.type)) {
                toast.error("Invalid file type!", { duration: 1500 });
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds 10MB", { duration: 1500 });
                return;
            }
            setFormData((prev) => ({ ...prev, featuredImage: file }));
            setFeaturedImagePreview(URL.createObjectURL(file));
        } else if (name === "images") {
            const validImages = selectedFiles.filter((f) => {
                const isValidType = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type);
                const isValidSize = f.size <= 10 * 1024 * 1024;
                return isValidType && isValidSize;
            });

            const invalidImages = selectedFiles.filter(
                (f) => !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type) || f.size > 10 * 1024 * 1024
            );

            invalidImages.forEach((img) => {
                toast.error(`${img.name} is invalid (type or size)`, { duration: 1500 });
            });

            const newPreviews = validImages.map((file) => URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
            setGalleryImagePreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }

    const removeFeaturedImage = () => {
        setFormData((prev) => ({
            ...prev,
            featuredImage: null
        }));
        setFeaturedImagePreview(null);
    }

    const handleContentChange = (index: number, value: string) => {
        const updated = [...formData.content];
        updated[index] = value;
        setFormData({ ...formData, content: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please enter a blog title", { duration: 1500 });
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Please enter a blog description", { duration: 1500 });
            return;
        }

        const validParagraphs = formData.content.filter(p => p.trim() !== "");
        if (validParagraphs.length < 2) {
            toast.error("Please add at least two non-empty paragraphs", { duration: 1500 });
            return;
        }

        if (!isEdit && !formData.featuredImage) {
            toast.error("Please add a Featured Image", { duration: 1500 });
            return;
        }

        if (!isEdit && formData.images.length < 2) {
            toast.error("Please add at least two gallery images", { duration: 1500 });
            return;
        }

        const formDataToSend = new FormData();

        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("subTitle", formData.subTitle);
        formDataToSend.append("subDescription", formData.subDescription);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("seoTitle", formData.seoTitle);
        formDataToSend.append("seoDescription", formData.seoDescription);
        formDataToSend.append("status", formData.status);

        formData.content.forEach((paragraph) => {
            formDataToSend.append("content", paragraph);
        });

        const keywords = formData.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k);

        keywords.forEach((keyword) => {
            formDataToSend.append("seoKeywords", keyword);
        });

        if (formData.featuredImage) {
            formDataToSend.append("featuredImage", formData.featuredImage);
        }

        formData.images.forEach((image) => {
            formDataToSend.append("images", image);
        });

        if (isEdit && blog?._id) {
            await updateBlog({ id: blog._id, data: formDataToSend });
        } else {
            await createBlog(formDataToSend);
        }

        setFormData({
            title: "",
            description: "",
            subTitle: "",
            subDescription: "",
            featuredImage: null as File | null,
            images: [] as File[],
            content: [""],
            category: "FASHION_TRENDS",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            status: "draft",
        });
        setFeaturedImagePreview(null);
        setGalleryImagePreviews([]);
        navigate("/admin/blogs");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="relative max-w-7xl mx-auto space-y-6">

                {isPending && (
                    <div className="absolute top-40 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {isEdit ? "Update Blog Post" : "Create Blog Post"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {isEdit ? "Update the details below to save changes." : "Fill in the details below to publish a new article."}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/blogs")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
                    >
                        <IoIosArrowBack /> Go Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                <IoInformationCircleOutline className="text-xl text-blue-600" />
                                <h2 className="text-lg font-semibold">General Information</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., 10 Summer Fashion Trends"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        name="subTitle"
                                        value={formData.subTitle}
                                        onChange={handleChange}
                                        placeholder="A catchy secondary title..."
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white"
                                        >
                                            {Object.values(BLOG_CATEGORY).map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                <IoDocumentTextOutline className="text-xl text-blue-600" />
                                <h2 className="text-lg font-semibold">Content Details</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief overview of the blog..."
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Description</label>
                                    <textarea
                                        name="subDescription"
                                        value={formData.subDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Additional context or summary..."
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Paragraphs</label>
                                    <div className="space-y-4">
                                        {formData.content.map((item, index) => (
                                            <div key={index} className="relative group">
                                                <textarea
                                                    value={item}
                                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                                    rows={4}
                                                    placeholder={`Paragraph ${index + 1}...`}
                                                    className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-y placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(index)}
                                                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-200 shadow-sm cursor-pointer opacity-0 group-hover:opacity-100"
                                                    title="Remove paragraph"
                                                >
                                                    <IoTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addContentSection}
                                        className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors w-fit"
                                    >
                                        <IoAddOutline className="text-lg" />
                                        Add Paragraph
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                <IoImageOutline className="text-xl text-purple-600" />
                                <h2 className="text-lg font-semibold">Media</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                                        <input
                                            type="file"
                                            name="featuredImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                        />

                                        {featuredImagePreview && (
                                            <div className="mt-4 relative group/image w-max mx-auto">
                                                <img src={featuredImagePreview} alt="Featured Preview" className="h-32 w-32 rounded-lg object-cover shadow-md" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFeaturedImage(); }}
                                                        className="text-white font-bold text-lg bg-red-500/90 px-2 py-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                                                    >
                                                        <IoCloseSharp size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                                        <input
                                            type="file"
                                            name="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer mb-4"
                                        />

                                        <div className="text-center w-full flex flex-col items-center z-20">
                                            {galleryImagePreviews.length > 0 ? (
                                                <div className="flex flex-wrap gap-4 justify-center mb-4">
                                                    {galleryImagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group/image">
                                                            <img src={preview} alt={`Gallery Preview ${index}`} className="h-32 w-32 rounded-lg object-cover shadow-md" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeGalleryImage(index); }}
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

                                            <div className="mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                                <p className="text-xs leading-5 text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                <IoSettingsOutline className="text-xl text-orange-500" />
                                <h2 className="text-lg font-semibold">Search Engine</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        placeholder="Title for search engines..."
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                                    <textarea
                                        name="seoDescription"
                                        value={formData.seoDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Meta description..."
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm resize-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                                    <input
                                        type="text"
                                        name="seoKeywords"
                                        value={formData.seoKeywords}
                                        onChange={handleChange}
                                        placeholder="oversized, streetwear, fashion"
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                <IoCheckmarkCircleOutline className="text-xl text-green-600" />
                                <h2 className="text-lg font-semibold">Publish</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-gray-50/50"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition-all shadow-md shadow-gray-900/10 active:scale-[0.98]"
                                >
                                    <IoSaveOutline className="text-lg" />
                                    {isEdit ? "Update Blog Post" : "Save Blog Post"}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}