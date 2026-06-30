import { IoAdd, IoTrash } from "react-icons/io5"
import { Link } from "react-router-dom"
import '../../index.css'
import { useGetAllBlogs, useDeleteBlog } from "../../Hooks/blog"
import { Edit, EyeIcon } from "lucide-react"
import { ShowBlog } from "./ShowBlog"
import { useState } from "react"
import type { Blogs } from "../../Api/blogApi"
import { useNavigate } from "react-router-dom"

export const BlogList = () => {

    const { data: blogs, isPending: isLoading, error } = useGetAllBlogs();
    const { mutateAsync: deleteBlog } = useDeleteBlog();

    const navigate = useNavigate();
    const [thisBlog, setThisBlog] = useState<Blogs | null>(null);
    const [showBlog, setShowBlog] = useState(false);

    const updateBlog = (blog: Blogs) => {
        navigate(`/admin/blogs/add-blog`, { state: { blog: blog, edit: true } });
    }

    const [filterAuthor, setFilterAuthor] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterViews, setFilterViews] = useState<string>("all");
    const [filterDate, setFilterDate] = useState<string>("all");
    const blogFilter = blogs?.filter((blog) => {
        let matches = true;
        if (filterAuthor !== "all" && !blog.author?.toLowerCase().includes(filterAuthor.toLowerCase())) {
            matches = false;
        }
        if (filterCategory !== "all" && !blog.category?.toLowerCase().includes(filterCategory.toLowerCase())) {
            matches = false;
        }
        if (filterStatus !== "all" && blog.status !== filterStatus) {
            matches = false;
        }
        if (filterViews !== "all") {
            const views = Number(blog.views) || 0;
            if (filterViews === "under100" && views >= 100) matches = false;
            if (filterViews === "100to1000" && (views < 100 || views > 1000)) matches = false;
            if (filterViews === "over1000" && views <= 1000) matches = false;
        }
        if (filterDate !== "all") {
            const date = new Date(blog.createdAt);
            const today = new Date();
            const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            const thisYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (filterDate === "today" && date.getTime() < today.getTime() - 24 * 60 * 60 * 1000) matches = false;
            if (filterDate === "thisWeek" && date < thisWeek) matches = false;
            if (filterDate === "thisMonth" && date < thisMonth) matches = false;
            if (filterDate === "thisYear" && date < thisYear) matches = false;
        }
        return matches;
    });

    return (
        <>
            <div className="pt-5 relative">
                <div className="flex items-center justify-between">
                    <h1 className="animate-fade-in-up-delay-1 font-semibold text-xl text-gray-800 dark:text-white">Blog List</h1>
                    <Link to="add-blog">
                        <button
                            onClick={() => navigate('/blogs/add-blog')}
                            className="animate-fade-in-up-delay-2 flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700">
                            <IoAdd size={20} /> Add Blog
                        </button>
                    </Link>
                </div>

                <div className="relative animate-fade-in-up-delay-2 mt-5 w-full">

                    {isLoading && (
                        <div className="absolute top-50 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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

                    {error && (
                        <div className="absolute top-50 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
                            <div className="text-red-500 font-semibold">
                                {error.message || "Failed to load blogs"}
                            </div>
                        </div>
                    )}

                    {blogs?.length === 0 && (
                        <div className="absolute top-50 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
                            <div className="text-gray-500 font-semibold">
                                No blogs found
                            </div>
                        </div>
                    )}

                    <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">
                                    <div className="flex flex-col gap-1 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <span>Author</span>
                                        <select onChange={(e) => setFilterAuthor(e.target.value)} value={filterAuthor} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white font-normal">
                                            <option value="">All</option>
                                            {[... new Set(blogs?.map((blog) => blog.author))]?.map((author) => (
                                                <option key={author} value={author}>{author}</option>
                                            ))}
                                        </select>
                                    </div>
                                </th>
                                <th className="p-3 text-left">
                                    <div className="flex flex-col gap-1 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <span>Category</span>
                                        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white font-normal">
                                            <option value="all">All</option>
                                            {[... new Set(blogs?.map((blog) => blog.category))]?.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </th>
                                <th className="p-3 text-left">
                                    <div className="flex flex-col gap-1 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <span>Status</span>
                                        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white font-normal">
                                            <option value="all">All</option>
                                            <option value="published">Published</option>
                                            <option value="pending">Pending</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="p-3 text-left">
                                    <div className="flex flex-col gap-1 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <span>Views</span>
                                        <select onChange={(e) => setFilterViews(e.target.value)} value={filterViews} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white font-normal">
                                            <option value="all">All</option>
                                            <option value="under100">Under 100</option>
                                            <option value="100to1000">100 - 1000</option>
                                            <option value="over1000">Over 1000</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="p-3 text-left">
                                    <div className="flex flex-col gap-1 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                                        <span>Created</span>
                                        <select onChange={(e) => setFilterDate(e.target.value)} value={filterDate} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white font-normal">
                                            <option value="all">All</option>
                                            <option value="today">Today</option>
                                            <option value="thisWeek">This Week</option>
                                            <option value="thisMonth">This Month</option>
                                            <option value="thisYear">This Year</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {blogFilter?.map((blog) => (
                                <tr key={blog?._id} className="shadow">
                                    <td className="p-3">
                                        <img
                                            src={blog?.featuredImage as string}
                                            alt={blog?.title as string}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>

                                    <td className="p-3">
                                        <div className="font-medium">
                                            {blog?.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {blog?.subTitle}
                                        </div>
                                    </td>

                                    <td className="p-3">
                                        {blog?.author}
                                    </td>

                                    <td className="p-3">
                                        {blog?.category}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${blog?.status === "PUBLISHED"
                                                ? "bg-green-100 text-green-700"
                                                : blog?.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {blog?.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {blog?.views}
                                    </td>

                                    <td className="p-3">
                                        {new Date(blog?.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                onClick={() => { setShowBlog(!showBlog); setThisBlog(blog); }}
                                                type="button"
                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-700 hover:bg-gray-700 hover:text-white"
                                            >
                                                <EyeIcon size={18} />
                                            </button>

                                            {blog?.author !== "user" && (
                                                <button
                                                    onClick={() => updateBlog(blog)}
                                                    type="button"
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-500 shadow-sm transition-all duration-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteBlog(blog?._id)}
                                                type="button"
                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-red-500 shadow-sm transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                <IoTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showBlog && <ShowBlog blog={thisBlog as Blogs} setShowBlog={setShowBlog} />}

            </div>
        </>
    )
}