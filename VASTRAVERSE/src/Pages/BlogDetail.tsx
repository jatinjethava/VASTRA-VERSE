import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useFetchBlogs } from "../Hooks/blog";
import type { IBlog } from "../Api/blogApi";

export const BlogDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const blogIdFromQuery = searchParams.get("id");

    const { data: blogsData, isLoading } = useFetchBlogs();
    const allBlogs: IBlog[] = blogsData?.data?.blog || [];

    const [imageIndex, setImageIndex] = useState<number>(0);

    const stateBlog = location.state?.blog as IBlog | undefined;

    const [blog, setBlog] = useState<IBlog | null>(() => {
        if (stateBlog) {
            try {
                sessionStorage.setItem("active_blog", JSON.stringify(stateBlog));
            } catch (e) { }
            return stateBlog;
        }
        try {
            const saved = sessionStorage.getItem("active_blog");
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return null;
    });

    useEffect(() => {
        if (stateBlog) {
            setBlog(stateBlog);
            try {
                sessionStorage.setItem("active_blog", JSON.stringify(stateBlog));
            } catch (e) { }
        }
    }, [stateBlog]);

    useEffect(() => {
        if (allBlogs.length > 0) {
            if (blogIdFromQuery) {
                const found = allBlogs.find((b: IBlog) => b._id === blogIdFromQuery);
                if (found) {
                    setBlog(found);
                    try {
                        sessionStorage.setItem("active_blog", JSON.stringify(found));
                    } catch (e) { }
                    return;
                }
            }

            if (blog?._id) {
                const updated = allBlogs.find((b: IBlog) => b._id === blog._id);
                if (updated) {
                    const hasMoreContent = (!blog.content || (Array.isArray(blog.content) && blog.content.length === 0)) && (updated.content && updated.content.length > 0);
                    if (hasMoreContent || !blog.description) {
                        setBlog(updated);
                        try {
                            sessionStorage.setItem("active_blog", JSON.stringify(updated));
                        } catch (e) { }
                    }
                }
            } else if (!blog) {
                const defaultBlog = allBlogs[0];
                if (defaultBlog) {
                    setBlog(defaultBlog);
                    try {
                        sessionStorage.setItem("active_blog", JSON.stringify(defaultBlog));
                    } catch (e) { }
                }
            }
        }
    }, [allBlogs, blog, blogIdFromQuery]);

    if (isLoading && !blog) {
        return (
            <div className="min-h-screen max-w-5xl mx-auto px-6 py-20 animate-pulse">
                <div className="h-4 bg-gray-100 w-24 mx-auto mb-6" />
                <div className="h-10 bg-gray-100 w-3/4 mx-auto mb-4" />
                <div className="h-4 bg-gray-100 w-1/2 mx-auto mb-12" />
                <div className="aspect-[21/9] bg-gray-100 w-full mb-12" />
                <div className="space-y-4">
                    <div className="h-4 bg-gray-100 w-full" />
                    <div className="h-4 bg-gray-100 w-5/6" />
                    <div className="h-4 bg-gray-100 w-4/6" />
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen pb-24 bg-white selection:bg-black selection:text-white">

            <div className="w-full px-6 lg:px-12 pt-12 pb-16">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                    <button
                        onClick={() => navigate("/blogs")}
                        className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 hover:text-black transition-colors duration-300 mb-12 sm:mb-16"
                    >
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        Back to Journal
                    </button>

                    {blog.category && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 mb-6">
                            {blog.category}
                        </span>
                    )}

                    <h1 className="editorial-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black leading-[1.1] mb-8 max-w-5xl tracking-tight">
                        {blog.title}
                    </h1>

                    {blog.description && (
                        <p className="text-lg sm:text-xl text-gray-500 font-light max-w-3xl mb-10 leading-relaxed">
                            {blog.description}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                        <span className="text-black">{blog.author}</span>
                        <span className="w-[1px] h-3 bg-gray-300" />
                        <span>
                            {blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                                : "January 15, 2024"}
                        </span>
                        {blog.views !== undefined && (
                            <>
                                <span className="w-[1px] h-3 bg-gray-300" />
                                <span>{blog.views} Views</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full px-6 lg:px-12 mb-16 sm:mb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="w-full aspect-[4/3] sm:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden bg-gray-100">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">

                <div className="flex-1 lg:max-w-3xl">
                    {blog.subTitle && (
                        <h2 className="editorial-text text-2xl sm:text-3xl lg:text-4xl font-light text-black leading-snug mb-10">
                            {blog.subTitle}
                        </h2>
                    )}

                    {blog.subDescription && (
                        <p className="text-base sm:text-lg text-gray-600 leading-[1.8] mb-12 font-light">
                            {blog.subDescription}
                        </p>
                    )}

                    <div className="max-w-none text-gray-700 font-light">
                        {Array.isArray(blog.content) && blog.content.length > 0 ? (
                            blog.content.map((paragraph: string, index: number) => (
                                <p key={index} className={`leading-[1.9] mb-8 ${index === 0 ? "first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:font-light first-letter:text-black first-letter:leading-[0.8]" : ""}`}>
                                    {paragraph}
                                </p>
                            ))
                        ) : typeof blog.content === 'string' ? (
                            <p className="leading-[1.9] mb-8 first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:font-light first-letter:text-black first-letter:leading-[0.8]">
                                {blog.content}
                            </p>
                        ) : (
                            <p className="leading-[1.9] mb-8 first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:font-light first-letter:text-black first-letter:leading-[0.8]">
                                This article contains detailed information about fashion, style, and more. Exclusively curated for those with an eye for premium aesthetics.
                            </p>
                        )}
                    </div>
                </div>

                {blog.images && blog.images.length > 0 && (
                    <div className="lg:w-[320px] xl:w-[400px] shrink-0">
                        <div className="sticky top-32">
                            <div className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-400 mb-6 border-b border-gray-100 pb-3">
                                Gallery
                            </div>
                            <div className="overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                                <img
                                    src={blog.images[imageIndex]}
                                    alt={`${blog.title} — image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                            </div>
                            {blog.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {blog.images.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setImageIndex(i)}
                                            className={`aspect-[3/4] overflow-hidden transition-all duration-300 cursor-pointer ${imageIndex === i ? "opacity-100 ring-1 ring-black ring-offset-2" : "opacity-40 hover:opacity-100"}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 sm:mt-32">
                <div className="border-t border-black flex flex-col sm:flex-row items-center justify-between py-12 gap-8">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 mb-2">Written By</p>
                        <p className="editorial-text text-2xl text-black">{blog.author}</p>
                    </div>

                    <button
                        onClick={() => navigate("/blogs")}
                        className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-black cursor-pointer"
                    >
                        Explore Journal
                        <span className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
