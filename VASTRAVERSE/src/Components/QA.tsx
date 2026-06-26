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
    }, [page])

    const Ask = async () => {
        if (!question) return;
        try {
            await AskQuestion({ productId, question });
            setQuestion("");
            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="bg-white max-w-5xl w-[92%] sm:w-[95%] lg:w-full mx-auto rounded-lg shadow-md p-4 sm:p-6 mt-6 sm:mt-10">

                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                        Questions & Answers
                    </h2>

                    <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500">
                        {getQA?.total || 0} Questions
                    </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                    <h3 className="font-medium mb-2 sm:mb-3 text-xs sm:text-base">
                        Ask a Question
                    </h3>

                    <div className="flex flex-row items-center gap-2 sm:gap-3">
                        <input
                            type="text"
                            name="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full sm:flex-1 border-gray-400 focus:ring focus:ring-gray-400 border rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base outline-none min-w-0"
                        />

                        <button
                            onClick={Ask}
                            className="shrink-0 bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800 cursor-pointer text-xs sm:text-base transition-colors">
                            Ask
                        </button>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6">

                    {getQA && getQA.data?.map((item: any) => (
                        <div
                            key={item._id}
                            className="border-b border-gray-200 pb-4 sm:pb-5 last:border-b-0"
                        >
                            <div className="flex gap-1.5 sm:gap-3">
                                <span className="font-bold text-sm sm:text-lg mt-0.5 sm:mt-0 shrink-0">
                                    Q.
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-xs sm:text-base break-words">
                                        {item?.question}
                                    </p>

                                    <div className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
                                        Asked by {item?.user?.name}
                                    </div>
                                </div>
                            </div>

                            {item.answer && (
                                <div className="flex gap-1.5 sm:gap-3 mt-3 sm:mt-4 ml-3 sm:ml-6">
                                    <span className="font-bold text-green-600 text-sm sm:text-lg mt-0.5 sm:mt-0 shrink-0">
                                        A.
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-base text-gray-800 break-words">
                                            {item.answer}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-[10px] sm:text-sm text-gray-500">

                                            <span>
                                                By {item.answeredBy ? item?.answeredBy : "admin"}
                                            </span>

                                            <button
                                                onClick={() => HelpFulCount(item._id)}
                                                className={`flex justify-center items-center gap-1.5 sm:gap-2 cursor-pointer ${item.isLiked ? "text-gray-900" : "text-gray-500"}`}>
                                                {item.isLiked ? (
                                                    <FaThumbsUp className="like_btn text-gray-900 text-[11px] sm:text-sm" />
                                                ) : (
                                                    <FaRegThumbsUp className="text-gray-500 transition-transform duration-200 hover:scale-110 text-[11px] sm:text-sm" />
                                                )}
                                                {item.helpfulCount}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {getQA && getQA.page_limit > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 border-t border-gray-100 pt-4 sm:pt-6 gap-4 sm:gap-0">
                        <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={!getQA.hasPrev}
                                className={`font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${!getQA.hasPrev ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-sm cursor-pointer active:scale-95'}`}>
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(getQA.page_limit, page + 1))}
                                disabled={!getQA.hasNext}
                                className={`font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 sm:hidden ${!getQA.hasNext ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-sm cursor-pointer active:scale-95'}`}>
                                Next
                            </button>
                        </div>

                        <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar w-full sm:flex-1 sm:px-4 min-w-0">
                            {Array.from({ length: getQA.page_limit }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`rounded-lg font-medium text-xs sm:text-sm w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${page === pageNum ? 'bg-black text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer active:scale-95'}`}>
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(Math.min(getQA.page_limit, page + 1))}
                            disabled={!getQA.hasNext}
                            className={`hidden sm:flex font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-300 items-center gap-2 shrink-0 ${!getQA.hasNext ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-sm cursor-pointer active:scale-95'}`}>
                            Next
                        </button>
                    </div>
                )}

            </div>
        </>
    );
}