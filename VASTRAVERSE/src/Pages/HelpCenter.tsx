import { useEffect, useState } from "react";
import { useGetUserFaqs } from "../Hooks/help";
import { Contact } from "./Contact";

export const HelpCenter = () => {

    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [faqQues, setFaqQues] = useState<string>("all");
    const [page, setPage] = useState<number>(1);

    const { data: faqList } = useGetUserFaqs(page, faqQues);

    useEffect(() => {
        document.title = "Help Center | Vastra Verse";
    }, []);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    useEffect(() => {
        setPage(1);
    }, [faqQues]);

    return (
        <>
            <div>

                <section className="bg-slate-900 relative overflow-hidden">


                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[50vh] h-[50vh] rounded-full bg-gray-600 opacity-20 blur-3xl pointer-events-none"></div>

                    <div className="relative max-w-3xl mx-auto px-6 py-12 sm:py-20 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white/70 text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full mb-4 sm:mb-6">
                            All systems operational
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4">
                            What can we help<br />you with?
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto">Search our knowledge base, browse guides, or reach out to our team.</p>

                        <div className="search-ring max-w-xl mx-auto bg-white rounded-xl flex items-center px-4 gap-2 sm:gap-3 shadow-lg border border-slate-200 transition">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input type="text" placeholder="Search articles, guides, FAQs…"
                                className="flex-1 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none w-full" />
                            <kbd className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono shrink-0">⌘K</kbd>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 sm:mt-5">
                            <span className="text-[10px] sm:text-xs text-slate-500">Try:</span>
                            <a href="#" className="tag-pill text-[10px] sm:text-xs text-slate-200 cursor-pointer bg-white/10 border border-white/10 px-2 sm:px-3 py-1 rounded-full transition">Billing</a>
                            <a href="#" className="tag-pill text-[10px] sm:text-xs text-slate-200 cursor-pointer bg-white/10 border border-white/10 px-2 sm:px-3 py-1 rounded-full transition">API keys</a>
                            <a href="#" className="tag-pill text-[10px] sm:text-xs text-slate-200 cursor-pointer bg-white/10 border border-white/10 px-2 sm:px-3 py-1 rounded-full transition">Reset password</a>
                            <a href="#" className="tag-pill text-[10px] sm:text-xs text-slate-200 cursor-pointer bg-white/10 border border-white/10 px-2 sm:px-3 py-1 rounded-full transition">Invite team</a>
                            <a href="#" className="tag-pill text-[10px] sm:text-xs text-slate-200 cursor-pointer bg-white/10 border border-white/10 px-2 sm:px-3 py-1 rounded-full transition">Webhooks</a>
                        </div>
                    </div>
                </section>

                <main className="max-w-7xl mx-auto px-6 py-14">

                    <div className="p-4">
                        <Contact />
                    </div>

                    <div className="mb-14">

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                            <div className="bg-slate-50 shadow-sm shadow-slate-200 w-full md:w-1/3 lg:w-1/4 rounded-2xl p-6 text-gray-800 shrink-0 self-start">
                                <div className="w-12 h-12 shadow-md shadow-slate-300 bg-gray-700 rounded-xl flex items-center justify-center mb-5">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-base mb-2">Still need help?</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-5">Our team replies within 2 business hours on weekdays.</p>
                                <a href="#" className="inline-block text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-colors w-full text-center sm:w-auto">Open a ticket</a>
                            </div>

                            <div className="w-full md:flex-1">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 mb-5">
                                    <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Frequently asked</h2>
                                    <select name="faqQues" id="faqQues" value={faqQues} onChange={(e) => setFaqQues(e.target.value)} className="w-full sm:w-auto p-2.5 sm:p-2 text-sm border border-slate-200 rounded-xl focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all">
                                        <option value="all">All</option>
                                        <option value="order">order</option>
                                        <option value="delivery">delivery</option>
                                        <option value="payment">payment</option>
                                        <option value="return">return</option>
                                        <option value="account">account</option>
                                        <option value="product">product</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                                    {faqList?.faq?.map((faq: any, index: number) => (
                                        <div key={index} className={`faq-item px-4 sm:px-6 py-4 sm:py-5 cursor-pointer hover:bg-slate-50 transition-colors ${activeFaq === index ? "bg-slate-50" : ""}`} onClick={() => toggleFaq(index)}>
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-sm sm:text-base font-semibold text-slate-800">{faq?.question}</p>
                                                <svg className={`faq-chevron w-5 h-5 text-slate-400 shrink-0 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <div className={`grid transition-all duration-300 ease-in-out ${activeFaq === index ? "grid-rows-[1fr] opacity-100 mt-2 sm:mt-3" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm text-slate-600 leading-relaxed">{faq?.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(faqList?.page_limit ?? 0) > 1 && (
                                        <div className="flex justify-between items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-5 border-t border-slate-100 bg-gray-50/50">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                                className="shrink-0 text-[10px] sm:text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-900 transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded-lg sm:rounded-none"
                                            >
                                                ← <span className="hidden sm:inline">Previous</span><span className="inline sm:hidden">Prev</span>
                                            </button>
                                            <div className="flex flex-wrap justify-center gap-1">
                                                {[...Array(faqList?.page_limit || 0)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setPage(index + 1)}
                                                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md sm:rounded-full text-[10px] sm:text-sm font-medium transition-all ${page === index + 1 ? "bg-gray-900 shadow-md text-white" : "text-slate-600 hover:bg-slate-200 bg-slate-100 sm:bg-transparent"}`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                disabled={page === faqList?.page_limit || !faqList?.page_limit}
                                                onClick={() => setPage(page + 1)}
                                                className="shrink-0 text-[10px] sm:text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-900 transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded-lg sm:rounded-none"
                                            >
                                                <span className="hidden sm:inline">Next</span><span className="inline sm:hidden">Next</span> →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div >
        </>
    );
}