import { useState } from "react";
import {
    IoTrash, IoImageOutline, IoDocumentTextOutline, IoSettingsOutline, IoInformationCircleOutline, IoAddOutline, IoCheckmarkCircleOutline, IoSaveOutline,
    IoCloseSharp
} from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useCreateBlog, useUpdateBlogs } from "../Hooks/blog";
import { toast } from "sonner";
import { BLOG_CATEGORY } from "../interface/enum";
import '../index.css'
import { useNavigate, useLocation } from "react-router"
import type { IBlog } from "../Api/blogApi";

export const AddBlog = () => {

    const { mutateAsync: createBlog, isPending: isCreateBlogPending } = useCreateBlog();
    const { mutateAsync: updateBlog, isPending: isUpdateBlogPending } = useUpdateBlogs();

    const isPending = isCreateBlogPending || isUpdateBlogPending;

    const location = useLocation();
    const blog: IBlog | null = location.state?.blog;
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
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 md:p-10">
            <div className="relative max-w-7xl mx-auto space-y-6 sm:space-y-8">

                {isPending && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl">
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

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                            Gazette Editorial Studio
                        </span>
                        <h1 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                            {isEdit ? "Update Article" : "Draft Editorial"} <span className="italic font-serif font-normal">Chronicle</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
                            {isEdit ? "Refine dispatch details and typography to update the archive." : "Compose thoughtful articles, style chronicles, and sartorial dispatches."}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 px-5 py-2.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black rounded-full transition text-xs uppercase tracking-wider font-semibold cursor-pointer bg-white"
                    >
                        <IoIosArrowBack /> Return to Profile
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                            <div className="flex items-center gap-2.5 mb-6 text-neutral-900">
                                <IoInformationCircleOutline className="text-xl text-neutral-900" />
                                <h2 className="editorial-text text-lg font-light text-neutral-900">Editorial Metadata</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Article Headline</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., The Architecture of Minimalist Silhouettes"
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Deck / Subtitle</label>
                                    <input
                                        type="text"
                                        name="subTitle"
                                        value={formData.subTitle}
                                        onChange={handleChange}
                                        placeholder="An incisive inquiry into modern luxury tailoring..."
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Curatorial Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm font-medium text-neutral-900 cursor-pointer"
                                        >
                                            {Object.values(BLOG_CATEGORY).map((category) => (
                                                <option key={category} value={category}>
                                                    {category.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                            <div className="flex items-center gap-2.5 mb-6 text-neutral-900">
                                <IoDocumentTextOutline className="text-xl text-neutral-900" />
                                <h2 className="editorial-text text-lg font-light text-neutral-900">Manuscript & Content</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Lead Abstract</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Concise overview or editorial prelude..."
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm resize-none placeholder:text-neutral-400 font-normal leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Contextual Synopsis</label>
                                    <textarea
                                        name="subDescription"
                                        value={formData.subDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Elaborated preamble or patron context..."
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm resize-none placeholder:text-neutral-400 font-normal leading-relaxed"
                                    />
                                </div>

                                <div className="pt-4 border-t border-neutral-100">
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-3">Manuscript Paragraphs</label>
                                    <div className="space-y-4">
                                        {formData.content.map((item, index) => (
                                            <div key={index} className="relative group">
                                                <textarea
                                                    value={item}
                                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                                    rows={4}
                                                    placeholder={`Paragraph ${index + 1}...`}
                                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition resize-y placeholder:text-neutral-400 font-light leading-relaxed text-xs sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(index)}
                                                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-400 hover:text-black hover:border-black transition-all shadow-sm cursor-pointer"
                                                    title="Remove paragraph"
                                                >
                                                    <IoTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addContentSection}
                                        className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-medium rounded-full transition cursor-pointer shadow-sm"
                                    >
                                        <IoAddOutline className="text-base" />
                                        Add Paragraph
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="relative bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                            <div className="flex items-center gap-2 mb-5 text-neutral-900">
                                <IoImageOutline className="text-xl text-neutral-900" />
                                <h2 className="editorial-text text-lg font-light text-neutral-900">Visual Archives</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2">Primary Cover Artwork</label>
                                    <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 text-center hover:bg-neutral-50/50 transition-colors">
                                        <input
                                            type="file"
                                            name="featuredImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                                        />

                                        {featuredImagePreview && (
                                            <div className="mt-4 relative group/image w-max mx-auto">
                                                <img src={featuredImagePreview} alt="Featured Preview" className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover shadow-md border border-neutral-200" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFeaturedImage(); }}
                                                        className="text-white bg-black/80 p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
                                                    >
                                                        <IoCloseSharp size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-2">Editorial Plates (Gallery)</label>
                                    <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 text-center hover:bg-neutral-50/50 transition-colors">
                                        <input
                                            type="file"
                                            name="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer mb-3"
                                        />

                                        <div className="text-center w-full flex flex-col items-center">
                                            {galleryImagePreviews.length > 0 ? (
                                                <div className="flex flex-wrap gap-2.5 justify-center mb-3">
                                                    {galleryImagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group/image">
                                                            <img src={preview} alt={`Gallery Preview ${index}`} className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover shadow-sm border border-neutral-200" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeGalleryImage(index); }}
                                                                    className="text-white bg-black/80 p-1.5 rounded-full hover:scale-110 transition cursor-pointer"
                                                                >
                                                                    <IoCloseSharp size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider py-2">PNG, JPG, WEBP up to 10MB</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                            <div className="flex items-center gap-2 mb-5 text-neutral-900">
                                <IoSettingsOutline className="text-xl text-neutral-900" />
                                <h2 className="editorial-text text-lg font-light text-neutral-900">Search Indexing</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Meta Headline</label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        placeholder="Search engine index title..."
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Meta Description</label>
                                    <textarea
                                        name="seoDescription"
                                        value={formData.seoDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Search snippet summary..."
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm resize-none placeholder:text-neutral-400 font-normal leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Keywords</label>
                                    <input
                                        type="text"
                                        name="seoKeywords"
                                        value={formData.seoKeywords}
                                        onChange={handleChange}
                                        placeholder="haute couture, bespoke, minimalism"
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                            <div className="flex items-center gap-2 mb-5 text-neutral-900">
                                <IoCheckmarkCircleOutline className="text-xl text-neutral-900" />
                                <h2 className="editorial-text text-lg font-light text-neutral-900">Publication State</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl focus:bg-white focus:border-black outline-none transition text-xs sm:text-sm font-medium text-neutral-900 cursor-pointer"
                                    >
                                        <option value="draft">Atelier Draft</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-full transition shadow-md cursor-pointer"
                                >
                                    <IoSaveOutline className="text-base" />
                                    {isEdit ? "Update Editorial Article" : "Save Article Dossier"}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}