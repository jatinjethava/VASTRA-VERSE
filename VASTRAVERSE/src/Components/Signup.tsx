import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { LeftBar } from './Leftbar';
import './CSS/Components.css';
import '../index.css';
import { register, verifyOtp, resendOtp } from '../Hooks/Auth'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../Redux/store';
import { setUser } from '../Redux/authSlice';
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin } from '../Hooks/user';
import { getCart } from '../Api/cartApi';
import { setCart } from '../Redux/cartSlice';

export const SignUp = () => {

    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const { mutateAsync: registerUser, isPending } = register();
    const { mutateAsync: verifyOtpUser, isPending: isOtpPending } = verifyOtp();
    const { mutateAsync: resendOtpUser, isPending: isResendPending } = resendOtp();
    const { mutateAsync: googleLoginUser } = useGoogleLogin();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [otpOpen, setOtpOpen] = useState<boolean>(false);
    const [registeredEmail, setRegisteredEmail] = useState<string>("");
    const [pendingToken, setPendingToken] = useState<string>("");
    const [pendingUser, setPendingUser] = useState<any>(null);

    const googleBtnRef = useRef<HTMLDivElement>(null);
    const isNewLogin = useRef(false);
    const [btnWidth, setBtnWidth] = useState(400);

    useEffect(() => {
        const updateWidth = () => {
            if (googleBtnRef.current) {
                setBtnWidth(googleBtnRef.current.offsetWidth);
            }
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        if (googleBtnRef.current) observer.observe(googleBtnRef.current);
        return () => observer.disconnect();
    }, []);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        if (token && !otpOpen && !pendingToken) {
            if (!isNewLogin.current) {
                toast.success("User already logged in", {
                    duration: 1500,
                });
            }
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [navigate, token, otpOpen, pendingToken]);

    const HandleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    }

    const showConfirmPasswordHandler = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Please fill Name , Is required", {
                duration: 1500,
            });
            return;
        }

        if (!formData.mobileNumber) {
            toast.error("Please fill Mobile No , Is required", {
                duration: 1500,
            });
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
            toast.error("Please enter a valid mobile number", {
                duration: 1500,
            });
            return;
        }

        if (!formData.email) {
            toast.error("Please fill Email , Is required", {
                duration: 1500,
            });
            return;
        }

        if (!formData.password) {
            toast.error("Please fill Password , Is required", {
                duration: 1500,
            });
            return;
        }

        if (!formData.confirmPassword) {
            toast.error("Please fill Confirm Password , Is required", {
                duration: 1500,
            });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Please enter a valid email", {
                duration: 1500,
            });
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters", {
                duration: 1500,
            });
            return;
        }

        if (!/\d/.test(formData.password)) {
            toast.error("Password must contain at least one number", {
                duration: 1500,
            });
            return;
        }

        if (!/[@$!%*?&]/.test(formData.password)) {
            toast.error("Password must contain at least one special character", {
                duration: 1500,
            });
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
            toast.error("Password must contain at least one uppercase letter", {
                duration: 1500,
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match", {
                duration: 1500,
            });
            return;
        }
        try {
            const userData = await registerUser(formData);

            if (!userData?.success) {
                toast.error("User not created", {
                    duration: 1500,
                });
                return;
            }

            toast.success("User created successfully", {
                duration: 1500,
            });

            setRegisteredEmail(formData.email);

            setPendingToken(userData.data.token);
            setPendingUser({
                name: userData.data.user.name,
                email: userData.data.user.email,
            });

            setFormData({
                name: "",
                email: "",
                password: "",
                mobileNumber: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                setOtpOpen(true);
            }, 1500);

        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "Something went wrong";
            toast.error(msg, {
                duration: 1500,
            });
        }

    }

    const [otp, setOtp] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
        otp5: "",
        otp6: ""
    })

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (value !== "" && !/^[0-9]$/.test(value)) return;

        setOtp((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (value !== "") {
            const nextSibling = e.target.nextElementSibling as HTMLInputElement | null;
            if (nextSibling) {
                nextSibling.focus();
            }
        } else {
            const previousSibling = e.target.previousElementSibling as HTMLInputElement | null;
            if (previousSibling) {
                previousSibling.focus();
            }
        }
    }

    const verifyOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const otpString = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`;

        if (otpString.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP", {
                duration: 1500,
            });
            return;
        }

        try {
            const response = await verifyOtpUser({
                email: registeredEmail,
                otp: otpString
            });

            if (!response?.success) {
                toast.error(response?.message || "OTP verification failed", {
                    duration: 1500,
                });
                return;
            }

            toast.success(response.message || "OTP Verified Successfully!", {
                duration: 1500,
            });

            if (pendingToken && pendingUser) {
                isNewLogin.current = true;
                dispatch(
                    setUser({
                        token: pendingToken,
                        user: pendingUser,
                        activeNav: ''
                    })
                );
            }

            setTimeout(() => {
                setOtpOpen(false);
                navigate("/");
            }, 1500);

        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "OTP verification failed";
            toast.error(msg, {
                duration: 1500,
            });
        }
    }

    const handleResendOTP = async () => {
        if (!registeredEmail) {
            toast.error("No registered email found", { duration: 1500 });
            return;
        }

        try {
            const response = await resendOtpUser({ email: registeredEmail });

            if (!response?.success) {
                toast.error(response?.message || "Failed to resend OTP", {
                    duration: 1500,
                });
                return;
            }

            toast.success(response.message || "OTP resent successfully!", {
                duration: 1500,
            });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "Failed to resend OTP";
            toast.error(msg, {
                duration: 1500,
            });
        }
    }

    const handleGoogleLogin = async (response: CredentialResponse) => {
        try {
            const res = await googleLoginUser(response.credential as string);
            if (res.success) {
                isNewLogin.current = true;
                dispatch(
                    setUser({
                        token: res.data.token,
                        user: {
                            name: res.data.user.name,
                            email: res.data.user.email
                        },
                        activeNav: ''
                    })
                )

                try {
                    const fetchedCart = await getCart();

                    if (fetchedCart && fetchedCart.length > 0) {
                        dispatch(setCart(fetchedCart));
                    }
                } catch (cartError) {
                    console.error("Failed to fetch cart after login:", cartError);
                }

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "Google Signup failed. Please try again.";
            toast.error(msg, {
                duration: 1500,
            });
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">

            <LeftBar />

            <div className="relative w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">

                {otpOpen && (
                    <>
                        <div className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity'></div>
                        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                            <div className='relative py-8 px-6 sm:px-8 border border-neutral-200 bg-white w-full sm:w-[420px] rounded-3xl shadow-2xl flex flex-col items-center justify-center space-y-5 overflow-hidden'>
                                
                                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl">
                                    🔐
                                </div>

                                <div className="text-center">
                                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">Security Authentication</span>
                                    <h1 className="editorial-text text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">Verify <span className="italic font-serif font-normal">Passcode</span></h1>
                                    <p className="text-xs text-neutral-500 font-light mt-1.5 max-w-xs mx-auto">Enter the 6-digit authentication code dispatched to your registered email.</p>
                                </div>

                                <div className='flex justify-center gap-2 sm:gap-2.5 w-full pt-1'>
                                    <input name="otp1" value={otp.otp1} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                    <input name="otp2" value={otp.otp2} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                    <input name="otp3" value={otp.otp3} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                    <input name="otp4" value={otp.otp4} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                    <input name="otp5" value={otp.otp5} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                    <input name="otp6" value={otp.otp6} maxLength={1} type="text" className='w-10 h-12 sm:w-11 sm:h-13 text-center outline-none border border-neutral-300 focus:border-black rounded-xl text-base sm:text-lg font-mono font-medium transition bg-neutral-50 focus:bg-white' onChange={handleOTPChange} />
                                </div>

                                <button
                                    onClick={verifyOTP}
                                    disabled={isOtpPending}
                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-black py-3 text-xs sm:text-sm text-white font-medium uppercase tracking-widest hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    {isOtpPending ? "Authenticating..." : "Authorize Passcode"}
                                </button>

                                <div className="text-xs text-neutral-500 font-light">
                                    Didn't receive the code?{" "}
                                    <button
                                        type="button"
                                        disabled={isResendPending}
                                        onClick={handleResendOTP}
                                        className="text-neutral-900 font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                                    >
                                        {isResendPending ? "Resending..." : "Resend Passcode"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 sm:pb-8 shadow-xl overflow-y-auto max-h-[85vh] custom-scrollbar space-y-3 sm:space-y-4">
                    
                    <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                    {isPending && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl">
                            <div className="dot-spinner">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-0.5">
                            Privilege Membership
                        </span>
                        <h1 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                            Create <span className="italic font-serif font-normal">Account</span>
                        </h1>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">Join the club for early access drops & exclusive privileges.</p>
                    </div>

                    <div ref={googleBtnRef} className='w-full'>
                        <GoogleLogin onSuccess={handleGoogleLogin} size='large' width={btnWidth} text="signup_with" onError={() => { toast.error("Google Signup failed"); }} />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">or continue with details</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                    </div>

                    <form className="space-y-2.5 sm:space-y-3" onSubmit={HandleSubmit}>

                        <div>
                            <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-0.5 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="jatin jethava"
                                className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none"
                                name="name"
                                value={formData.name}
                                onChange={HandleInput}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-0.5 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="client@vastraverse.com"
                                className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none"
                                name="email"
                                value={formData.email}
                                onChange={HandleInput}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-0.5 block">Mobile Number</label>
                            <input
                                type="text"
                                placeholder="9876543210"
                                className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none"
                                name="mobileNumber"
                                maxLength={10}
                                value={formData.mobileNumber}
                                onChange={HandleInput}
                            />
                        </div>

                        <div className='relative'>
                            <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-0.5 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none pr-10"
                                    name="password"
                                    value={formData.password}
                                    onChange={HandleInput}
                                />
                                <button type="button" onClick={showPasswordHandler} className='absolute top-2 right-3 text-neutral-400 hover:text-neutral-700 focus:outline-none transition text-xs sm:text-sm cursor-pointer'>{showPassword ? "🙈" : "👁️"}</button>
                            </div>
                        </div>

                        <div className='relative'>
                            <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-0.5 block">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none pr-10"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={HandleInput}
                                />
                                <button type="button" onClick={showConfirmPasswordHandler} className='absolute top-2 right-3 text-neutral-400 hover:text-neutral-700 focus:outline-none transition text-xs sm:text-sm cursor-pointer'>{showConfirmPassword ? "🙈" : "👁️"}</button>
                            </div>
                        </div>

                        <button type='submit' className="w-full rounded-full bg-black hover:bg-neutral-800 text-white font-medium py-3 text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer mt-1">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-500 font-light">
                        Already have an account?{" "}
                        <Link to="/login"
                            className="text-neutral-900 font-semibold hover:underline cursor-pointer"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}