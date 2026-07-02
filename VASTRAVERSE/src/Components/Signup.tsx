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
            toast.success("User already logged in", {
                duration: 1500,
            });
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
            const msg = err.response?.data?.message || "Login failed. Please try again.";
            toast.error(msg, {
                duration: 1500,
            });
        }
    }

    return (
        <div className="min-h-screen bg-white flex">

            <LeftBar />

            <div className="relative w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">

                {otpOpen && (
                    <>
                        <div className='h-full absolute top-0 bottom-0 left-0 right-0 inset-0 z-30 bg-black/50'></div>
                        <div className='h-full absolute top-0 bottom-0 z-100 left-0 right-0 flex items-center justify-center p-4'>
                            <div className='py-6 sm:py-7 border border-zinc-300 bg-white w-full sm:w-96 px-4 sm:px-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4'>
                                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Verify OTP</h1>
                                <p className="text-xs sm:text-sm text-center text-zinc-400 mt-1">Enter the OTP sent to your email for verification that why we are enhance security of your account.</p>
                                <div className='flex justify-center gap-1.5 sm:gap-3 w-full'>
                                    <input name="otp1" value={otp.otp1} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                    <input name="otp2" value={otp.otp2} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                    <input name="otp3" value={otp.otp3} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                    <input name="otp4" value={otp.otp4} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                    <input name="otp5" value={otp.otp5} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                    <input name="otp6" value={otp.otp6} maxLength={1} type="text" className='w-9 h-10 sm:w-10 sm:h-10 text-center outline-none border border-zinc-400 rounded-lg text-sm sm:text-base' onChange={handleOTPChange} />
                                </div>
                                <button
                                    onClick={verifyOTP}
                                    disabled={isOtpPending}
                                    className="w-full sm:w-48 flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-700 font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isOtpPending ? "Verifying..." : "Verify OTP"}
                                </button>
                                <div className="text-xs text-zinc-500">
                                    Didn't receive the code?{" "}
                                    <button
                                        type="button"
                                        disabled={isResendPending}
                                        onClick={handleResendOTP}
                                        className="text-zinc-800 font-bold hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                                    >
                                        {isResendPending ? "Resending..." : "Resend OTP"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="relative w-full max-w-sm space-y-8">

                    {isPending && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
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
                        <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">Create your account</h1>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">Join the club for early access drops & exclusive gifts.</p>
                    </div>

                    <div ref={googleBtnRef} className='w-full'>
                        <GoogleLogin onSuccess={handleGoogleLogin} size='large' width={btnWidth} onError={() => { toast.error("Google Login failed"); }} />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className="text-xs text-zinc-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                    </div>

                    <form className="space-y-3 sm:space-y-4" onSubmit={HandleSubmit}>

                        <input
                            type="text"
                            placeholder="Full name"
                            className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                            name="name"
                            value={formData.name}
                            onChange={HandleInput}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                            name="email"
                            value={formData.email}
                            onChange={HandleInput}
                        />

                        <input
                            type="text"
                            placeholder="Mobile No"
                            className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                            name="mobileNumber"
                            maxLength={10}
                            value={formData.mobileNumber}
                            onChange={HandleInput}
                        />

                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                name="password"
                                value={formData.password}
                                onChange={HandleInput}
                            />
                            <button type="button" onClick={showPasswordHandler} className='absolute top-2 sm:top-2.5 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition text-xs sm:text-sm'>{showPassword ? "🙈" : "👁️"}</button>
                        </div>

                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={HandleInput}
                            />
                            <button type="button" onClick={showConfirmPasswordHandler} className='absolute top-2 sm:top-2.5 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition text-xs sm:text-sm'>{showConfirmPassword ? "🙈" : "👁️"}</button>
                        </div>

                        <button type='submit' className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-2.5 text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer">
                            Create account
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-500">
                        Already have an account?{" "}
                        <Link to="/login"
                            className="text-zinc-800 font-bold hover:underline cursor-pointer"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div >
    );
}