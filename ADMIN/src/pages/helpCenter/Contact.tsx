import { useState } from "react";
import { useContact, useDelete, useRead } from "../../Hooks/help"
import '../../index.css'

export const Contact = () => {

    const { data: contact } = useContact();
    const { mutate: readContact } = useRead();
    const { mutate: deleteContact } = useDelete();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const allIds = (checked: boolean) => {
        if (checked) {
            setSelectedIds(contact?.map((c: any) => c._id) || []);
        } else {
            setSelectedIds([]);
        }
    }

    const allDelete = async () => {
        await Promise.all(selectedIds.map((id) => deleteContact(id)));
        setSelectedIds([]);
    }

    const handleCheckBox = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const contactFilter = contact?.filter((c: any) => {
        let matches = true;

        if (statusFilter === "deleted") {
            matches = c.isDeleted;
        } else if (statusFilter === "unread") {
            matches = !c.isRead;
        } else if (statusFilter === "read") {
            matches = c.isRead;
        }

        return matches;
    })?.sort((a: any, b: any) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    return (
        <div className="container mx-auto py-5">
            <div className="space-y-8">
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-gray-600 mt-1">Manage and respond to customer contact form submissions</p>
                </div>

                <div className="animate-fade-in-up-delay-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
                        <div className="text-sm text-gray-500">Total Messages</div>
                        <div className="text-3xl font-bold text-gray-900">{contact?.length || 0}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
                        <div className="text-sm text-gray-500">Unread Messages</div>
                        <div className="text-3xl font-bold text-gray-900">{contact?.filter((c: any) => !c.isRead).length || 0}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
                        <div className="text-sm text-gray-500">Replied Messages</div>
                        <div className="text-3xl font-bold text-gray-900">{contact?.filter((c: any) => c.isRead).length || 0}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
                        <div className="text-sm text-gray-500">Deleted Messages</div>
                        <div className="text-3xl font-bold text-gray-900">{contact?.filter((c: any) => c.isDeleted).length || 0}</div>
                    </div>
                </div>

                <div className="animate-fade-in-up-delay-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center gap-3">
                            <label htmlFor="statusFilter" className="text-gray-700 font-medium whitespace-nowrap">Status:</label>
                            <select id="statusFilter" onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">All</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <label htmlFor="sortBy" className="text-gray-700 font-medium whitespace-nowrap">Sort By:</label>
                            <select id="sortBy" onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        <button
                            onClick={allDelete}
                            className="ml-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                            Delete All Selected
                        </button>
                    </div>
                </div>

                <div className="animate-fade-in-up-delay-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {contact?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No contact messages found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">
                                            <input type="checkbox" onChange={(e) => allIds(e.target.checked)} className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 w-32">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 w-40">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Message</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 w-32">Date</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700 w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contactFilter?.map((c: any) => (
                                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input type="checkbox" onChange={() => handleCheckBox(c._id)} className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{c.name}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-gray-600">{c.email}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-gray-700 line-clamp-2">{c.message}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!c.isRead && (
                                                        <button
                                                            onClick={() => readContact(c._id)}
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium">
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                    {c.isDeleted ? (
                                                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium">
                                                            View
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => deleteContact(c._id)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium">
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Showing 1 - 10 of 50 messages</div>
                </div>
            </div>
        </div>
    )
}