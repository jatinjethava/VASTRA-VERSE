export const LeftBar = () => {
    return (
        <>
            <div className="left_bar hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-zinc-50 border-r border-zinc-150">

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, #000000 0%, transparent 60%), radial-gradient(circle at 80% 20%, #52525b 0%, transparent 50%)",
                    }}
                />

                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
                        <span className="text-gray-700 text-xs font-black">T</span>
                    </div>
                    <span className="text-gray-100 font-bold text-sm tracking-widest uppercase">T-Shirt Shop</span>
                </div>

                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-100 leading-tight tracking-tight">
                        “ Premium Streetwear. <br />Uncompromised Quality. ”
                    </h1>
                    <p className="text-gray-200 max-w-sm leading-relaxed text-sm">
                        Shop our latest collections of luxury heavyweight cotton oversized T-Shirts, designed for peak comfort and modern style.
                    </p>

                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-800 shadow-md">
                            JJ
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-100">Jatin Jethava</p>
                            <p className="text-xs text-gray-200">jatin@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-6">
                    {[
                        ["100%+", "Organic Cotton"],
                        ["Express", "Delivery Across India"],
                        ["4.9★", "User Rating"],
                    ].map(([val, label]) => (
                        <div key={label}>
                            <p className="text-base font-bold text-gray-100">{val}</p>
                            <p className="text-xs text-gray-200 font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}