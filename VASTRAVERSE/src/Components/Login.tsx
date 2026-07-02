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
            toast.success("User already logged in", {
                duration: 1500,
            });
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [dispatch, navigate]);

    const handleGoogleLogin = async (response: any) => {
        try {
            const res = await googleLogin(response.credential);
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
        <>
            <div className="min-h-screen bg-white flex">

                <LeftBar />

                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">
                    <div className="relative w-full max-w-sm space-y-6 sm:space-y-8">

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
                            <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">Login</h1>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Welcome back. Enter your credentials to access your account.</p>
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
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                name="email"
                                value={data.email}
                                onChange={HandleInput}
                            />

                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                    name="password"
                                    value={data.password}
                                    onChange={HandleInput}
                                />
                                <button type="button" onClick={showPasswordHandler} className='absolute top-2 sm:top-2.5 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition text-sm sm:text-base'>
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <button type="submit" className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer">
                                Login
                            </button>
                        </form>

                        <p className="text-center text-xs text-zinc-500">
                            Don't have an account?{" "}
                            <Link to="/signup"
                                className="text-zinc-800 font-bold hover:underline cursor-pointer"
                            >
                                Sign Up
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </>

    )
}