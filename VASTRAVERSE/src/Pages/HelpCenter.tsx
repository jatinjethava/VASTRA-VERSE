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
            <div className="bg-[#fafafa] min-h-screen">

                <section className="bg-[#0a0a0b] relative overflow-hidden border-b border-white/10">

                    {/* Specular hairline */}
                    <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[50vh] h-[50vh] rounded-full bg-white/5 opacity-40 blur-3xl pointer-events-none"></div>

                    <div className="relative max-w-3xl mx-auto px-6 py-14 sm:py-24 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/80 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Atelier Concierge Services
                        </div>
                        <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15] mb-4">
                            Client Support & <br />
                            <span className="italic font-serif font-normal">Privilege Guidance</span>
                        </h1>
                        <p className="text-neutral-400 text-xs sm:text-sm font-light mb-8 max-w-xl mx-auto leading-relaxed">
                            Explore sizing protocols, logistics timing, bespoke reservations, or dispatch inquiries to our master tailors.
                        </p>

                        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center px-5 py-1 gap-3 border border-white/20 shadow-2xl transition hover:border-white/40">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search queries, fabrics, return protocols…"
                                className="flex-1 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-400 bg-transparent outline-none w-full font-light"
                            />
                            <kbd className="hidden sm:flex items-center text-[10px] text-neutral-400 bg-white/10 border border-white/10 rounded-full px-2.5 py-0.5 font-mono shrink-0">ESC</kbd>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Curated:</span>
                            <span className="text-[10px] sm:text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Sizing & Silhouette</span>
                            <span className="text-[10px] sm:text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">White Glove Transit</span>
                            <span className="text-[10px] sm:text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Atelier Return Protocol</span>
                            <span className="text-[10px] sm:text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Textile Preservation</span>
                        </div>
                    </div>
                </section>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

                    <div className="mb-8">
                        <Contact />
                    </div>

                    <div className="mb-14">

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                            <div className="relative bg-white border border-neutral-200/80 shadow-sm w-full md:w-1/3 lg:w-1/4 rounded-3xl p-6 sm:p-7 text-neutral-900 shrink-0 self-start overflow-hidden">
                                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-5 font-serif text-lg">
                                    ✦
                                </div>
                                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">Personal Liaison</span>
                                <h3 className="editorial-text text-xl font-light text-neutral-900 mb-2 tracking-tight">Need Bespoke <span className="italic font-serif font-normal">Assistance?</span></h3>
                                <p className="text-neutral-500 text-xs font-light leading-relaxed mb-6">Our concierge replies within 2 to 4 business hours to assist with styling and orders.</p>
                                <a href="#name" className="inline-block text-xs uppercase tracking-widest font-medium bg-black hover:bg-neutral-800 text-white px-5 py-3 rounded-full transition-colors w-full text-center shadow-md">Consult Concierge</a>
                            </div>

                            <div className="w-full md:flex-1">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
                                    <div>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 block mb-0.5">Archive Knowledge</span>
                                        <h2 className="editorial-text text-xl font-light text-neutral-900 tracking-tight">Frequently Addressed <span className="italic font-serif font-normal">Inquiries</span></h2>
                                    </div>
                                    <select
                                        name="faqQues"
                                        id="faqQues"
                                        value={faqQues}
                                        onChange={(e) => setFaqQues(e.target.value)}
                                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium uppercase tracking-wider border border-neutral-200 rounded-full bg-white focus:border-black outline-none transition cursor-pointer"
                                    >
                                        <option value="all">All Inquiries</option>
                                        <option value="order">Reservations & Orders</option>
                                        <option value="delivery">White-Glove Logistics</option>
                                        <option value="payment">Tokenized Settlement</option>
                                        <option value="return">Return Protocol</option>
                                        <option value="account">Client Dossier</option>
                                        <option value="product">Garment & Silhouettes</option>
                                        <option value="other">Bespoke Matters</option>
                                    </select>
                                </div>

                                <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden divide-y divide-neutral-100 shadow-sm">
                                    {faqList?.faq?.map((faq: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`px-5 sm:px-7 py-5 cursor-pointer hover:bg-neutral-50/70 transition-colors ${activeFaq === index ? "bg-neutral-50/50" : ""}`}
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-sm font-medium text-neutral-900">{faq?.question}</p>
                                                <svg className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${activeFaq === index ? "rotate-180 text-black" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <div className={`grid transition-all duration-300 ease-in-out ${activeFaq === index ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs sm:text-sm text-neutral-600 font-light bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl leading-relaxed">
                                                        {faq?.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(faqList?.page_limit ?? 0) > 1 && (
                                        <div className="flex justify-between items-center gap-2 sm:gap-4 px-4 sm:px-7 py-4 border-t border-neutral-100 bg-neutral-50/50">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                                className="shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-black transition-colors px-3 py-1.5 cursor-pointer"
                                            >
                                                ← Prev
                                            </button>
                                            <div className="flex flex-wrap justify-center gap-1.5">
                                                {[...Array(faqList?.page_limit || 0)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setPage(index + 1)}
                                                        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${page === index + 1 ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:text-black hover:bg-neutral-100"}`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                disabled={page === faqList?.page_limit || !faqList?.page_limit}
                                                onClick={() => setPage(page + 1)}
                                                className="shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-black transition-colors px-3 py-1.5 cursor-pointer"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}