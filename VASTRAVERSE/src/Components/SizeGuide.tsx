import React from "react"
import { IoClose } from "react-icons/io5"

export const SizeGuide = ({
    setShowSizeChart
}: {
    setShowSizeChart: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setShowSizeChart(false)}
        >
            <div
                className="relative w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-none shadow-2xl animate-[scaleIn_0.25s_ease-out] border border-neutral-200"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="sticky top-0 bg-white z-20 px-6 py-6 sm:px-10 border-b border-neutral-200 flex justify-between items-center">
                    <div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] block mb-1">
                            Atelier Reference
                        </span>
                        <h1 className="editorial-text text-3xl sm:text-4xl font-light text-black tracking-tight">
                            Size Guide
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowSizeChart(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-black transition-all duration-300 cursor-pointer shrink-0 border border-transparent hover:border-neutral-200"
                        aria-label="Close size guide"
                    >
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                <div className="p-6 sm:p-10 pt-8">
                    <p className="text-neutral-500 mb-10 text-xs sm:text-sm leading-relaxed max-w-2xl">
                        Finding the perfect drape is essential to the Atelier aesthetic. Use our precise measurements below to acquire your ideal fit.
                    </p>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            How to Measure
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Chest",
                                    desc: "Measure around the fullest part of your chest, keeping the tape level."
                                },
                                {
                                    title: "Waist",
                                    desc: "Measure around your natural waistline, precisely above the navel."
                                },
                                {
                                    title: "Hips",
                                    desc: "Measure around the fullest part of the hips with feet together."
                                },
                                {
                                    title: "Shoulder",
                                    desc: "Measure from the edge of one shoulder to the other across the back."
                                }
                            ].map((item) => (
                                <div key={item.title} className="group">
                                    <h3 className="font-bold text-[9px] text-black uppercase tracking-widest mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                            <div className="md:col-span-2 group">
                                <h3 className="font-bold text-[9px] text-black uppercase tracking-widest mb-2">
                                    Length
                                </h3>
                                <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                                    Measure from the highest point of the shoulder down to the desired garment hemline.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            Men's T-Shirt Size Chart
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap text-left">
                                <thead>
                                    <tr>
                                        <th className="py-4 pr-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Size
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Chest (inches)
                                        </th>
                                        <th className="py-4 pl-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Length (inches)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["S", "36-38", "27"],
                                        ["M", "38-40", "28"],
                                        ["L", "40-42", "29"],
                                        ["XL", "42-44", "30"],
                                        ["XXL", "44-46", "31"],
                                    ].map(([size, chest, length]) => (
                                        <tr key={size} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-4 pr-4 font-bold text-[10px] text-black tracking-widest">{size}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{chest}</td>
                                            <td className="py-4 pl-4 text-neutral-500 font-mono text-xs">{length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            Men's Shirt Size Chart
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap text-left">
                                <thead>
                                    <tr>
                                        <th className="py-4 pr-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Size
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Chest (inches)
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Shoulder (inches)
                                        </th>
                                        <th className="py-4 pl-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Length (inches)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["S", "38", "17", "28"],
                                        ["M", "40", "18", "29"],
                                        ["L", "42", "19", "30"],
                                        ["XL", "44", "20", "31"],
                                        ["XXL", "46", "21", "32"],
                                    ].map(([size, chest, shoulder, length]) => (
                                        <tr key={size} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-4 pr-4 font-bold text-[10px] text-black tracking-widest">{size}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{chest}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{shoulder}</td>
                                            <td className="py-4 pl-4 text-neutral-500 font-mono text-xs">{length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            Women's Size Chart
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap text-left">
                                <thead>
                                    <tr>
                                        <th className="py-4 pr-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Size
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Bust (inches)
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Waist (inches)
                                        </th>
                                        <th className="py-4 pl-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Hips (inches)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["XS", "32-34", "24-26", "34-36"],
                                        ["S", "34-36", "26-28", "36-38"],
                                        ["M", "36-38", "28-30", "38-40"],
                                        ["L", "38-40", "30-32", "40-42"],
                                        ["XL", "40-42", "32-34", "42-44"],
                                    ].map(([size, bust, waist, hips]) => (
                                        <tr key={size} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-4 pr-4 font-bold text-[10px] text-black tracking-widest">{size}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{bust}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{waist}</td>
                                            <td className="py-4 pl-4 text-neutral-500 font-mono text-xs">{hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            Kids Size Chart
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap text-left">
                                <thead>
                                    <tr>
                                        <th className="py-4 pr-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Size
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Age
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Chest (inches)
                                        </th>
                                        <th className="py-4 px-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Waist (inches)
                                        </th>
                                        <th className="py-4 pl-4 font-bold text-[9px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200">
                                            Height (cm)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["2-3Y", "2-3 yrs", "21-22", "20-21", "92-98"],
                                        ["3-4Y", "3-4 yrs", "22-23", "21-22", "98-104"],
                                        ["5-6Y", "5-6 yrs", "23-24", "22-23", "110-116"],
                                        ["7-8Y", "7-8 yrs", "25-26", "23-24", "122-128"],
                                        ["9-10Y", "9-10 yrs", "27-28", "24-25", "134-140"],
                                        ["11-12Y", "11-12 yrs", "29-30", "25-26", "146-152"],
                                    ].map(([size, age, chest, waist, height]) => (
                                        <tr key={size} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-4 pr-4 font-bold text-[10px] text-black tracking-widest">{size}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{age}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{chest}</td>
                                            <td className="py-4 px-4 text-neutral-500 font-mono text-xs">{waist}</td>
                                            <td className="py-4 pl-4 text-neutral-500 font-mono text-xs">{height}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6 border-b border-neutral-200 pb-3">
                            Fit Tips
                        </h2>

                        <ul className="space-y-4">
                            {[
                                "If your measurements fall between two sizes, choose the larger size for a more relaxed fit.",
                                "For a slim fit look, choose the size closest to your measurements.",
                                "Product measurements may vary slightly depending on the style and fabric.",
                                "If you need assistance selecting a size, contact our customer support team before placing your order."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 text-xs text-neutral-500 leading-relaxed max-w-2xl">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-black shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mt-8 border-t border-neutral-200 pt-8 pb-4">
                        <h2 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-2">
                            Need Assistance?
                        </h2>
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                            If you are unsure about sizing, our Atelier support team is happy to assist. Share your exact measurements, and we will recommend the most suitable fit for your silhouette.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}