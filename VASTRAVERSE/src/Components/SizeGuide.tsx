import React from "react"
import { IoClose } from "react-icons/io5"

export const SizeGuide = ({
    setShowSizeChart
}: {
    setShowSizeChart: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSizeChart(false)}
        >
            <div
                className="relative w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.25s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="sticky top-0 bg-white z-20 px-4 py-4 sm:px-6 md:px-10 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        Size Guide
                    </h1>
                    <button
                        onClick={() => setShowSizeChart(false)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all duration-200 cursor-pointer shrink-0"
                        aria-label="Close size guide"
                    >
                        <IoClose className="text-lg sm:text-xl" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 md:p-10 pt-4 sm:pt-6 md:pt-6">
                    <p className="text-gray-500 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
                        Finding the right fit is important for comfort and style.
                        Use the size chart below to choose the best size for your
                        clothing.
                    </p>


                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">📏</span> How to Measure
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {[
                                {
                                    title: "Chest",
                                    desc: "Measure around the fullest part of your chest, keeping the measuring tape level and comfortable."
                                },
                                {
                                    title: "Waist",
                                    desc: "Measure around your natural waistline, usually just above your belly button."
                                },
                                {
                                    title: "Hips",
                                    desc: "Measure around the fullest part of your hips while standing with your feet together."
                                },
                                {
                                    title: "Shoulder",
                                    desc: "Measure from the edge of one shoulder to the edge of the other across your back."
                                }
                            ].map((item) => (
                                <div key={item.title} className="p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                            <div className="p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl md:col-span-2">
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                    Length
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                    Measure from the highest point of the shoulder
                                    down to the desired garment length.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">👕</span> Men's T-Shirt Size Chart
                        </h2>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Size
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Chest (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
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
                                    ].map(([size, chest, length], i) => (
                                        <tr key={size} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900">{size}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{chest}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">👔</span> Men's Shirt Size Chart
                        </h2>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Size
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Chest (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Shoulder (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
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
                                    ].map(([size, chest, shoulder, length], i) => (
                                        <tr key={size} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900">{size}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{chest}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">
                                                {shoulder}
                                            </td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">👗</span> Women's Size Chart
                        </h2>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Size
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Bust (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Waist (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
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
                                    ].map(([size, bust, waist, hips], i) => (
                                        <tr key={size} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900">{size}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{bust}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{waist}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">🧒</span> Kids Size Chart
                        </h2>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Size
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Age
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Chest (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
                                            Waist (inches)
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold">
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
                                    ].map(([size, age, chest, waist, height], i) => (
                                        <tr key={size} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900">{size}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{age}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{chest}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{waist}</td>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600">{height}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-10">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="text-base sm:text-lg">💡</span> Fit Tips
                        </h2>

                        <ul className="space-y-2.5 sm:space-y-3">
                            {[
                                "If your measurements fall between two sizes, choose the larger size for a more relaxed fit.",
                                "For a slim fit look, choose the size closest to your measurements.",
                                "Product measurements may vary slightly depending on the style and fabric.",
                                "If you need assistance selecting a size, contact our customer support team before placing your order."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 flex items-center gap-2">
                            <span>🤝</span> Need Help?
                        </h2>

                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                            If you're unsure about sizing, our support team is happy
                            to help. Share your measurements, and we'll recommend
                            the most suitable size for you.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}