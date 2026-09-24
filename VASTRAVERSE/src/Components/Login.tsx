import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { LeftBar } from './Leftbar';
import { Login as LoginHook } from '../Hooks/Auth';
import { getCart } from '../Api/cartApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/authSlice';
import type { RootState } from '../Redux/store';
import { setCart } from '../Redux/cartSlice';
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from '../Hooks/user';
import '../index.css'

export const Login = () => {

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const { mutateAsync: login, isPending } = LoginHook();
    const { mutateAsync: googleLogin } = useGoogleLogin();

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

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    }

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const HandleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.email) {
            toast.error("Email is required", {
                duration: 1500,
            });
            return;
        }

        if (!data.password) {
            toast.error("Password is required", {
                duration: 1500,
            });
            return;
        }

        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters", {
                duration: 1500,
            });
            return;
        }

        if (!/\d/.test(data.password)) {
            toast.error("Password must contain at least one number", {
                duration: 1500,
            });
            return;
        }

        if (!/[@$!%*?&]/.test(data.password)) {
            toast.error("Password must contain at least one special character", {
                duration: 1500,
            });
            return;
        }

        if (!/[A-Z]/.test(data.password)) {
            toast.error("Password must contain at least one uppercase letter", {
                duration: 1500,
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error("Invalid email format", {
                duration: 1500,
            });
            return;
        }

        try {
            const result = await login(data);

            if (result.success === false) {
                toast.error("Something Issuse In Frontend", {
                    duration: 1500,
                });
                return;
            }

            toast.success(result.message, {
                duration: 1500,
            });

            isNewLogin.current = true;
            dispatch(
                setUser({
                    token: result.data.token,
                    user: {
                        name: result.data.user.name,
                        email: result.data.user.email
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

        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "Login failed. Please try again.";
            toast.error(msg, {
                duration: 1500,
            });
        }
    };

    useEffect(() => {
        if (token) {
            if (!isNewLogin.current) {
                toast.success("User already logged in", {
                    duration: 1500,
                });
            }
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [dispatch, navigate, token]);

    const handleGoogleLogin = async (response: any) => {
        try {
            const res = await googleLogin(response.credential);
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
            const msg = err.response?.data?.message || "Login failed. Please try again.";
            toast.error(msg, {
                duration: 1500,
            });
        }
    }

    return (
        <>
            <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">

                <LeftBar />

                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">
                    <div className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 p-7 sm:p-10 shadow-xl overflow-hidden space-y-6 sm:space-y-7">

                        {/* Top specular hairline */}
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
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                                Client Portal
                            </span>
                            <h1 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                                Atelier <span className="italic font-serif font-normal">Access</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">Welcome back. Enter your credentials to access your account.</p>
                        </div>

                        <div ref={googleBtnRef} className='w-full'>
                            <GoogleLogin onSuccess={handleGoogleLogin} size='large' width={btnWidth} onError={() => { toast.error("Google Login failed"); }} />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-neutral-200" />
                            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">or continue with email</span>
                            <div className="flex-1 h-px bg-neutral-200" />
                        </div>

                        <form className="space-y-4" onSubmit={HandleSubmit}>

                            <div>
                                <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="client@vastraverse.com"
                                    className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-4 py-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none"
                                    name="email"
                                    value={data.email}
                                    onChange={HandleInput}
                                />
                            </div>

                            <div className='relative'>
                                <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-black px-4 py-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 font-medium transition outline-none pr-10"
                                        name="password"
                                        value={data.password}
                                        onChange={HandleInput}
                                    />
                                    <button type="button" onClick={showPasswordHandler} className='absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 focus:outline-none transition text-sm cursor-pointer' aria-label="Toggle password visibility">
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-full rounded-full bg-black hover:bg-neutral-800 text-white font-medium py-3.5 text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-lg shadow-black/10 hover:scale-[1.01] cursor-pointer">
                                Sign In to Atelier
                            </button>
                        </form>

                        <p className="text-center text-xs text-neutral-500 font-light">
                            Don't have an account?{" "}
                            <Link to="/signup"
                                className="text-neutral-900 font-medium hover:underline underline-offset-4 cursor-pointer"
                            >
                                Register Now
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </>

    )
}