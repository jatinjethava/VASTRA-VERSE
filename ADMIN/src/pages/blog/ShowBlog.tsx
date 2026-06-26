import { IoClose, IoCalendarOutline, IoPersonOutline, IoEyeOutline, IoFolderOutline, IoPricetagOutline } from "react-icons/io5"
import type { Blogs } from "../../Api/blogApi"

export const ShowBlog = ({ blog, setShowBlog }: { blog: Blogs, setShowBlog: (value: boolean) => void }) => {

    return (
        <div
            onClick={() => setShowBlog(false)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 sm:p-6 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col animate-slide-up-fade"
            >

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Blog Details
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ml-2 ${blog?.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                            blog?.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                            }`}>
                            {blog?.status}
                        </span>
                    </h2>
                    <button
                        onClick={() => setShowBlog(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-10">

                    {blog?.featuredImage && (
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm group">
                            <img
                                src={blog?.featuredImage as string}
                                alt={blog?.title}
                                className="h-120 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                                    {blog?.title}
                                </h1>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <IoPersonOutline size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Author</p>
                                <p className="font-semibold text-gray-900 truncate">{blog?.author || "Admin"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                <IoFolderOutline size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</p>
                                <p className="font-semibold text-gray-900 truncate lowercase">{blog?.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <IoEyeOutline size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Views</p>
                                <p className="font-semibold text-gray-900 truncate">{blog?.views || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                <IoCalendarOutline size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Published</p>
                                <p className="font-semibold text-gray-900 truncate">
                                    {new Date(blog?.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="lg:col-span-2 space-y-8 h-fit">

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">Overview</h3>
                                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                    {blog?.description}
                                </p>

                                <div className="w-full border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-[65%]">
                                        {blog?.subTitle && (
                                            <div className="pl-4 border-l-4 border-blue-500">
                                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{blog?.subTitle}</h4>
                                                <p className="text-gray-600 leading-relaxed">{blog?.subDescription}</p>
                                            </div>
                                        )}
                                    </div>

                                    {blog?.images?.length > 0 && (
                                        <div className="w-full md:w-[35%]">
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                                                Gallery
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {blog.images.map((image: string | File, index: number) => {
                                                    const imgSrc = typeof image === 'string' ? image : URL.createObjectURL(image as File);
                                                    return (
                                                        <div key={index} className="relative rounded-xl overflow-hidden group aspect-square shadow-sm">
                                                            <img
                                                                src={imgSrc}
                                                                alt={`Gallery ${index + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">Content</h3>
                                <div className="prose prose-gray text-gray-700">
                                    {blog?.content?.map((paragraph: string, index: number) => (
                                        <p key={index} className="leading-relaxed mb-4 text-[1.05rem]">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="lg:col-span-1 space-y-8 border border-gray-500 rounded-2xl">
                        {blog?.seoKeywords && blog.seoKeywords.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <IoPricetagOutline /> Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {blog.seoKeywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}