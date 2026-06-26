import { useNavigate } from "react-router"
import type { IBlog } from "../Api/blogApi";
import { useViewBlog } from "../Hooks/blog";

export const MensBlog = ({ blog }: { blog: IBlog }) => {

    const { mutate: viewBlog } = useViewBlog();
    const navigate = useNavigate();

    return (
        <div className="h-auto pb-6">
            <div className="mt-6 sm:mt-10 flex justify-center items-center">
                <div className="w-[240px] sm:w-[280px] md:w-[340px] lg:w-[400px] mx-auto flex flex-col justify-center items-center space-y-3 sm:space-y-5">
                    <div className="w-full">
                        <img src={blog?.featuredImage} className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-xl shadow-sm" alt={blog?.title} />
                    </div>
                    <div className="w-full text-left flex flex-col justify-between items-start">
                        <div className="text-xs sm:text-sm h-auto min-h-[100px] sm:min-h-[120px] text-gray-500 leading-relaxed">
                            <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 uppercase tracking-wider mb-1.5 sm:mb-2">{blog?.subTitle}</h2>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">
                                {blog?.description.length > 150 ? blog?.description.slice(0, 150) + "..." : blog?.description}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                viewBlog(blog._id);
                                navigate("/blogs", { state: { blog } });
                            }}
                            className="text-gray-700 font-bold hover:text-gray-900 hover:underline hover:underline-offset-4 text-xs sm:text-sm py-2 rounded-lg mt-1 transition-all">Read More</button>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-2 tracking-wider uppercase font-medium">By <span className="text-gray-800 font-bold text-xs sm:text-sm lg:text-base font-mono">{blog?.author}</span> on {new Date(blog?.createdAt).toDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}