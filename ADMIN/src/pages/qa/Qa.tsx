import { useMemo, useState } from "react"
import type { QA as QaType } from "../../Api/qaApi"
import { useQAList, useAnswerQuestion, useDeleteQuestion } from "../../Hooks/qa"
import { MessageCircleQuestion, Trash2, Send, X } from "lucide-react"
import '../../index.css'

export const QA = () => {

    const { data: qaList, isLoading, isError } = useQAList()
    const { mutate: answerQuestion, isPending: isAnswerPending } = useAnswerQuestion();
    const { mutate: deleteQuestion, isPending: isDeletePending } = useDeleteQuestion();
    const isPending = isAnswerPending || isDeletePending;

    const [answerModalItem, setAnswerModalItem] = useState<QaType | null>(null)
    const [answerText, setAnswerText] = useState<string>("")
    const [filter, setFilter] = useState<"all" | "answered" | "unanswered">("all")
    const [searchTerm, setSearchTerm] = useState("");
    const [productSearch, setProductSearch] = useState("");

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    }

    const filteredQA = useMemo(() => {
        if (!qaList) return []
        return qaList.filter((q: any) => {

            const productName = (q.product?.title || q.product?.name || "").toLowerCase();
            const productSearchText = productSearch.toLowerCase();

            const matchesProductSearch = !productSearchText || productName.includes(productSearchText);
            if (!matchesProductSearch) return false;

            const questionText = (q._doc?.question || q.question || "").toLowerCase();
            const customerName = (q._doc?.user?.name || q.user?.name || "").toLowerCase();
            const searchText = searchTerm.toLowerCase();

            const matchesSearch = !searchText || questionText.includes(searchText) || customerName.includes(searchText);
            if (!matchesSearch) return false;

            const isAnswered = q._doc ? q._doc.isAnswered : q.isAnswered;
            if (filter === "all") return true;
            if (filter === "answered") return isAnswered;
            return !isAnswered;
        })
    }, [qaList, filter, searchTerm, productSearch])

    const groupedByProduct = useMemo(() => {
        if (!filteredQA.length) return []

        const grouped: Record<string, { product: QaType["product"], questions: QaType[] }> = {}

        filteredQA.forEach((q: any) => {
            const pid = q.product?._id || q.productId || "unknown"
            if (!grouped[pid]) {
                grouped[pid] = {
                    product: q.product || { _id: pid, title: "Unknown Product" },
                    questions: [],
                }
            }
            grouped[pid].questions.push(q)
        })

        return Object.values(grouped)
    }, [filteredQA])

    const stats = useMemo(() => {
        if (!qaList) return { total: 0, pending: 0, answered: 0 }
        const total = qaList.length;
        const pending = qaList.filter((q: any) => !(q._doc ? q._doc.isAnswered : q.isAnswered)).length;
        const answered = qaList.filter((q: any) => (q._doc ? q._doc.isAnswered : q.isAnswered)).length;
        return {
            total,
            pending,
            answered,
        }
    }, [qaList])

    const handleOpenAnswer = (item: any) => {
        const data = item._doc ? item._doc : item;
        setAnswerModalItem(data)
        setAnswerText(data.answer || "")
    }

    const handleCloseAnswer = () => {
        setAnswerModalItem(null)
        setAnswerText("")
    }

    const handleSubmitAnswer = () => {
        if (!answerModalItem || !answerText.trim()) return
        answerQuestion({ questionId: answerModalItem._id, answer: answerText })
        handleCloseAnswer()
    }

    return (
        <div className="relative container mx-auto">

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Questions & Answers
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review and respond to customer questions about products
                        </p>
                    </div>

                    <div className="flex items-center gap-2">

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />

                        <select
                            name="filter"
                            id="qa-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as "all" | "answered" | "unanswered")}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="all">All Questions</option>
                            <option value="answered">Answered</option>
                            <option value="unanswered">Unanswered</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 border border-indigo-200 px-4 py-3 rounded-xl">
                        <p className="text-xs text-indigo-500 uppercase tracking-wide font-medium">
                            Total Questions
                        </p>
                        <p className="text-xl pt-2 font-bold text-indigo-600">
                            {stats.total}
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
                        <p className="text-xs text-amber-500 uppercase tracking-wide font-medium">
                            Pending
                        </p>
                        <p className="text-xl pt-2 font-bold text-amber-600">
                            {stats.pending}
                        </p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
                        <p className="text-xs text-emerald-500 uppercase tracking-wide font-medium">
                            Answered
                        </p>
                        <p className="text-xl pt-2 font-bold text-emerald-600">
                            {stats.answered}
                        </p>
                    </div>
                </div>
            </div>

            {(isLoading || isPending) && (
                <div className="absolute top-70 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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

            {isError && (
                <div className="flex flex-col items-center justify-center p-12 mt-6 bg-white rounded-2xl border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Something went wrong</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                        We couldn't load the questions. Please try again.
                    </p>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            )}

            {!isLoading && !isError && qaList?.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 mt-6 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <MessageCircleQuestion className="w-7 h-7 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No questions yet</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                        Customer questions will appear here once they start asking about your products.
                    </p>
                </div>
            )}

            {groupedByProduct.length > 0 && (
                <div className="mt-6 space-y-6">
                    {groupedByProduct.map((group) => (
                        <div key={group.product?._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {group.product?.images?.[0] ? (
                                        <img
                                            src={group.product.images[0]}
                                            alt={group.product.title}
                                            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                            <MessageCircleQuestion className="w-6 h-6 text-indigo-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {group.product?.title || "Unknown Product"}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {group.questions.length} {group.questions.length === 1 ? "Question" : "Questions"}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-indigo-600 font-medium">
                                                ID: {group.product?._id?.substring(0, 8)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                                            <th className="px-6 flex items-center py-3 font-medium">
                                                <span className="mr-2 font-medium">Question</span>
                                                <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder="Search" className="w-full border border-gray-300 focus:border-gray-400 focus:border-2 outline-none rounded-lg px-2 py-1 text-sm" />
                                            </th>
                                            <th className="px-6 py-3 font-medium">Customer</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {group?.questions?.map((item: any) => {
                                            const isPending = !item._doc?.isAnswered;
                                            return (
                                                <tr
                                                    key={item._doc._id}
                                                    className={`transition-colors duration-200 border-l-4 ${isPending
                                                        ? "bg-amber-50/40 border-amber-400"
                                                        : "bg-white border-transparent hover:bg-gray-50/50"
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {item?._doc?.question}
                                                        </p>
                                                        {item?._doc?.answer && (
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                                Reply: {item?._doc?.answer}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {item?._doc?.user?.name || "N/A"}
                                                            </span>
                                                            <span className="text-xs text-gray-400 tracking-wide">
                                                                {item?._doc?.user?.email || "N/A"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(item?._doc?.createdAt).toLocaleDateString()}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item?._doc?.isAnswered ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                                Answered
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {!item._doc.isAnswered && (
                                                                <button
                                                                    onClick={() => handleOpenAnswer(item)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 active:scale-95 border border-indigo-100 hover:border-indigo-200 cursor-pointer"
                                                                >
                                                                    <Send size={14} />
                                                                    Answer
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteQuestion(item._doc._id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 active:scale-95 border border-red-100 hover:border-red-200 cursor-pointer"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {answerModalItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fade-in-up">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Answer Question
                            </h2>
                            <button
                                onClick={handleCloseAnswer}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                                    Question from {answerModalItem.user?.name || "Customer"}
                                </p>
                                <p className="text-sm text-gray-800 font-medium">
                                    {answerModalItem.question}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Your Answer
                                </label>
                                <textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Type your answer here..."
                                    rows={4}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={handleCloseAnswer}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!answerText.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                            >
                                <Send size={14} />
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}