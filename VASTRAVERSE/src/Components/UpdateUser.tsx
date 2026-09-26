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
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-opacity animate-in fade-in duration-200" onClick={(e) => {
            if (e.target === e.currentTarget) setEditProfile(false)
        }}>
            <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 md:p-10 w-full max-w-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">

                
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                <button
                    onClick={() => setEditProfile(false)}
                    className="cursor-pointer rounded-full p-2.5 transition-all duration-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black absolute top-4 right-4 sm:top-6 sm:right-6"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="mb-6 sm:mb-8 pr-10">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1.5">
                        Client Dossier
                    </span>
                    <h1 className="editorial-text text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 capitalize">
                        Edit <span className="italic font-serif font-normal">Profile</span>
                    </h1>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mt-1">Update your personal credentials and profile presence.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">

                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-2 border-neutral-200 shadow-lg transition-all group-hover:border-black group-hover:scale-[1.02]">
                                <img
                                    src={imagePreview || `https://ui-avatars.com/api/?name=${name || 'User'}&background=111111&color=ffffff`}
                                    alt="Preview"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=111111&color=ffffff' }}
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="text-white w-6 h-6 mb-1" />
                                    <span className="text-[9px] uppercase tracking-widest text-white/90 font-medium">Upload</span>
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full shadow-lg border border-white/20 group-hover:scale-110 transition-transform">
                                <Upload className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em]">Change Portrait</span>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-4 sm:gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-[0.15em]">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="mobileNumber" className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-[0.15em]">Mobile Number</label>
                            <input
                                type="text"
                                id="mobileNumber"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                                placeholder="Enter 10-digit mobile number"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all cursor-pointer"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditProfile(false)}
                                disabled={isPending}
                                className="flex-1 px-6 py-3.5 text-xs bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium uppercase tracking-[0.15em] rounded-xl transition-all cursor-pointer"
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