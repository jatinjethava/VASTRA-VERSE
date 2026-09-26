import { MensBlog } from "../Blogs";
import { useFetchBlogs } from "../../Hooks/blog";
import '../../index.css';

export const BlogSlider = () => {
    const { data: blogs, isLoading, error } = useFetchBlogs();

    const blogList = (blogs?.data?.blog && Array.isArray(blogs.data.blog)) ? blogs.data.blog : [];
    
    const marqueeList = blogList.length > 0 ? (blogList.length < 5 ? [...blogList, ...blogList, ...blogList] : [...blogList, ...blogList]) : [];

    return (
        <div className="w-full overflow-hidden relative py-2">
            
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0c0c0d] to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#000000] to-transparent z-20" />

            {isLoading && (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <div className="dot-spinner dot-spinner-inverse" />
                </div>
            )}

            {error && (
                <div className="py-12 flex items-center justify-center text-center">
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Unable to load journal archives.</p>
                </div>
            )}

            {!isLoading && !error && marqueeList.length > 0 && (
                <div className="flex gap-4 sm:gap-6 lg:gap-8 w-max animate-scroll hover:[animation-play-state:paused] py-2">
                    {marqueeList.map((blog: any, index: number) => (
                        <div key={`${blog._id}-${index}`} className="shrink-0">
                            <MensBlog blog={blog} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};