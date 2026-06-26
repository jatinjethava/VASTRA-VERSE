import { MensBlog } from "../Blogs";
import { useFetchBlogs } from "../../Hooks/blog";
import '../../index.css'

export const BlogSlider = () => {
    const { data: blogs, isLoading, error } = useFetchBlogs();

    return (
        <div className="rounded-xl w-full overflow-hidden relative">

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
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
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <p className="text-red-500 text-center">{error.message}</p>
                </div>
            )}

            <div
                className="flex gap-4 sm:gap-6 lg:gap-10 w-max animate-scroll hover:[animation-play-state:paused]"
            >
                {blogs?.data?.blog && Array.isArray(blogs.data.blog) ? blogs.data.blog.map((blog: any) => (
                    <div key={blog._id} className="shrink-0">
                        <MensBlog blog={blog} />
                    </div>
                )) : null}
            </div>
        </div>
    );
};