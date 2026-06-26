import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";

export const Blogs = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const blog = location.state?.blog;

    const [imageIndex, setImageIndex] = useState<number>(0);

    return (
        <>
            <div className="mx-auto relative mb-10">
                <div className="h-[80vh] mx-5 rounded-2xl overflow-hidden relative shadow-lg">
                    <img src={blog?.featuredImage} className="w-full h-full object-cover absolute inset-0" alt={blog?.title} />

                    <div className="absolute inset-0 bg-black/60 z-0"></div>

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-5">
                        <h1 className="w-full md:w-[70%] mx-auto text-md md:text-3xl xl:text-[40px] font-extrabold text-white tracking-wider mb-3 drop-shadow-lg">{blog?.title}</h1>
                        <p className="w-full md:w-[80%] text-gray-200 text-xs md:text-lg xl:text-[20px] font-light tracking-wider mb-6">{blog?.subTitle}</p>

                        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
                            <button className="px-6 py-3 rounded-full text-[10px] sm:text-xs md:text-sm lg:text-[12px] xl:text-[13px] font-bold uppercase tracking-widest cursor-pointer text-gray-900 bg-white hover:bg-gray-200 transition shadow-md">
                                {blog?.category || "Blog"}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center items-center mt-4">
                            <CiCalendar className="text-white text-xl" />
                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-[12px] xl:text-[13px] text-gray-200 uppercase tracking-widest">
                                Published: <span className="font-bold">{blog?.createdAt ? new Date(blog.createdAt).toDateString() : "January 15, 2024"}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="text-[10px] sm:text-xs md:text-sm lg:text-[12px] xl:text-[13px] mx-4 absolute top-5 left-5 z-10 cursor-pointer text-gray-800 text-lg flex gap-2 items-center bg-white rounded-xl shadow-md px-3 py-2 animate-pulse">
                    <ArrowLeft size={15} className="text-gray-900 text-[10px] sm:text-xs md:text-sm lg:text-base" /> Back
                </button>
            </div>

            <div className="my-5 w-full">
                <div className="w-[80%] h-full mx-auto flex">
                    <div className="w-full h-full flex text-[20px] sm:text-base md:text-[20px] lg:text-xl">
                        <p className="font-bold text-gray-800">Explore Blogs</p>
                    </div>
                    <div className="w-full h-full flex justify-end items-end">
                        <button className="px-3 py-2.5 rounded-full text-[8px] sm:text-xs md:text-sm lg:text-base font-semibold uppercase tracking-widest cursor-pointer text-gray-800 bg-white">
                            This is certified blog
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-300 mx-auto w-[80%] h-0.5 rounded-full"></div>

            <section id="blog" className="mx-auto w-[80%] my-10">
                <div className="">
                    <h1 className="text-lg sm:text-base md:text-[20px] lg:text-xl xl:text-3xl uppercase mb-5 font-bold tracking-wider">{blog?.subTitle || "Best fashion tips ever!"}</h1>
                    <p className="text-sm sm:text-base md:text-[15px] lg:text-xl xl:text-[18px] text-gray-600">{blog?.subDescription}</p>
                    <div className="w-full flex flex-col lg:flex-row gap-10 justify-between items-start my-10">
                        <div className="lg:w-2/3">
                            <h2 className="text-lg sm:text-base md:text-[20px] lg:text-xl xl:text-[22px] font-bold text-gray-800 uppercase tracking-wider mb-4">{blog?.title}</h2>
                            <p className="text-sm sm:text-base md:text-[15px] lg:text-xl xl:text-[17px] mb-5 text-gray-800 leading-relaxed">
                                {blog?.subDescription || "This blog contains detailed information about fashion, style and more."}
                            </p>

                            {blog?.content?.map((paragraph: string, index: number) => (
                                <p key={index} className="text-sm sm:text-base md:text-[15px] lg:text-xl xl:text-[17px] mb-6 text-gray-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}

                            {!blog?.content && (
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[17px] mb-6 text-gray-800 leading-relaxed">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum deserunt alias necessitatibus quam perspiciatis ea facere doloribus, repellat perferendis consequatur assumenda eligendi fugiat in ratione.
                                </p>
                            )}
                        </div>
                        <div className="lg:w-1/3">
                            {blog?.images && blog.images.length > 0 ? (
                                <img src={blog.images[imageIndex]} className="w-full h-[60vh] rounded-2xl shadow-md object-cover" alt="Blog Visual" />
                            ) : (
                                <img src="/pexels-anna-nekrashevich-8532616.jpg" className="w-full h-[60vh] rounded-2xl shadow-md object-cover" alt="Blog Visual" />
                            )}

                            {blog?.images?.length > 1 ? (
                                <div className="flex justify-center items-center gap-5 mt-10">
                                    {blog.images.map((image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="overflow-hidden rounded-2xl shadow-md"
                                        >
                                            <img
                                                onClick={() => setImageIndex(index)}
                                                src={image}
                                                alt={`Blog Visual ${index + 1}`}
                                                className="w-20 h-20 object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (null)}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}