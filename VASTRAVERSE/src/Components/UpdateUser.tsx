import { X, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useUpdateUserProfile } from "../Hooks/user";
import { toast } from "sonner";

export const UpdateUser = ({ setEditProfile, user }: { setEditProfile: (edit: boolean) => void, user: any }) => {

    const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

    const [name, setName] = useState(user?.name || user?.fullName || "");
    const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | undefined>(user?.profileImage);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name && name.length < 3) {
            toast.error("Name must be at least 3 characters long");
            return;
        }

        const formData = new FormData();
        if (name) formData.append("name", name);
        if (mobileNumber) formData.append("mobileNumber", mobileNumber);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        await updateProfile(formData);
        setEditProfile(false);
    };

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 transition-opacity animate-in fade-in duration-200" onClick={(e) => {
            if (e.target === e.currentTarget) setEditProfile(false)
        }}>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 md:p-10 w-full max-w-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">

                <button
                    onClick={() => setEditProfile(false)}
                    className="cursor-pointer rounded-full p-2 sm:p-2.5 transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="mb-6 sm:mb-8 pr-8">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 md:text-3xl capitalize">
                        Edit Profile
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Update your personal information and profile picture.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-12">

                    <div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-[3px] sm:border-4 border-gray-50 shadow-md transition-all group-hover:border-gray-200 group-hover:shadow-lg">
                                <img
                                    src={imagePreview || `https://ui-avatars.com/api/?name=${name || 'User'}&background=random`}
                                    alt="Preview"
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=random' }}
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 sm:p-2.5 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Change Picture</span>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-4 sm:gap-5">
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label htmlFor="name" className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-semibold text-gray-900"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label htmlFor="mobileNumber" className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Mobile Number</label>
                            <input
                                type="text"
                                id="mobileNumber"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-semibold text-gray-900"
                                placeholder="Enter 10-digit mobile number"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-2 sm:mt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold uppercase tracking-wider rounded-lg sm:rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditProfile(false)}
                                disabled={isPending}
                                className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}