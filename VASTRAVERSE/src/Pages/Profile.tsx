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
        <div className="min-h-screen bg-gray-50/50 px-4 py-6 sm:py-8 md:px-8 lg:px-12">

            <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-gray-100 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">

                <div className="relative group shrink-0">
                    <div className="h-20 w-20 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-full overflow-hidden shadow-sm">
                        <img
                            src={userData?.profileImage ? `${userData.profileImage}` : `https://ui-avatars.com/api/?name=${userData?.name || userData?.fullName || 'User'}&background=random`}
                            alt={userData?.name || userData?.fullName || "User"}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=random' }}
                        />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-1.5 sm:mb-2 capitalize">
                            {userData?.name || userData?.fullName || "User Name"}
                        </h1>
                        <p className="text-gray-500 text-[10px] sm:text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-3">
                            <span>{userData?.email || "user@example.com"}</span>
                            {userData?.isEmailVerified && (
                                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] sm:text-[11px] md:text-[12px] font-bold border border-green-100 uppercase tracking-wider">Verified</span>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 bg-gray-50 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-100">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {userData?.mobileNumber || "Add Mobile Number"}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 bg-gray-50 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-100">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between md:h-44 gap-3 mt-2 md:mt-0 md:ml-auto w-fit sm:w-auto">
                    <button
                        onClick={() => { setEditProfile(true) }}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-gray-800 text-white text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Edit Profile
                    </button>
                </div>

            </div>


            <div className="mx-auto my-8 sm:my-10 max-w-7xl">
                <div className="mb-6 sm:mb-10 flex items-start justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Addresses
                        </h1>
                        <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-gray-500">
                            Manage your addresses.
                        </p>
                    </div>

                    <button
                        onClick={() => { setIsUpdating(false); setSelectedAddress(null); setOpenAddressModel(true) }}
                        className="group w-fit sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-90" />
                        <span>Add Address</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                    {address?.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            No addresses found. Add a new address to get started.
                        </div>
                    )}
                    {address?.map((item: any) => (
                        <div key={item._id} className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[10px] sm:text-[11px] md:text-[13px] font-bold text-gray-800 uppercase tracking-wider">
                                    {item.label || "Home"}
                                </span>
                                {item?.isDefault ? (
                                    <span className="text-[10px] sm:text-[11px] md:text-[12px] font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Default
                                    </span>
                                ) : (
                                    <button onClick={() => defaultAddress(item._id)} className="rounded-full text-gray-500 px-3 py-1 text-[10px] sm:text-[11px] md:text-[12px] hover:underline hover:underline-offset-4 tracking-widest cursor-pointer">
                                        Set as default
                                    </button>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="space-y-1 mt-3 text-[12px] sm:text-[13px] md:text-[14px] text-gray-600 leading-relaxed">
                                    <p>{item.addressLine1}</p>
                                    {item.addressLine2 && <p>{item.addressLine2}</p>}
                                    <p>{item.city}, {item.state} - {item.pincode}</p>
                                    <p>{item.country}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-[10px] sm:text-[11px] md:text-[12px] font-medium text-gray-800 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {userData?.mobileNumber || "No Phone"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={() => { setIsUpdating(true); setSelectedAddress(item); setOpenAddressModel(true); }}
                                    className="flex-1 cursor-pointer rounded-xl bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-gray-700 transition-all hover:bg-gray-800 hover:text-white uppercase tracking-wider"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { deleteAddress(item._id) }}
                                    className="flex-1 cursor-pointer rounded-xl bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white uppercase tracking-wider"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <hr className="my-6 sm:my-8 max-w-7xl mx-auto border-gray-200" />

            <div className="mx-auto max-w-7xl">

                <div className="mb-6 sm:mb-10 flex items-start justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-2xl font-bold tracking-tight text-gray-900">
                            My Workspace
                        </h1>
                        <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-gray-500">
                            Manage your published stories and drafts.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/blogs/write')}
                        className="group w-fit sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-5 py-2 sm:py-2.5 text-[8px] sm:text-[10px] md:text-[12px] font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                    >
                        <Plus className="h-2 w-2 sm:h-4 sm:w-4 transition-transform group-hover:rotate-90" />
                        <span>Write New Blog</span>
                    </button>
                </div>

                {isPending && (
                    <div className="flex min-h-[40vh] items-center justify-center">
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
                    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                        <div className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-500">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">No blogs yet</h3>
                        <p className="mb-6 max-w-sm text-sm text-gray-500">
                            You haven't written any blogs yet. Start sharing your thoughts and stories with the world.
                        </p>
                        <button
                            onClick={() => navigate('/blogs/write')}
                            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            Create Your First Blog
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {userBlog?.data.blog.map((blog: IBlog) => (
                        <article
                            key={blog._id}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative h-64 w-full overflow-hidden shrink-0">
                                <img
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[8px] sm:text-[9px] md:text-[10px] font-semibold backdrop-blur-md ${blog.status === "published"
                                        ? "bg-green-500/80 text-white ring-1 ring-green-500/50"
                                        : "bg-yellow-500/80 text-white ring-1 ring-yellow-500/50"
                                        }`}
                                >
                                    {blog.status}
                                </span>

                                <button
                                    onClick={() => {
                                        setShowBlog(true);
                                        setSelectedBlog(blog);
                                    }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full bg-white/20 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/40 group-hover:scale-100 group-hover:opacity-100"
                                    title="Preview"
                                >
                                    <Eye className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 text-[8px] sm:text-[9px] md:text-[10px]">
                                        {blog.category}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-[8px] sm:text-[9px] md:text-[10px]">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <h2 className="mb-2 line-clamp-2 text-[14px] sm:text-[15px] md:text-[16px] font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                                    {blog.title}
                                </h2>

                                {blog.subTitle && (
                                    <p className="mb-3 line-clamp-1 text-[12px] sm:text-[13px] md:text-[14px] font-medium text-indigo-500">
                                        {blog.subTitle}
                                    </p>
                                )}

                                <p className="mb-6 line-clamp-3 text-[10px] sm:text-[11px] md:text-[12px] leading-relaxed text-gray-600">
                                    {blog.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-[12px] font-medium text-gray-500">
                                        <Eye className="h-4 w-4" />
                                        {blog.views || 0}
                                    </span>

                                    <div className="flex items-center gap-2 transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100">
                                        <button
                                            onClick={() => {
                                                navigate('/blogs/write', { state: { blog, edit: true } });
                                            }}
                                            className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                                            title="Edit Blog"
                                        >
                                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteBlog(blog._id)}
                                            className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                                            title="Delete Blog"
                                        >
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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