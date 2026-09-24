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
        <div className="w-full flex justify-center py-10 sm:py-16 px-4 bg-[#fafafa]">
            <div className="relative max-w-5xl w-full">

                <div className="text-center mb-10 sm:mb-14">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                        Direct Line & Atelier Inquiry
                    </span>
                    <h1 className="editorial-text text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight">
                        Concierge <span className="italic font-serif font-normal">Liaison</span>
                    </h1>
                    <p className="text-neutral-500 mt-2 text-xs sm:text-sm font-light max-w-md mx-auto">
                        Private communications with our bespoke tailoring concierges, curatorial staff, and master artisans.
                    </p>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="relative bg-white border border-neutral-200/80 p-7 sm:p-9 rounded-3xl shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                        <div className="mb-6">
                            <h2 className="editorial-text text-xl font-light text-neutral-900 tracking-tight">Transmit <span className="italic font-serif font-normal">Dispatch</span></h2>
                            <p className="text-xs text-neutral-500 font-light mt-0.5">Expect discreet responses within 2 to 4 business hours.</p>
                        </div>

                        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleContact}>
                            <div>
                                <label htmlFor="name" className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Client Designation</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    readOnly
                                    value={contact.name}
                                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-black transition text-xs sm:text-sm text-neutral-900 font-medium placeholder:text-neutral-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Registered Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    readOnly
                                    value={contact.email}
                                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-black transition text-xs sm:text-sm text-neutral-900 font-medium placeholder:text-neutral-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">Dispatch Inquiry</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Describe your inquiry, sizing query, or bespoke reservation request..."
                                    value={contact.message}
                                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-black transition text-xs sm:text-sm text-neutral-900 font-normal placeholder:text-neutral-400 resize-none leading-relaxed"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-medium rounded-full transition mt-2 text-xs uppercase tracking-widest shadow-md cursor-pointer"
                            >
                                Dispatch Communication
                            </button>
                        </form>
                    </div>

                    <div className="relative bg-white border border-neutral-200/80 p-5 sm:p-8 lg:p-12 rounded-3xl shadow-sm flex flex-col justify-center gap-6 sm:gap-10 overflow-hidden">
                        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                        <div className="flex items-start sm:items-center gap-3 sm:gap-6 group">
                            <div className="w-12 h-12 shrink-0 sm:w-16 sm:h-16 bg-[#f7f7f7] border border-neutral-200/60 text-neutral-800 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm mt-0.5 sm:mt-0">
                                <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Headquarters & Atelier</span>
                                <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-1.5 text-xs sm:text-base uppercase tracking-wide truncate">Surat Haute Atelier</h3>
                                <p className="text-[10px] sm:text-sm text-neutral-500 font-light leading-relaxed">106, Himmatnagar Hirabag Society, Surat, Gujarat, 380006</p>
                            </div>
                        </div>

                        <div className="flex items-start sm:items-center gap-3 sm:gap-6 group">
                            <div className="w-12 h-12 shrink-0 sm:w-16 sm:h-16 bg-[#f7f7f7] border border-neutral-200/60 text-neutral-800 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm mt-0.5 sm:mt-0">
                                <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Concierge Telephony</span>
                                <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-1.5 text-xs sm:text-base uppercase tracking-wide truncate">Private Patron Line</h3>
                                <p className="text-[10px] sm:text-sm text-neutral-500 font-mono truncate">+91 {userData?.mobileNumber || "8160082638"}</p>
                            </div>
                        </div>

                        <div className="flex items-start sm:items-center gap-3 sm:gap-6 group">
                            <div className="w-12 h-12 shrink-0 sm:w-16 sm:h-16 bg-[#f7f7f7] border border-neutral-200/60 text-neutral-800 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm mt-0.5 sm:mt-0">
                                <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Electronic Dispatch</span>
                                <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-1.5 text-xs sm:text-base uppercase tracking-wide truncate">Concierge Desk</h3>
                                <p className="text-[10px] sm:text-sm text-neutral-500 font-mono truncate">{userData?.email || "jatinjethava3125@gmail.com"}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};