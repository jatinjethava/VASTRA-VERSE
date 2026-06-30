import { useState } from "react";
import { useGetWalletInfo, useAddMoneyToWallet, useVerifyRazorpaySignature, useWalletTransactions } from "../Hooks/user";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Wallet as WalletIcon, Plus, ShieldCheck, CreditCard, ArrowRight, ArrowDownLeft, ArrowUpRight, History, Clock } from "lucide-react";
import { useRazorpay } from "react-razorpay";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export const Wallet = () => {
    const { Razorpay } = useRazorpay();
    const { data: walletInfo, refetch: refetchWallet } = useGetWalletInfo();
    const { mutateAsync: addMoneyToWallet, isPending: addMoneyPending } = useAddMoneyToWallet();
    const { mutateAsync: verifyPaymentMutation } = useVerifyRazorpaySignature();
    const { data: history } = useWalletTransactions();
    console.log("history", history);
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
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', async (response: any) => {
                toast.error(response.error.description || "Payment failed", { duration: 2000 });
            });
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", { duration: 2000 });
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-20 font-sans">
            <div className="w-full max-w-md space-y-6 sm:space-y-8">

                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 bg-gray-900 rounded-2xl shadow-xl shadow-gray-900/20">
                        <WalletIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Wallet</h1>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mt-0.5">Manage your Vastra Verse funds</p>
                    </div>
                </div>

                {walletInfo && (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 sm:p-8 shadow-2xl shadow-gray-900/30 transition-transform hover:scale-[1.02] duration-500 ease-out">

                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-10">
                            <div>
                                <p className="text-gray-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1.5 opacity-90">Available Balance</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-medium text-gray-300">₹</span>
                                    <span className="text-4xl sm:text-5xl font-black tracking-tight">
                                        {walletInfo.walletBalance?.toLocaleString('en-IN') || "0"}
                                    </span>
                                </div>
                            </div>
                            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 opacity-70" />
                        </div>

                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-gray-400 text-[9px] sm:text-[11px] font-bold tracking-widest uppercase mb-1 opacity-80">Account Holder</p>
                                <p className="text-sm sm:text-base font-semibold tracking-wide text-gray-100">{user?.name || user?.fullName || "User"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-[9px] sm:text-[11px] font-bold tracking-widest uppercase mb-1 opacity-80">Status</p>
                                <p className="text-sm sm:text-base font-semibold text-emerald-400 flex items-center justify-end gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Active
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl p-5 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500"></div>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2.5">
                        <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
                        </div>
                        Add Money
                    </h2>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                        {QUICK_AMOUNTS.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt)}
                                className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border
                                    ${amount === amt
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/30 transform scale-[1.03]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>

                    <div className="relative mb-6 sm:mb-8 group">
                        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                            <span className={`font-bold text-base sm:text-lg transition-colors duration-300 ${amount ? 'text-gray-900' : 'text-gray-400'}`}>₹</span>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Enter custom amount"
                            className="w-full pl-9 sm:pl-11 pr-4 sm:pr-5 py-3 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl text-gray-900 font-bold text-base sm:text-lg focus:bg-white focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium hover:bg-gray-100 focus:hover:bg-white"
                        />
                    </div>

                    <button
                        onClick={addMoneyHandler}
                        disabled={addMoneyPending || !amount || amount <= 0}
                        className={`w-full group relative flex items-center justify-center gap-2 py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-[15px] tracking-widest transition-all duration-300 overflow-hidden
                            ${(addMoneyPending || !amount || amount <= 0)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:bg-black hover:shadow-gray-900/40 hover:-translate-y-0.5'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {addMoneyPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    PROCEED TO PAY
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </>
                            )}
                        </span>
                    </button>

                    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-gray-500 font-semibold">
                        <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-500" />
                        100% Secure Payments by Razorpay
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative lg:mt-0">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                            <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
                        </div>
                        Recent Transactions
                    </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {history?.data && history.data.length > 0 ? (
                        history.data.slice().reverse().map((tx: any) => (
                            <div key={tx._id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`p-2.5 sm:p-3 rounded-xl ${tx.type === 'credit' || tx.type === 'refund' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.type === 'credit' || tx.type === 'refund' ? <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm sm:text-base text-gray-900">{tx.type === 'credit' ? 'Money Added' : tx.type === 'refund' ? 'Refund Received' : 'Money Deducted'}</p>
                                        <p className="text-[9px] sm:text-[11px] text-gray-500 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5 sm:mt-1">
                                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right pl-2">
                                    <p className={`font-black text-base sm:text-lg ${tx.type === 'credit' || tx.type === 'refund' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {tx.type === 'credit' || tx.type === 'refund' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                    <p className={`text-[8px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5 sm:mt-1 ${tx.status === 'success' || tx.status === 'SUCCESS' ? 'text-emerald-500' : tx.status === 'failed' || tx.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'}`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 sm:py-12 bg-gray-50/50 rounded-xl sm:rounded-2xl border border-dashed border-gray-200">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                            <p className="text-sm sm:text-base text-gray-500 font-medium">No transactions yet</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Add money to see your history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}