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
            <div className="px-4 sm:px-6 py-6 sm:py-10 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4 shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01M5 12a7 7 0 1114 0c0 5-7 9-7 9s-7-4-7-9z"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Manage Security
                            </h1>

                            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
                                Protect your account by updating your password regularly and
                                reviewing your security settings.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                            Password Settings
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 sm:mb-6">
                            Change your password to keep your account secure.
                        </p>
                        <button
                            onClick={() => setOpenChangePassword(true)}
                            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:opacity-90 transition-opacity text-xs sm:text-sm font-bold uppercase tracking-wide shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6l-5 2.5a2 2 0 01-2 0L6 13a6 6 0 01-6-6V6a2 2 0 012-2h16a2 2 0 012 2v1z"
                                />
                            </svg>
                            Change Password
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                            Login Activity
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 sm:mb-6">
                            Review your recent login sessions across different devices and browsers.
                        </p>
                        <button
                            onClick={() => setOpenLoginActivity(true)}
                            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:opacity-90 transition-opacity text-xs sm:text-sm font-bold uppercase tracking-wide shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Show Login Activity
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                            Session Activity
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 sm:mb-6">
                            Review your recent active sessions.
                        </p>
                        <button
                            onClick={() => setOpenSessionActivity(true)}
                            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:opacity-90 transition-opacity text-xs sm:text-sm font-bold uppercase tracking-wide shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Show Session Activity
                        </button>
                    </div>
                </div>

                {openChangePassword && (
                    <div className="animate-fade-in-up-delay-1 fixed inset-0 z-50 flex items-center justify-center p-4">

                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        ></div>

                        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 sm:p-8 transform transition-all">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Change Password</h2>
                                <button
                                    onClick={() => setOpenChangePassword(false)}
                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-[12px] text-center tracking-widest text-gray-500 mb-4 sm:mb-5 font-semibold border border-gray-200 p-2 rounded-xl shadow-sm">Update your <span className="text-gray-900 font-bold">{userData?.email}</span> password to keep your account secure. Choose a strong password that you don't use elsewhere.</p>

                            <form className="space-y-4 sm:space-y-5">
                                <div className="relative">
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5" htmlFor="oldPassword">Old Password</label>
                                    <input
                                        id="oldPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={password.oldPassword}
                                        onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                                        placeholder="Enter your old password"
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button type="button" onClick={showCurrentPasswordHandler} className='absolute top-8 sm:top-10 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition'>
                                        {showCurrentPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5" htmlFor="newPassword">New Password</label>
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={password.newPassword}
                                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                        placeholder="Enter your new password"
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button type="button" onClick={showNewPasswordHandler} className='absolute top-8 sm:top-10 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition'>
                                        {showNewPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={password.confirmPassword}
                                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                        placeholder="Confirm your new password"
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button type="button" onClick={showConfirmPasswordHandler} className='absolute top-8 sm:top-10 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition'>
                                        {showConfirmPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                <button
                                    onClick={changePassword}
                                    type="button"
                                    className="w-full mt-2 bg-gray-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 sm:py-3.5 rounded-xl hover:bg-gray-800 hover:shadow-lg transform active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    Update Password
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
