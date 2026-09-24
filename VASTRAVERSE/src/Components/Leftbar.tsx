export const LeftBar = () => {
    return (
        <>
            <div className="left_bar hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-16 bg-[#0a0a0b] text-white border-r border-white/10">

                {/* Ambient glow and subtle texture */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 40%, #ffffff 0%, transparent 60%), radial-gradient(circle at 80% 80%, #ffffff 0%, transparent 50%)",
                    }}
                />
                
                {/* Top specular hairline */}
                <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-lg font-black text-xs tracking-tighter">
                        VV
                    </div>
                    <div>
                        <span className="text-white font-medium text-xs tracking-[0.25em] uppercase block">VASTRAVERSE</span>
                        <span className="text-[9px] text-white/40 tracking-[0.2em] uppercase font-light">Haute Atelier</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-5 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Privileged Member Access
                    </div>
                    <h1 className="editorial-text text-3xl xl:text-4xl font-light text-white leading-[1.2] tracking-tight">
                        “ Bespoke Silhouettes. <br />
                        <span className="italic font-serif font-normal">Uncompromised Luxury.</span> ”
                    </h1>
                    <p className="text-white/60 leading-relaxed text-xs xl:text-sm font-light">
                        Step into our digital atelier. Discover curated collections of luxury heavyweight cottons, minimalist streetwear, and tailoring crafted for distinction.
                    </p>

                    <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-medium text-white shadow-md">
                            JJ
                        </div>
                        <div>
                            <p className="text-xs font-medium text-white tracking-wide">Jatin Jethava</p>
                            <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Founder & Creative Director</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap gap-8 pt-6 border-t border-white/10">
                    {[
                        ["100%", "Pure Organic Heavyweight"],
                        ["Expedited", "White-Glove Delivery"],
                        ["4.9★", "Client Excellence Score"],
                    ].map(([val, label]) => (
                        <div key={label}>
                            <p className="editorial-text text-lg font-light text-white tracking-tight">{val}</p>
                            <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">{label}</p>
                        </div>
                    ))}
                </div>
            </div >
        </>
    )
}