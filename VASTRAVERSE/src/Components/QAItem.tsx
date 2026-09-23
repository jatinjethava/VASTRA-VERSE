import React, { useState } from "react";
import { useHelpFulCount } from "../Hooks/qa";

interface QAItemProps {
    item: any;
}

export const QAItem = React.memo(({ item }: QAItemProps) => {
    const { mutateAsync: HelpFulCount } = useHelpFulCount();
    const [isLiked, setIsLiked] = useState<boolean>(item.isLiked);
    const [helpfulCount, setHelpfulCount] = useState<number>(item.helpfulCount);

    const handleHelpful = async () => {
        setIsLiked(!isLiked);
        setHelpfulCount((prev) => (isLiked ? prev - 1 : prev + 1));
        try {
            await HelpFulCount(item._id);
        } catch (error) {
            setIsLiked(isLiked);
            setHelpfulCount(helpfulCount);
        }
    };

    return (
        <div className="group relative border-b border-gray-100 last:border-b-0 py-7 transition-all duration-300">

            <div className="flex gap-4 sm:gap-5 items-start">
                <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 text-white flex items-center justify-center rounded-sm font-black text-[10px] sm:text-xs tracking-widest uppercase">
                    Q
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 leading-snug break-words tracking-tight">
                        {item?.question}
                    </p>
                    <p className="mt-1.5 text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                        {item?.user?.name}
                    </p>
                </div>
            </div>

            {item.answer && (
                <div className="flex gap-4 sm:gap-5 items-start mt-5 ml-11 sm:ml-13">
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 border border-gray-900 text-gray-900 flex items-center justify-center rounded-sm font-black text-[10px] sm:text-xs tracking-widest uppercase">
                        A
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                            {item.answer}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400">
                                {item.answeredBy ? item.answeredBy : "Vastraverse"}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />

                            <button
                                onClick={handleHelpful}
                                className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer
                                    ${isLiked
                                        ? "text-gray-900"
                                        : "text-gray-400 hover:text-gray-700"
                                    }`}
                            >
                                <svg
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isLiked ? "fill-gray-900 scale-110" : "fill-none stroke-current"}`}
                                    viewBox="0 0 24 24"
                                    strokeWidth={isLiked ? 0 : 2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                    />
                                </svg>
                                <span>{helpfulCount} Helpful</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!item.answer && (
                <div className="ml-11 sm:ml-13 mt-4">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-300 border border-dashed border-gray-200 px-3 py-1.5 rounded-sm inline-block">
                        Awaiting answer
                    </span>
                </div>
            )}
        </div>
    );
});
