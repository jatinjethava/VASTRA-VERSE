import { useEffect, useState } from "react";
import { useAskQuestion, useGetQAbyProduct } from "../Hooks/qa";
import { QAItem } from "./QAItem";
import '../index.css';

export const QA = ({ productId }: { productId: string }) => {

    const { mutateAsync: AskQuestion } = useAskQuestion();
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
    };

    const generatePagination = () => {
        if (!getQA) return [];
        const totalPages = getQA.page_limit;
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
        if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', page - 1, page, page + 1, '...', totalPages];
    };

    return (
        <div className="max-w-5xl w-[92%] sm:w-[95%] lg:w-full mx-auto mt-10 sm:mt-16 mb-12">

            <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 pb-6">
                <div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Community
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Questions &amp; Answers
                    </h2>
                    <p className="text-sm text-gray-400 mt-1.5 font-medium">
                        Real questions from real customers
                    </p>
                </div>
                {(getQA?.total ?? 0) > 0 && (
                    <div className="shrink-0 flex items-center gap-2 self-start sm:self-end">
                        <span className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
                            {getQA?.total}
                        </span>
                        <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400">
                            {getQA?.total === 1 ? "Question" : "Questions"}
                        </span>
                    </div>
                )}
            </div>

            <div className="mb-10 sm:mb-12">
                <label htmlFor="qa-input" className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Have a question?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        id="qa-input"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && Ask()}
                        placeholder="e.g., Does this shirt shrink after washing?"
                        className="flex-1 px-5 py-4 bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-300 font-medium focus:outline-none focus:border-gray-900 transition-all duration-200"
                        style={{ borderRadius: 0 }}
                    />
                    <button
                        onClick={Ask}
                        disabled={!question.trim()}
                        className="shrink-0 bg-gray-900 hover:bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                        style={{ borderRadius: 0 }}
                    >
                        Ask
                    </button>
                </div>
            </div>

            <div>
                {!getQA || getQA?.data?.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-gray-200">
                        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center border border-gray-200">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-gray-300">
                            No questions yet — be the first
                        </p>
                    </div>
                ) : (
                    <div>
                        {getQA?.data?.map((item: any) => (
                            <QAItem key={item._id} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {getQA && getQA.page_limit > 1 && (
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={!getQA.hasPrev}
                        className={`text-[11px] font-bold uppercase tracking-widest px-6 py-3 transition-all duration-200 flex items-center gap-2
                            ${!getQA.hasPrev
                                ? 'text-gray-300 cursor-not-allowed border border-gray-100'
                                : 'text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer active:scale-[0.97]'
                            }`}
                        style={{ borderRadius: 0 }}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        Prev
                    </button>

                    <div className="flex items-center gap-1.5">
                        {generatePagination().map((pageNum, idx) =>
                            pageNum === '...' ? (
                                <span key={`el-${idx}`} className="w-9 text-center text-gray-400 text-sm font-medium">…</span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum as number)}
                                    className={`w-9 h-9 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer
                                        ${page === pageNum
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    style={{ borderRadius: 0 }}
                                >
                                    {pageNum}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => setPage(Math.min(getQA?.page_limit || 1, page + 1))}
                        disabled={!getQA?.hasNext}
                        className={`text-[11px] font-bold uppercase tracking-widest px-6 py-3 transition-all duration-200 flex items-center gap-2
                            ${!getQA?.hasNext
                                ? 'text-gray-300 cursor-not-allowed border border-gray-100'
                                : 'text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer active:scale-[0.97]'
                            }`}
                        style={{ borderRadius: 0 }}
                    >
                        Next
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};