import { IoCloseSharp } from "react-icons/io5";
import type { IBlog } from "../Api/blogApi";
import '../index.css'

export const ShowBlog = ({ blog, setShowBlog }: { blog: IBlog; setShowBlog: (show: boolean) => void }) => {
    return (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6 lg:p-8">

            <div className="animate-fade-in-up-delay-1 relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-none bg-white shadow-none ring-1 ring-black/5">
                <button
                    onClick={() => setShowBlog(false)}
                    className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-none bg-white border border-black text-black transition-all hover:bg-black hover:text-white cursor-pointer"
                    aria-label="Close modal"
                >
                    <IoCloseSharp className="h-5 w-5" />
                </button>

                <div className="overflow-y-auto flex-1 no-scrollbar">
                    <div className="relative h-[40vh] w-full shrink-0 sm:h-[50vh]">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute top-5 left-5 z-10">
                            {blog?.status === "published" ? (
                                <span className="rounded-none bg-black/90 px-3 py-1.5 text-[9px] font-bold text-white border border-black uppercase tracking-widest backdrop-blur-md">
                                    Approved
                                </span>
                            ) : (
                                <span className="rounded-none bg-white/90 px-3 py-1.5 text-[9px] font-bold text-black border border-white uppercase tracking-widest backdrop-blur-md">
                                    Not Approved
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="rounded-none border border-white/40 bg-black/20 px-3 py-1.5 text-[9px] font-bold text-white backdrop-blur-md uppercase tracking-[0.15em]">
                                    {blog.category}
                                </span>
                                <span className="text-[9px] tracking-widest uppercase font-bold text-neutral-300">
                                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'Recently'}
                                </span>
                            </div>
                            <h1 className="mb-2 text-[18px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-tight text-white editorial-text break-words">
                                {blog.title}
                            </h1>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-neutral-300 uppercase tracking-widest">
                                By <span className="text-white font-bold">{blog.author}</span>
                            </p>
                        </div>
                    </div>


                    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-16">
                        {blog.subTitle && (
                            <div className="mb-10 border-l-2 sm:border-l-4 border-black pl-4 sm:pl-6">
                                <h2 className="mb-2 text-[15px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-black editorial-text">
                                    {blog.subTitle}
                                </h2>
                                {blog.subDescription && (
                                    <p className="text-[12px] sm:text-[13px] md:text-base font-light text-neutral-600">
                                        {blog.subDescription}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mb-16 text-neutral-700">
                            {blog.content.map((paragraph, index) => (
                                <p key={index} className="mb-4 text-[12px] sm:text-[13px] md:text-base font-light text-neutral-600">
                                    {paragraph}
                                </p>
                            ))}
                        </div>


                        {blog.images && blog.images.length > 0 && (
                            <div className="mt-12 border-t border-neutral-200 pt-10">
                                <h3 className="mb-6 text-[15px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-black editorial-text">Gallery</h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {blog.images.map((image, index) => (
                                        <div key={index} className="group relative aspect-square overflow-hidden rounded-none bg-neutral-100 border border-neutral-200">
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

                        <div className="mt-8 border-t border-neutral-200 pt-8 sm:mt-10 sm:pt-10">
                            <h1 className="text-[10px] uppercase tracking-widest font-bold text-black">SEO Title</h1>
                            <p className="text-neutral-600 px-4 py-3 rounded-none border border-neutral-200 mt-2 bg-neutral-50 text-[12px] sm:text-[13px] md:text-[14px] font-medium">{blog.seoTitle}</p>

                            <h1 className="text-[10px] uppercase tracking-widest font-bold text-black mt-5 sm:mt-6">SEO Description</h1>
                            <p className="text-neutral-600 px-4 py-3 rounded-none border border-neutral-200 mt-2 bg-neutral-50 text-[12px] sm:text-[13px] md:text-[14px] font-medium">{blog.seoDescription}</p>

                            <h1 className="text-[10px] uppercase tracking-widest font-bold text-black mt-5 sm:mt-6">SEO Keywords</h1>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {blog.seoKeywords?.map((keyword, index) => (
                                    <span key={index} className="rounded-none border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-neutral-600">
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