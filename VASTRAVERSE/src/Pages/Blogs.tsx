import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetchBlogs } from "../Hooks/blog";
import { useViewBlog } from "../Hooks/blog";
import type { IBlog } from "../Api/blogApi";
import { isAuthenticated } from "../Utils/auth";

const BlogCard = ({ blog }: { blog: IBlog }) => {
    const navigate = useNavigate();
    const { mutate: viewBlog } = useViewBlog();

    const handleRead = () => {
        if (isAuthenticated()) viewBlog(blog._id);
        navigate(`/blogs/detail?id=${blog._id}`, { state: { blog } });
    };

    return (
        <article
            onClick={handleRead}
            className="group cursor-pointer flex flex-col gap-4"
        >
            <div className="overflow-hidden bg-[#f9f9f9] aspect-[3/2] w-full relative">
                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="space-y-2 px-1">
                {blog.category && (
                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500">
                        {blog.category}
                    </span>
                )}
                <h2 className="font-medium text-black line-clamp-2 text-lg leading-snug group-hover:text-gray-600 transition-colors">
                    {blog.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 font-light">
                    {blog.description}
                </p>
                <div className="flex items-center gap-3 pt-2">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-black font-medium">
                        {blog.author}
                    </span>
                    <span className="text-[10px] text-gray-400">|</span>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                </div>
            </div>
        </article>
    );
};

export const Blogs = () => {
    const { data: blogsData, isLoading, isError } = useFetchBlogs();
    const [search, setSearch] = useState("");

    const blogs = (blogsData?.data?.blog ?? []).filter((b: IBlog) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        (b.category ?? "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen">

            <div className="border-b border-gray-100 pt-10 sm:pt-14 pb-10 px-6 lg:px-0">
                <div className="max-w-6xl mx-auto">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] block mb-3">
                        Vastra Verse
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            The Journal
                        </h1>
                        <div className="shrink-0">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-all duration-200 font-medium"
                                style={{ borderRadius: 0 }}
                            />
                        </div>
                    </div>
                    <div className="w-12 h-[2px] bg-gray-900 mt-5" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-0 py-12 sm:py-16">

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i}>
                                <div className="aspect-[4/3] bg-gray-100 mb-5" />
                                <div className="space-y-3">
                                    <div className="h-3 bg-gray-100 w-1/4" />
                                    <div className="h-5 bg-gray-100 w-3/4" />
                                    <div className="h-4 bg-gray-100 w-full" />
                                    <div className="h-4 bg-gray-100 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="py-24 text-center border border-dashed border-gray-200">
                        <p className="text-[11px] uppercase tracking-widest font-bold text-gray-300">
                            Failed to load articles
                        </p>
                    </div>
                )}

                {!isLoading && !isError && blogs.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-gray-200">
                        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center border border-gray-200">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-gray-300">
                            {search ? "No articles match your search" : "No articles published yet"}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && blogs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
                        {blogs.map((blog: IBlog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};