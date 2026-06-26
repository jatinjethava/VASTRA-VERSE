import { useState, useEffect } from "react";
import { useContact, useGetCurrentUser } from "../Hooks/user";
import '../index.css'

export const Contact = () => {

    const { data: user } = useGetCurrentUser();
    const userData = (user as any)?.data?.user;
    const { mutateAsync: contactMutate, isPending } = useContact();

    const [contact, setContact] = useState({
        name: userData?.name || "",
        email: userData?.email || "",
        message: "",
    });

    useEffect(() => {
        if (userData) {
            setContact({
                name: userData.name,
                email: userData.email,
                message: "",
            });
        }
    }, [userData]);

    const handleContact = async (e: any) => {
        e.preventDefault();
        try {
            const res = await contactMutate(contact);

            if (res.status === "success") {
                setContact({
                    name: "",
                    email: "",
                    message: "",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="w-full flex justify-center mb-12 sm:mb-14 py-6 sm:py-12">
            <div className="relative max-w-5xl w-full">

                <div className="text-center mb-10 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 relative inline-block">
                        Contact Us
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gray-600 rounded-full"></span>
                    </h1>
                    <p className="text-slate-500 mt-5 sm:mt-6 text-sm">
                        We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                {isPending && (
                    <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center bg-white/50 rounded-2xl">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:border-violet-200 transition">
                        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleContact}>
                            <div>
                                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    readOnly
                                    value={contact.name}
                                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition text-xs sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    readOnly
                                    value={contact.email}
                                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition text-xs sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Enter your message"
                                    value={contact.message}
                                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                                    rows={4}
                                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition text-xs sm:text-sm resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition mt-1 sm:mt-2 text-xs sm:text-sm"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-center gap-6 sm:gap-8 hover:border-violet-200 transition">

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">Address</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">106, Himmatnagar Hirabag Society,<br />Surat, Gujarat, 380006</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">+91 {userData?.mobileNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{userData?.email}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};