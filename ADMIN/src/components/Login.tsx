import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useLogin } from '../Hooks/auth';
import '../index.css'

export const Login = () => {

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.adminToken);
    const { mutateAsync: login, isPending } = useLogin();

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

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error("Invalid email format", {
                duration: 1500,
            });
            return;
        }

        await login(data);
    };

    useEffect(() => {
        if (token) {
            toast.success("Admin already logged in", {
                duration: 1500,
            });
            setTimeout(() => {
                navigate("/admin");
            }, 1500);
        }
    }, [dispatch, navigate]);

    return (
        <>
            <div className="relative min-h-screen bg-white flex justify-center items-center">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-sm space-y-8">

                        {isPending && (
                            <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50">
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
                        <div className='mb-2'>
                            <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">Admin Login</h1>
                            <p className="text-sm text-zinc-400 mt-1">Welcome back. Enter your credentials to access Admin Panel.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-zinc-200" />
                            <span className="text-xs text-zinc-400 font-medium">o</span>
                            <div className="flex-1 h-px bg-zinc-200" />
                        </div>

                        <form className="space-y-4" onSubmit={HandleSubmit}>

                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                name="email"
                                value={data.email}
                                onChange={HandleInput}
                            />

                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full rounded-xl bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-300 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 transition outline-none"
                                    name="password"
                                    value={data.password}
                                    onChange={HandleInput}
                                />
                                <button type="button" onClick={showPasswordHandler} className='absolute top-2.5 right-3 text-zinc-400 hover:text-zinc-600 focus:outline-none transition'>
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <button type="submit" className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-2.5 text-sm transition-all duration-300 shadow-md cursor-pointer">
                                Login
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </>

    )
}