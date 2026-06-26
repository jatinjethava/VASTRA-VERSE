import { useState } from "react";
import { useGetAllFaqs, useCreateFaqs, useUpdateFaqs, useDeleteFaqs, useToggleActive } from "../../Hooks/help";
import { Edit, Trash2, Plus, X, CheckCircle, XCircle } from "lucide-react";
import '../../index.css';

export const FAQs = () => {
    const { data: faqs, isLoading } = useGetAllFaqs();
    const { mutate: createFaq, isPending: isCreating } = useCreateFaqs();
    const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaqs();
    const { mutate: deleteFaq } = useDeleteFaqs();
    const { mutate: toggleActive } = useToggleActive();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any>(null);
    const [formData, setFormData] = useState({ question: "", answer: "", category: "", isPublished: false, isActive: true });
    const [category, setCategory] = useState("all");
    const [isPublished, setIsPublished] = useState(false);

    const handleOpenModal = (faq: any = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({ question: faq.question, answer: faq.answer, category: faq.category, isPublished: faq.isPublished, isActive: faq.isActive });
        } else {
            setEditingFaq(null);
            setFormData({ question: "", answer: "", category: "", isPublished: false, isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        setFormData({ question: "", answer: "", category: "", isPublished: false, isActive: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFaq) {
            updateFaq({ id: editingFaq._id, FaqsData: formData as any }, {
                onSuccess: () => handleCloseModal()
            });
        } else {
            createFaq(formData as any, {
                onSuccess: () => handleCloseModal()
            });
        }
    };

    const faqsFilter = faqs?.filter((faq: any) => {
        let matches = true;

        if (category !== "all") {
            matches = matches && faq.category === category;
        }

        if (isPublished) {
            matches = matches && !faq.isPublished;
        }

        return matches;
    });

    return (
        <div className="container mx-auto py-6">
            <div className="animate-fade-in-up-delay-1  flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">FAQs Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage frequently asked questions</p>
                </div>

                <div className="flex gap-11 items-center">
                    <div className="flex gap-2 items-center">
                        <label htmlFor="faq">Not Published :</label>
                        <input type="checkbox" name="faq" id="faq" checked={isPublished} onChange={() => setIsPublished(!isPublished)} />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus size={20} />
                        Add FAQ
                    </button>
                </div>
            </div>

            <div className="animate-fade-in-up-delay-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 w-1/3">Question</th>
                                    <th className="p-4 font-semibold text-gray-600 w-1/3">Answer</th>
                                    <th className="p-4 font-semibold text-gray-600 flex gap-4">
                                        <span>Category</span>
                                        <select
                                            name="category"
                                            id="category"
                                            className="border border-gray-300 rounded-lg p-1"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="all">All</option>
                                            <option value="order">order</option>
                                            <option value="delivery">delivery</option>
                                            <option value="payment">payment</option>
                                            <option value="return">return</option>
                                            <option value="account">account</option>
                                            <option value="product">product</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs?.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No FAQs found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    faqsFilter?.map((faq: any) => (
                                        <tr key={faq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 align-top">
                                                <p className="text-gray-800 font-medium">{faq.question}</p>
                                            </td>
                                            <td className="p-4 align-top">
                                                <p className="text-gray-600 text-sm line-clamp-3">{faq.answer}</p>
                                            </td>
                                            <td className="p-4 align-top">
                                                <p className="capitalize">{faq.category}</p>
                                            </td>
                                            <td className="p-4 align-top">
                                                <button
                                                    onClick={() => toggleActive(faq._id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${faq.isActive
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {faq.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                    {faq.isActive ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(faq)}
                                                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this FAQ?")) {
                                                                deleteFaq(faq._id);
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="animate-fade-in-up-delay-2 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        id="question"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g., How do I track my order?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" name="category" id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="order">order</option>
                                        <option value="delivery">delivery</option>
                                        <option value="payment">payment</option>
                                        <option value="return">return</option>
                                        <option value="account">account</option>
                                        <option value="product">product</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="flex items-center my-4 gap-10">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="isPublished" className="block text-sm font-medium text-gray-700 mb-1">
                                            Is Published
                                        </label>
                                        <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                                            Is Active
                                        </label>
                                        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                                        Answer
                                    </label>
                                    <textarea
                                        id="answer"
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Provide a clear and helpful answer..."
                                    />
                                </div>

                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center justify-center min-w-30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isCreating || isUpdating ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        editingFaq ? "Save Changes" : "Create FAQ"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};