import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const BlogDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const blog = location.state?.blog;

    const [imageIndex, setImageIndex] = useState<number>(0);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
                <div className="w-10 h-10 border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                    </svg>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">Article not found</p>
                <button
                    onClick={() => navigate("/blogs")}
                    className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 border border-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer"
                    style={{ borderRadius: 0 }}
                >
                    Browse All Articles
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">

            <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <button
                    onClick={() => navigate("/blogs")}
                    className="absolute top-5 left-5 sm:top-8 sm:left-8 z-10 flex items-center gap-2 text-white text-[11px] uppercase tracking-[0.18em] font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 hover:bg-white hover:text-gray-900 transition-all duration-200 cursor-pointer"
                    style={{ borderRadius: 0 }}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    All Articles
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
                    <div className="max-w-4xl">
                        {blog.category && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-3">
                                {blog.category}
                            </span>
                        )}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mb-4 max-w-3xl">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-white/50 font-semibold">
                            <span>{blog.author}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
                            <span>
                                {blog.createdAt
                                    ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                                    : "January 15, 2024"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-0 mt-12 sm:mt-16">

                {blog.subTitle && (
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 leading-relaxed border-l-2 border-gray-900 pl-6 mb-10 sm:mb-14">
                        {blog.subTitle}
                    </p>
                )}

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    <div className="flex-1 min-w-0">
                        {blog.subDescription && (
                            <p className="text-base text-gray-600 leading-relaxed mb-8">
                                {blog.subDescription}
                            </p>
                        )}

                        {blog.content?.map((paragraph: string, index: number) => (
                            <p key={index} className="text-base text-gray-600 leading-relaxed mb-6">
                                {paragraph}
                            </p>
                        ))}

                        {!blog.content && (
                            <p className="text-base text-gray-500 leading-relaxed">
                                This article contains detailed information about fashion, style, and more.
                            </p>
                        )}
                    </div>

                    {blog.images && blog.images.length > 0 && (
                        <div className="lg:w-72 xl:w-80 shrink-0 w-full">
                            <div className="overflow-hidden aspect-[3/4] mb-4">
                                <img
                                    src={blog.images[imageIndex]}
                                    alt={`${blog.title} — image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            </div>
                            {blog.images.length > 1 && (
                                <div className="flex gap-2 flex-wrap">
                                    {blog.images.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setImageIndex(i)}
                                            className={`w-14 h-14 overflow-hidden border-2 transition-all duration-200 cursor-pointer ${imageIndex === i ? "border-gray-900" : "border-transparent opacity-50 hover:opacity-80"}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-14 sm:mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">Written by</p>
                        <p className="text-base font-black text-gray-900 tracking-tight mt-0.5">{blog.author}</p>
                    </div>
                    <button
                        onClick={() => navigate("/blogs")}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 border border-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer"
                        style={{ borderRadius: 0 }}
                    >
                        More Articles
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
