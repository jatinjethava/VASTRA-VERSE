import { toast } from "sonner";
import { useChangePassword, useGetCurrentUser } from "../../Hooks/user";
import { useState } from "react";
import { LoginActivity } from "./LoginActivity";
import '../../index.css';
import { SessionActivity } from "./sessionActivity";

export const Security = () => {

    const { data: user } = useGetCurrentUser();
    const { mutateAsync: changeUserPassword } = useChangePassword();
    const userData = (user as any)?.data?.user;

    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const [openLoginActivity, setOpenLoginActivity] = useState<boolean>(false);
    const [openSessionActivity, setOpenSessionActivity] = useState<boolean>(false);
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const showCurrentPasswordHandler = () => {
        setShowCurrentPassword((prev) => !prev)
    }
    const showNewPasswordHandler = () => {
        setShowNewPassword((prev) => !prev)
    }
    const showConfirmPasswordHandler = () => {
        setShowConfirmPassword((prev) => !prev)
    }

    const changePassword = async () => {

        if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
            toast.error("All fields are required", {
                duration: 1500,
            });
            return;
        }

        if (password.newPassword !== password.confirmPassword) {
            toast.error("newPassword and confirmPassword do not match", {
                duration: 1500,
            });
            return;
        }

        if (password.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters", {
                duration: 1500,
            });
            return;
        }

        const payload = {
            email: userData?.email,
            oldPassword: password.oldPassword,
            newPassword: password.newPassword,
            confirmPassword: password.confirmPassword
        };
        console.log(payload);

        try {
            await changeUserPassword(payload);
            setOpenChangePassword(false);
            setPassword({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#fafafa] min-h-screen text-neutral-900">
                <div className="max-w-5xl mx-auto space-y-8">

                    
                    <div className="bg-[#0a0a0b] text-white border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
                        
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Vault Security Protocol
                                </div>
                                <h1 className="editorial-text text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.15]">
                                    Atelier Vault & <br className="hidden sm:inline" />
                                    <span className="italic font-serif font-normal text-white/90">Credential Security</span>
                                </h1>
                                <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                                    Protect your client dossier with cryptographic credential encryption, multi-point access telemetry, and live session governance.
                                </p>
                            </div>

                            <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-inner">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                                    Status: Protected
                                </span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.75}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Vault Passphrase
                                    </span>
                                    <h3 className="text-lg font-medium text-neutral-900 tracking-tight">
                                        Password Protocol
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 leading-relaxed">
                                        Rotate your master passphrase to maintain fortified defense against unauthorized dossier access.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpenChangePassword(true)}
                                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs font-semibold uppercase tracking-widest shadow-sm cursor-pointer"
                            >
                                Update Passphrase
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>

                        
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center transition-transform group-hover:scale-105 border border-neutral-200/60">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.75}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Access Telemetry
                                    </span>
                                    <h3 className="text-lg font-medium text-neutral-900 tracking-tight">
                                        Login History
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 leading-relaxed">
                                        Inspect recognized IP points, client browsers, and geographical timestamps across sessions.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpenLoginActivity(true)}
                                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-neutral-900 border border-neutral-300 rounded-full hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs font-semibold uppercase tracking-widest shadow-sm cursor-pointer"
                            >
                                Audit Telemetry
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>

                        
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center transition-transform group-hover:scale-105 border border-neutral-200/60">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.75}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Token Concurrency
                                    </span>
                                    <h3 className="text-lg font-medium text-neutral-900 tracking-tight">
                                        Active Sessions
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 leading-relaxed">
                                        Review currently authenticated client tokens and terminate unrecognized devices instantly.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpenSessionActivity(true)}
                                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-neutral-900 border border-neutral-300 rounded-full hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs font-semibold uppercase tracking-widest shadow-sm cursor-pointer"
                            >
                                Manage Sessions
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                
                {openChangePassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
                            onClick={() => setOpenChangePassword(false)}
                        />

                        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all border border-neutral-200 overflow-hidden z-10">
                            
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-900/20 to-transparent" />

                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                                        Vault Re-Encryption
                                    </span>
                                    <h2 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                                        Update <span className="italic font-serif font-normal">Passphrase</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setOpenChangePassword(false)}
                                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <div className="mb-6 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </div>
                                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                                    Securing identity for <span className="font-semibold text-neutral-900">{userData?.email || "Current Client"}</span>. Select a distinct passphrase of at least 6 characters.
                                </p>
                            </div>

                            <form className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700" htmlFor="oldPassword">
                                        Current Passphrase
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="oldPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={password.oldPassword}
                                            onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                                            placeholder="Enter your current passphrase"
                                            className="w-full px-4 py-3.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 font-light"
                                        />
                                        <button
                                            type="button"
                                            onClick={showCurrentPasswordHandler}
                                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors px-1"
                                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                        >
                                            {showCurrentPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700" htmlFor="newPassword">
                                        New Passphrase
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={password.newPassword}
                                            onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                            placeholder="Enter new master passphrase"
                                            className="w-full px-4 py-3.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 font-light"
                                        />
                                        <button
                                            type="button"
                                            onClick={showNewPasswordHandler}
                                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors px-1"
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700" htmlFor="confirmPassword">
                                        Confirm Passphrase
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={password.confirmPassword}
                                            onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                            placeholder="Confirm new passphrase"
                                            className="w-full px-4 py-3.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 font-light"
                                        />
                                        <button
                                            type="button"
                                            onClick={showConfirmPasswordHandler}
                                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none transition-colors px-1"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={changePassword}
                                    type="button"
                                    className="w-full mt-4 bg-neutral-900 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-md cursor-pointer"
                                >
                                    Confirm Passphrase Change
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {openLoginActivity && (
                    <LoginActivity setOpenLoginActivity={setOpenLoginActivity} />
                )}

                {openSessionActivity && (
                    <SessionActivity setOpenSessionActivity={setOpenSessionActivity} />
                )}
            </div>
        </>
    );
};

