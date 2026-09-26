import { useState } from "react";
import { useGetWalletInfo, useAddMoneyToWallet, useVerifyRazorpaySignature, useWalletTransactions } from "../Hooks/user";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Plus, ShieldCheck, ArrowRight, ArrowDownLeft, ArrowUpRight, History, Clock, Sparkles } from "lucide-react";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export const Wallet = () => {

    const { data: walletInfo, refetch: refetchWallet } = useGetWalletInfo();
    const { mutateAsync: addMoneyToWallet, isPending: addMoneyPending } = useAddMoneyToWallet();
    const { mutateAsync: verifyPaymentMutation } = useVerifyRazorpaySignature();
    const { data: history } = useWalletTransactions();
    const user = useSelector((state: any) => state.auth.user);
    const [amount, setAmount] = useState<number | "">("");

    const addMoneyHandler = async () => {
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            const res = await addMoneyToWallet(Number(amount));
            const walletData = res.data;
            const rzpKey = import.meta.env.VITE_RAZORPAY_TEST_APIKEY;
            if (!rzpKey) {
                toast.error("Razorpay API key is missing. Please check your .env file and restart the server.", { duration: 3000 });
                return;
            }

            const options = {
                key: rzpKey,
                amount: walletData.order.amount,
                currency: walletData.order.currency || "INR",
                name: "Vastra Verse",
                description: "Add Money to Wallet",
                image: `${window.location.origin}/vastraverse.png`,
                order_id: walletData.order.id,
                handler: async (response: any) => {
                    try {
                        await verifyPaymentMutation({
                            amount: Number(amount),
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        setAmount("");
                        refetchWallet();
                    } catch (err: any) {
                        toast.error(err.message || "Payment verification failed", { duration: 2000 });
                    }
                },
                prefill: {
                    name: user?.name || user?.fullName,
                    email: user?.email,
                },
                theme: {
                    color: "#181818",
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled.", { duration: 3000 });
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async (response: any) => {
                toast.error(response.error.description || "Payment failed", { duration: 2000 });
            });
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", { duration: 2000 });
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/15 bg-black/[0.03] text-black/80 rounded-full text-[10px] tracking-[0.25em] uppercase font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-black/70 animate-pulse" />
                        Atelier Vault & Reserves
                    </div>
                    <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight leading-[1.1]">
                        Privilege <span className="italic font-serif font-normal">Wallet</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                        Instant priority reservations and encrypted white-glove checkout reserves.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Titanium Card & Add Funds (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8">

                        {/* Obsidian Centurion VIP Card */}
                        {walletInfo && (
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0c0d] via-[#070708] to-black text-white p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] transition-transform hover:scale-[1.01] duration-500">

                                {/* Specular edge and glow */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl pointer-events-none" />

                                <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-12">
                                    <div>
                                        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/50 block mb-1">
                                            Vault Balance
                                        </span>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-2xl font-light text-neutral-400 font-mono">₹</span>
                                            <span className="text-4xl sm:text-5xl font-mono font-medium tracking-tight text-white">
                                                {walletInfo.walletBalance?.toLocaleString('en-IN') || "0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="w-10 h-7 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-white/80" />
                                        </div>
                                        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">Tier 01</span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-0.5">Account Member</p>
                                        <p className="editorial-text text-sm sm:text-base font-light text-white tracking-wide">
                                            {user?.name || user?.fullName || "Private Client"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-0.5">Telemetry</p>
                                        <p className="text-[11px] font-mono text-white/90 flex items-center justify-end gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Active
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add Funds Form Box */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-neutral-200/80 space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-black" />
                                    </div>
                                    <h2 className="editorial-text text-base sm:text-lg font-light text-black tracking-wide">
                                        Replenish Vault
                                    </h2>
                                </div>
                                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                                    Instant Credit
                                </span>
                            </div>

                            {/* Quick Select Pills */}
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block mb-2.5">
                                    Select Nominal Amount
                                </label>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {QUICK_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmount(amt)}
                                            className={`py-3 rounded-xl text-xs font-mono font-medium transition-all duration-300 border cursor-pointer ${amount === amt
                                                ? 'bg-black text-white border-black shadow-md scale-[1.02]'
                                                : 'bg-neutral-50 text-neutral-700 border-neutral-200/80 hover:border-black/30 hover:bg-white'
                                                }`}
                                        >
                                            ₹{amt.toLocaleString('en-IN')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
                                    Or Specify Custom Value
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="font-mono text-sm text-neutral-400">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        placeholder="Enter amount (e.g. 2500)"
                                        className="w-full pl-9 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-black font-mono font-medium text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>

                            {/* Pay Action Button */}
                            <button
                                onClick={addMoneyHandler}
                                disabled={addMoneyPending || !amount || amount <= 0}
                                className={`w-full py-3.5 sm:py-4 px-2 rounded-xl font-bold uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${(addMoneyPending || !amount || amount <= 0)
                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-neutral-800 hover:shadow-xl hover:scale-[1.01]'
                                    }`}
                            >
                                {addMoneyPending ? (
                                    <>
                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                                        <span className="truncate">PROCESSING VIA GATEWAY...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="truncate">Proceed To Secure Top-Up</span>
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center sm:justify-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 pt-2 px-1 text-left sm:text-center">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 text-neutral-700 shrink-0" />
                                <span className="leading-tight">256-Bit Encrypted Payments by Razorpay</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Recent Transactions (5 Cols) */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-neutral-200/80 space-y-6">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                    <History className="w-4 h-4 text-black" />
                                </div>
                                <h2 className="editorial-text text-base sm:text-lg font-light text-black tracking-wide">
                                    Vault Ledger
                                </h2>
                            </div>
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                                Live Records
                            </span>
                        </div>

                        <div className="space-y-3">
                            {history?.data && history.data.length > 0 ? (
                                history.data.slice().reverse().map((tx: any) => (
                                    <div
                                        key={tx._id}
                                        className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 hover:bg-neutral-50 border border-neutral-200/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl border ${tx.type === 'credit' || tx.type === 'refund'
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-neutral-700 border-neutral-200'
                                                }`}>
                                                {tx.type === 'credit' || tx.type === 'refund' ? (
                                                    <ArrowDownLeft className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-mono text-xs font-medium text-black">
                                                    {tx.type === 'credit' ? 'Funds Injected' : tx.type === 'refund' ? 'Bespoke Refund' : 'Order Payment'}
                                                </p>
                                                <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`font-mono text-sm font-semibold ${tx.type === 'credit' || tx.type === 'refund' ? 'text-black' : 'text-neutral-500'
                                                }`}>
                                                {tx.type === 'credit' || tx.type === 'refund' ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                                            </p>
                                            <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-0.5 border ${(!tx.status || tx.status.toLowerCase() === 'success')
                                                ? 'bg-neutral-100 text-black border-neutral-300'
                                                : 'bg-red-50 text-red-600 border-red-200'
                                                }`}>
                                                {tx.status || 'SUCCESS'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2.5">
                                        <History className="w-4 h-4 text-neutral-400" />
                                    </div>
                                    <p className="editorial-text text-sm font-light text-black">No Recorded Activity</p>
                                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1">
                                        Replenish funds to initiate ledger
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};