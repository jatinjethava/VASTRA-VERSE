import { useNavigate, useLocation } from "react-router";
import { useDeleteBlog, useFetchUserBlog } from "../Hooks/blog";
import type { IBlog } from "../Api/blogApi";
import { Eye, Edit2, Trash2, Plus, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { ShowBlog } from "../Components/ShowBlog";
import { useDeleteAddress, useGetAllAddresses, useGetCurrentUser, useSetDefaultAddress } from "../Hooks/user";
import { UpdateUser } from "../Components/UpdateUser";
import { Address } from "../Components/SetAddress";

export const Profile = () => {

    const { data: user } = useGetCurrentUser();
    const userData = (user as any)?.data?.user;
    const { data: userBlog, isPending } = useFetchUserBlog();
    const { mutate: deleteBlog } = useDeleteBlog();
    const { data: address } = useGetAllAddresses();
    const { mutate: deleteAddress } = useDeleteAddress();
    const { mutate: defaultAddress } = useSetDefaultAddress();

    const navigate = useNavigate();
    const location = useLocation();
    const [showBlog, setShowBlog] = useState(false);
    const [SelectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
    const [editProfile, setEditProfile] = useState<boolean>(false)
    const [openAddressModel, setOpenAddressModel] = useState<boolean>(false)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    useEffect(() => {
        const state = location.state as { openAddressForm?: boolean; addressLabel?: string } | null;
        if (state?.openAddressForm) {
            setIsUpdating(false);
            setSelectedAddress(state.addressLabel ? { label: state.addressLabel } : null);
            setOpenAddressModel(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:py-12 md:px-8 lg:px-12">

            
            <div className="max-w-7xl mx-auto bg-black text-white rounded-none border border-black p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">

                
                <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-none blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="relative group shrink-0 z-10">
                    <div className="h-24 w-24 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-none overflow-hidden border border-white/20 p-1 bg-white/5">
                        <img
                            src={userData?.profileImage ? `${userData.profileImage}` : `https://ui-avatars.com/api/?name=${userData?.name || userData?.fullName || 'User'}&background=151515&color=ffffff`}
                            alt={userData?.name || userData?.fullName || "User"}
                            className="h-full w-full object-cover rounded-none transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=151515&color=ffffff' }}
                        />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-5 z-10">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-semibold tracking-[0.25em] text-white/50 uppercase">
                                Privileged Client Dossier
                            </span>
                        </div>
                        <h1 className="editorial-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-2 capitalize">
                            {userData?.name || userData?.fullName || "Distinguished Guest"}
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm font-light flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="tracking-wide">{userData?.email || "guest@vastraverse.com"}</span>
                            {userData?.isEmailVerified && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-semibold uppercase tracking-widest border border-white/15 backdrop-blur-sm">
                                    Verified
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-1">
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white/80 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {userData?.mobileNumber || "No Phone Registered"}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white/80 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Patron Since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recent"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center md:h-44 gap-3 mt-4 md:mt-0 md:ml-auto w-full sm:w-auto z-10">
                    <button
                        onClick={() => { setEditProfile(true) }}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-[0.15em] rounded-none transition-all duration-200 cursor-pointer w-full sm:w-auto"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                </div>

            </div>


            
            <div className="mx-auto my-12 sm:my-16 max-w-7xl">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                            Client Directory
                        </span>
                        <h2 className="editorial-text text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
                            Saved <span className="italic font-serif font-normal">Destinations</span>
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-light">
                            Manage and select your preferred global delivery addresses.
                        </p>
                    </div>

                    <button
                        onClick={() => { setIsUpdating(false); setSelectedAddress(null); setOpenAddressModel(true) }}
                        className="group w-fit flex items-center justify-center gap-2 rounded-none bg-black border border-black hover:bg-white hover:text-black px-6 py-3 text-[10px] font-bold text-white transition-all cursor-pointer uppercase tracking-[0.15em]"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        <span>Add Destination</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
                    {address?.length === 0 && (
                        <div className="col-span-full py-16 text-center text-neutral-500 bg-white rounded-none border border-dashed border-neutral-300">
                            <p className="editorial-text text-lg text-neutral-900 mb-1">No delivery addresses logged</p>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Add a shipping destination to enjoy expedited atelier checkout.</p>
                        </div>
                    )}
                    {address?.map((item: any) => (
                        <div key={item._id} className="relative flex flex-col rounded-none border border-neutral-200 bg-white p-6 sm:p-7 shadow-none transition-all duration-300 hover:border-black">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold text-neutral-900 uppercase tracking-widest">
                                    {item.label || "Home"}
                                </span>
                                {item?.isDefault ? (
                                    <span className="text-[10px] font-bold text-neutral-900 flex items-center gap-1.5 bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                        Default
                                    </span>
                                ) : (
                                    <button onClick={() => defaultAddress(item._id)} className="text-neutral-400 hover:text-black px-2 py-1 text-[11px] font-medium hover:underline hover:underline-offset-4 tracking-wider transition-colors cursor-pointer uppercase">
                                        Set Default
                                    </button>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="space-y-1.5 mt-2 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                                    <p className="font-normal text-neutral-900">{item.addressLine1}</p>
                                    {item.addressLine2 && <p>{item.addressLine2}</p>}
                                    <p>{item.city}, {item.state} — {item.pincode}</p>
                                    <p className="text-neutral-400 uppercase text-[11px] tracking-wider pt-0.5">{item.country}</p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-neutral-100">
                                    <p className="text-xs font-medium text-neutral-700 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {userData?.mobileNumber || "No Phone"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2.5">
                                <button
                                    onClick={() => { setIsUpdating(true); setSelectedAddress(item); setOpenAddressModel(true); }}
                                    className="flex-1 cursor-pointer rounded-none border border-neutral-200 hover:border-black px-4 py-2 text-[10px] font-bold text-black transition-all uppercase tracking-[0.15em]"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { deleteAddress(item._id) }}
                                    className="flex-1 cursor-pointer rounded-none border border-neutral-200 hover:border-red-500 hover:text-red-500 px-4 py-2 text-[10px] font-bold text-neutral-400 transition-all uppercase tracking-[0.15em]"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            
            <div className="my-12 sm:my-16 max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />


            
            <div className="mx-auto max-w-7xl mb-16">

                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                            Member Studio
                        </span>
                        <h2 className="editorial-text text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
                            Atelier <span className="italic font-serif font-normal">Journal & Stories</span>
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-light">
                            Manage your published editorial essays and creative drafts.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/blogs/write')}
                        className="group w-fit flex items-center justify-center gap-2 rounded-none bg-black border border-black hover:bg-white hover:text-black px-6 py-3 text-[10px] font-bold text-white transition-all cursor-pointer uppercase tracking-[0.15em]"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        <span>Compose Article</span>
                    </button>
                </div>

                {isPending && (
                    <div className="flex min-h-[30vh] items-center justify-center">
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

                {!isPending && userBlog?.data.blog.length === 0 && (
                    <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-none border border-dashed border-neutral-300 bg-white p-8 text-center shadow-none">
                        <div className="mb-4 rounded-none border border-neutral-200 p-4 text-neutral-800">
                            <BookOpen className="h-7 w-7" />
                        </div>
                        <h3 className="editorial-text text-xl font-light text-neutral-900 mb-1">No editorial articles yet</h3>
                        <p className="mb-6 max-w-sm text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            Share your perspectives on luxury style, tailoring aesthetics, and fashion commentary.
                        </p>
                        <button
                            onClick={() => navigate('/blogs/write')}
                            className="rounded-none bg-black border border-black hover:bg-white hover:text-black px-7 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-none transition-colors cursor-pointer"
                        >
                            Publish First Article
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userBlog?.data.blog.map((blog: IBlog) => (
                        <article
                            key={blog._id}
                            className="group flex h-full flex-col overflow-hidden rounded-none bg-white shadow-none border border-neutral-200 transition-all duration-300 hover:border-black"
                        >
                            <div className="relative h-60 w-full overflow-hidden shrink-0 bg-neutral-100">
                                <img
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

                                <span
                                    className={`absolute right-3 top-3 rounded-none px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-md ${blog.status === "published"
                                        ? "bg-black/90 text-white border border-black"
                                        : "bg-white/90 text-black border border-white"
                                        }`}
                                >
                                    {blog.status}
                                </span>

                                <button
                                    onClick={() => {
                                        setShowBlog(true);
                                        setSelectedBlog(blog);
                                    }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-none bg-black/80 border border-black p-4 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-black group-hover:scale-100 group-hover:opacity-100 cursor-pointer"
                                    title="Preview"
                                >
                                    <Eye className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                                <div className="mb-4 flex items-center justify-between text-xs text-neutral-400">
                                    <span className="rounded-none border border-neutral-200 bg-neutral-50 px-3 py-1 font-bold text-black text-[9px] uppercase tracking-widest">
                                        {blog.category}
                                    </span>
                                    <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-400">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <h2 className="editorial-text mb-2 line-clamp-2 text-base sm:text-lg font-light text-neutral-900 transition-colors group-hover:text-neutral-600">
                                    {blog.title}
                                </h2>

                                {blog.subTitle && (
                                    <p className="mb-2 line-clamp-1 text-xs font-serif italic text-neutral-500">
                                        {blog.subTitle}
                                    </p>
                                )}

                                <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-neutral-500 font-light">
                                    {blog.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                                        <Eye className="h-3.5 w-3.5" />
                                        {blog.views || 0}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                navigate('/blogs/write', { state: { blog, edit: true } });
                                            }}
                                            className="flex h-8 w-8 items-center justify-center rounded-none bg-neutral-100 border border-neutral-200 hover:border-black hover:bg-black text-neutral-600 hover:text-white transition-all cursor-pointer"
                                            title="Edit Blog"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => deleteBlog(blog._id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-none bg-neutral-100 border border-neutral-200 hover:border-rose-600 hover:bg-rose-600 text-neutral-600 hover:text-white transition-all cursor-pointer"
                                            title="Delete Blog"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {showBlog && SelectedBlog && (
                <ShowBlog blog={SelectedBlog} setShowBlog={setShowBlog} />
            )}

            {editProfile && (
                <UpdateUser setEditProfile={setEditProfile} user={userData} />
            )}

            {openAddressModel && (
                <Address isUpdating={isUpdating} userData={userData} setOpenAddressModel={setOpenAddressModel} selectedAddress={selectedAddress} />
            )}
        </div>
    );
};