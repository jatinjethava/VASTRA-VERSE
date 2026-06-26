import { useState } from "react";
import { useBlockUser, useGetAllUsers } from "../../Hooks/user";
import type { User } from "../../Api/userApi";
import { Link } from "react-router";

export const UserDetail = () => {

    const { data: users } = useGetAllUsers();
    const { mutate: blockUser } = useBlockUser();

    const [filterType, setFilterType] = useState<'active' | 'inactive' | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<keyof User>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const filteredUsers =
        users?.filter((user) => {
            const matchesSearch =
                (user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

            if (filterType === "active") return matchesSearch && !user.isBlocked;
            if (filterType === "inactive") return matchesSearch && user.isBlocked;
            return matchesSearch;
        })
            ?.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];

                let comparison = 0;

                if (typeof aVal === "string" && typeof bVal === "string") {
                    comparison = aVal.localeCompare(bVal);
                } else if (typeof aVal === "number" && typeof bVal === "number") {
                    comparison = aVal - bVal;
                }

                return sortOrder === "asc" ? comparison : -comparison;
            });

    return (
        <div className="w-full mt-5">

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Customer Details</h2>
                <div className="flex gap-5">
                    <Link to={"/admin/customers/customer-analysis"} className="px-4 py-2 text-gray-800 hover:underline hover:underline-offset-4 cursor-pointer no-underline">
                        Customer Analysis
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-semibold text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">Total Users :
                    <span className="text-gray-900 ml-2">{users?.length}</span>
                </p>
                <div className="flex items-center gap-3">

                    <select
                        value={sortBy === "createdAt" ? (sortOrder === "desc" ? "latest" : "oldest") : sortBy}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "latest") {
                                setSortBy("createdAt");
                                setSortOrder("desc");
                            } else if (val === "oldest") {
                                setSortBy("createdAt");
                                setSortOrder("asc");
                            } else {
                                setSortBy(val as any);
                                setSortOrder("asc");
                            }
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1.5 outline-none cursor-pointer focus:border-green-500 bg-white text-gray-700"
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 outline-none cursor-pointer focus:border-green-500 bg-white text-gray-700"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="inactive">Blocked Users</option>
                    </select>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md pl-3 pr-10 py-1.5 outline-none focus:border-green-500 min-w-100"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                profile Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                User Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 pl-10 text-left text-xs font-semibold text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">

                        {filteredUsers?.map((user: any) => (
                            <tr key={user._id} className="hover:bg-gray-50">

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <img src={user.profileImage || "../assets/user.png"} alt={user.name || "User"} className="h-10 w-10 rounded-full" />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user._id ? '#' + user._id.slice(-6) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-start">
                                            <span className="text-primary-600 text-xs font-semibold">
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                        {user.mobileNumber || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isEmailVerified ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => blockUser(user._id)}
                                        className={`hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-90 transition-all duration-200 text-white cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md ${user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        {user?.isBlocked ? "Unblock" : "Block"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users?.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                        <p className="text-sm">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    )
}