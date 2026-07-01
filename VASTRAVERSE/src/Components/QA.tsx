import { useEffect, useState } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useAskQuestion, useGetQAbyProduct, useHelpFulCount } from "../Hooks/qa";
import '../index.css';

export const QA = ({ productId }: { productId: string }) => {

    const { mutateAsync: AskQuestion } = useAskQuestion();
    const { mutateAsync: HelpFulCount } = useHelpFulCount();

    const [question, setQuestion] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const { data: getQA, refetch } = useGetQAbyProduct(productId, page);

    useEffect(() => {
        refetch();
    }, [page]);

    const Ask = async () => {
        if (!question.trim()) return;
        try {
            await AskQuestion({ productId, question });
            setQuestion("");
            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    const generatePagination = () => {
        if (!getQA) return [];
        const totalPages = getQA.page_limit;

        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (page <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (page >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', page - 1, page, page + 1, '...', totalPages];
    };

    return (
        <div className="max-w-5xl w-[92%] sm:w-[95%] lg:w-full mx-auto mt-8 sm:mt-12 mb-10 font-sans">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                            Questions & Answers
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Find out more about this product from other customers
                        </p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border border-indigo-100/50">
                        {getQA?.total || 0} Questions
                    </div>
                </div>

                {/* Ask Question Section */}
                <div className="p-6 sm:p-8 bg-gray-50/50">
                    <div className="max-w-3xl">
                        <label htmlFor="question" className="block text-sm font-bold text-gray-700 mb-2">Have a question?</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    id="question"
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g., Does this shirt shrink after washing?"
                                    className="w-full pl-5 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
                                />
                            </div>
                            <button
                                onClick={Ask}
                                disabled={!question.trim()}
                                className="shrink-0 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]">
                                Ask Question
                            </button>
                        </div>
                    </div>
                </div>

                {/* Q&A List */}
                <div className="p-6 sm:p-8 space-y-6">
                    {getQA?.data?.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 font-medium">No questions asked yet. Be the first!</p>
                        </div>
                    ) : (
                        getQA?.data?.map((item: any) => (
                            <div key={item._id} className="group p-5 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300">
                                {/* Question */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                                        Q
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-snug">
                                            {item?.question}
                                        </h4>
                                        <div className="text-xs text-gray-400 mt-1.5 font-medium">
                                            Asked by <span className="text-gray-600">{item?.user?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Answer */}
                                {item.answer && (
                                    <div className="flex gap-4 mt-5 ml-2 sm:ml-4 pl-4 sm:pl-6 border-l-2 border-gray-100 group-hover:border-indigo-100 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            A
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm sm:text-base text-gray-700 break-words leading-relaxed">
                                                {item.answer}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium">
                                                <span className="text-gray-500">
                                                    Answered by <span className="text-gray-700 font-semibold">{item.answeredBy ? item?.answeredBy : "Vastraverse Team"}</span>
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                <button
                                                    onClick={() => HelpFulCount(item._id)}
                                                    className={`group/btn flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${item.isLiked ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-500 hover:text-gray-700"}`}>
                                                    {item.isLiked ? (
                                                        <FaThumbsUp className="text-[13px]" />
                                                    ) : (
                                                        <FaRegThumbsUp className="text-[13px] group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    )}
                                                    <span>{item.helpfulCount} <span className="hidden sm:inline">helpful</span></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {getQA && getQA.page_limit > 1 && (
                    <div className="px-6 sm:px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={!getQA.hasPrev}
                            className={`font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${!getQA.hasPrev ? 'text-gray-400 bg-gray-100/50 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer active:scale-[0.98]'}`}>
                            Previous
                        </button>

                        <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
                            {generatePagination().map((pageNum, idx) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum as number)}
                                        className={`rounded-xl font-bold text-sm w-10 h-10 flex items-center justify-center transition-all duration-300 ${page === pageNum ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-110' : 'text-gray-600 bg-transparent hover:bg-gray-100 cursor-pointer active:scale-95'}`}>
                                        {pageNum}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(Math.min(getQA?.page_limit || 1, page + 1))}
                            disabled={!getQA?.hasNext}
                            className={`font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${!getQA?.hasNext ? 'text-gray-400 bg-gray-100/50 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer active:scale-[0.98]'}`}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}