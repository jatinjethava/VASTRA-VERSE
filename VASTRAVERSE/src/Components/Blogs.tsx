import { isAuthenticated } from '../Utils/auth';
import { useNavigate } from "react-router";
import type { IBlog } from "../Api/blogApi";
import { useViewBlog } from "../Hooks/blog";
import { ArrowUpRight } from "lucide-react";

export const MensBlog = ({ blog }: { blog: IBlog }) => {

    const { mutate: viewBlog } = useViewBlog();
    const navigate = useNavigate();

    const handleRead = () => {
        if (isAuthenticated()) {
            viewBlog(blog._id);
        }
        navigate(`/blogs/detail?id=${blog._id}`, { state: { blog } });
    };

    const formattedDate = blog?.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "ARCHIVE";

    return (
        <article
            onClick={handleRead}
            className="group relative w-[250px] sm:w-[320px] md:w-[350px] bg-gradient-to-b from-neutral-900/95 via-[#0d0d0d]/95 to-black border border-white/10 hover:border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-md sm:shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.08)] cursor-pointer select-none shrink-0"
        >
            {/* Top specular hairline accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <div>
                {/* Image Container with Monochrome Luxury Aesthetic */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-950 border border-white/10 mb-4">
                    <img
                        src={blog?.featuredImage}
                        alt={blog?.title || "Article"}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Floating Category Badge */}
                    <div className="absolute top-2.5 left-2.5">
                        <span className="text-[8px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-md">
                            {blog?.category || "Editorial"}
                        </span>
                    </div>

                    {/* Arrow Button */}
                    <div className="absolute top-2.5 right-2.5">
                        <div className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/50 transition-all">
                            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Date Tag */}
                    <div className="absolute bottom-2.5 left-2.5 text-[8px] font-mono uppercase tracking-[0.18em] text-white/75 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        {formattedDate}
                    </div>
                </div>

                {/* Article Typography */}
                <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="editorial-text text-xs sm:text-base font-light text-white tracking-wide line-clamp-2 group-hover:text-neutral-200 transition-colors leading-snug">
                        {blog?.title || blog?.subTitle}
                    </h3>
                    <p className="text-[10px] sm:text-[13px] text-neutral-400 font-light leading-relaxed line-clamp-2">
                        {blog?.description}
                    </p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[9px] font-mono text-white/80 uppercase">
                        {(blog?.author || "V")[0]}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-neutral-300 tracking-wider uppercase truncate max-w-[110px] sm:max-w-[120px]">
                        {blog?.author || "Atelier Editor"}
                    </span>
                </div>

                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-white/60 group-hover:text-white flex items-center gap-1 transition-colors">
                    Read Article
                </span>
            </div>
        </article>
    );
};
