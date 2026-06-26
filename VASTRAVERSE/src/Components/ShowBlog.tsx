import { IoCloseSharp } from "react-icons/io5";
import type { IBlog } from "../Api/blogApi";
import '../index.css'

export const ShowBlog = ({ blog, setShowBlog }: { blog: IBlog; setShowBlog: (show: boolean) => void }) => {
    return (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6 lg:p-8">

            <div className="animate-fade-in-up-delay-1 relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <button
                    onClick={() => setShowBlog(false)}
                    className="absolute right-3 top-3 z-50 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-black backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105"
                    aria-label="Close modal"
                >
                    <IoCloseSharp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>

                <div className="overflow-y-auto flex-1 no-scrollbar">
                    <div className="relative h-[40vh] w-full shrink-0 sm:h-[50vh]">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute top-4 left-4 z-10">
                            {blog?.status === "published" ? (
                                <span className="rounded-full bg-green-500/30 px-3 py-2 text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-green-500/50 uppercase tracking-wider">
                                    Approved
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-500/30 px-3 py-2 text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-red-500/50 uppercase tracking-wider">
                                    Not Approved
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-indigo-100 backdrop-blur-md ring-1 ring-indigo-500/50 uppercase tracking-wider">
                                    {blog.category}
                                </span>
                                <span className="text-[8px] sm:text-[10px] md:text-[11px] font-medium text-gray-300">
                                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'Recently'}
                                </span>
                            </div>
                            <h1 className="mb-2 text-[18px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white break-words">
                                {blog.title}
                            </h1>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-gray-300">
                                By <span className="text-white">{blog.author}</span>
                            </p>
                        </div>
                    </div>


                    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-16">
                        {blog.subTitle && (
                            <div className="mb-10 border-l-2 sm:border-l-4 border-indigo-500 pl-4 sm:pl-6">
                                <h2 className="mb-2 text-[15px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                                    {blog.subTitle}
                                </h2>
                                {blog.subDescription && (
                                    <p className="text-[12px] sm:text-[13px] md:text-base font-medium text-gray-600">
                                        {blog.subDescription}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mb-16 text-gray-700">
                            {blog.content.map((paragraph, index) => (
                                <p key={index} className="mb-4 text-[12px] sm:text-[13px] md:text-base font-medium text-gray-600">
                                    {paragraph}
                                </p>
                            ))}
                        </div>


                        {blog.images && blog.images.length > 0 && (
                            <div className="mt-12 border-t border-gray-100 pt-10">
                                <h3 className="mb-6 text-[15px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">Gallery</h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {blog.images.map((image, index) => (
                                        <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                                            <img
                                                src={image}
                                                alt={`Gallery image ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 border-t border-gray-100 pt-8 sm:mt-10 sm:pt-10">
                            <h1 className="text-[12px] sm:text-xl font-semibold text-gray-900">Seo title</h1>
                            <p className="text-gray-600 px-3 py-2 rounded-md mt-2 bg-gray-50 text-[12px] sm:text-[13px] md:text-[14px] font-medium">{blog.seoTitle}</p>

                            <h1 className="text-[12px] sm:text-xl font-semibold text-gray-900 mt-5 sm:mt-6">Seo description</h1>
                            <p className="text-gray-600 px-3 py-2 rounded-md mt-2 bg-gray-50 text-[12px] sm:text-[13px] md:text-[14px] font-medium">{blog.seoDescription}</p>

                            <h1 className="text-[12px] sm:text-xl font-semibold text-gray-900 mt-5 sm:mt-6">Seo keywords</h1>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {blog.seoKeywords?.map((keyword, index) => (
                                    <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-[10px] sm:text-[13px] md:text-[14px] font-medium text-gray-700">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};