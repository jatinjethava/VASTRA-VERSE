import { ArrowLeftSquare, EyeIcon, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useReturn, useReturnUpdate } from "../Hooks/return"
import '../index.css'
import { useState } from "react"
import { ReturnOrderDetails } from "../components/ReturnOrderDetail"
import type { Return as ReturnType } from "../Api/returnApi"

export const Return = () => {

    const { data: returns, isLoading: returnLoading, error: returnError } = useReturn();
    const { mutate: updateReturn } = useReturnUpdate();

    const [showReturn, setShowReturn] = useState<boolean>(false);
    const [returnOrderDetails, setReturnOrderDetails] = useState<ReturnType | null>(null);
    const [selectedId, setSelectedId] = useState<string[]>([]);

    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-4">

                        <div className="flex gap-20 items-center">
                            <div>
                                <div className="flex flex-col">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Return Orders
                                    </h1>
                                    <p className="text-gray-500 mt-1">
                                        Manage customer return requests and approvals
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">

                            <Link
                                to="/admin/orders"
                                className="inline-flex items-center gap-2 px-4 py-3 text-gray-500 font-semibold rounded-xl hover:text-gray-800 hover:underline hover:underline-offset-4 transition-colors"
                            >
                                <ArrowLeftSquare size={18} />
                                Back to Orders
                            </Link>
                        </div>

                    </div>
                    <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                        <p className="text-xs text-red-500 uppercase tracking-wide">
                            Total Returns
                        </p>
                        <p className="text-xl pt-2 font-bold text-red-600">
                            {returns?.length || 0}
                        </p>
                    </div>
                </div>

                <div className="mt-5">

                    {returnLoading && (
                        <div className="absolute top-0 bottom-0 h-full z-50 left-0 right-0 flex items-center justify-center">
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

                    {returnError && (
                        <div className="text-center mt-8">
                            <p className="text-red-500">{returnError.message}</p>
                        </div>
                    )}

                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                        <table className="min-w-[1000px] w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3">Return ID</th>
                                    <th className="p-3">Order No.</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Requested On</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {returns?.map((ret) => {
                                    const isHighlighted = ret?.status === "pending" && !selectedId.includes(ret?._id as string);
                                    return (
                                        <tr key={ret?._id} className={`shadow-sm cursor-pointer transition-colors duration-300 border-l-4 ${isHighlighted ? "bg-blue-50/60 border-blue-500" : "bg-white border-transparent hover:bg-gray-50"}`}>
                                            <td className="p-3 font-medium text-gray-700">{ret?._id ? ret?._id.slice(0, 10) + "..." : "N/A"}</td>
                                            <td className="p-3 text-gray-600">{ret?.orderId?.orderNumber ? ret?.orderId?.orderNumber : "N/A"}</td>
                                            <td className="p-3 text-gray-600">{ret?.orderId?.shippingAddress?.fullName ? ret?.orderId?.shippingAddress?.fullName : "N/A"}</td>
                                            <td className="p-3 text-gray-600">{ret?.reason ? ret?.reason : "N/A"}</td>
                                            <td className="p-3 max-w-xs truncate text-gray-500">
                                                {ret?.description ? ret?.description : "N/A"}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ret?.status === "approved" ? "bg-green-100 text-green-700" : ret?.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {ret?.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-500">{new Date(ret?.createdAt || "").toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap justify-start items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowReturn(true);
                                                            setReturnOrderDetails(ret);
                                                            setSelectedId((prev: any) => prev ? [...prev, ret?._id] : [ret?._id]);
                                                        }}
                                                        className="text-gray-600 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 active:scale-95 flex items-center justify-center">
                                                        <EyeIcon size={18} />
                                                    </button>
                                                    {ret?.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateReturn({ id: ret?._id, status: "approved" });
                                                                    setSelectedId((prev: any) => prev ? [...prev, ret?._id] : [ret?._id]);
                                                                }}
                                                                className="text-green-700 bg-green-100/50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 font-medium text-sm border border-green-200 hover:border-green-300 shadow-sm flex-1 min-w-fit text-center">
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateReturn({ id: ret?._id, status: "rejected" });
                                                                    setSelectedId((prev: any) => prev ? [...prev, ret?._id] : [ret?._id]);
                                                                }}
                                                                className="text-red-700 bg-red-100/50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 font-medium text-sm border border-red-200 hover:border-red-300 shadow-sm flex-1 min-w-fit text-center">
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {ret?.status === "approved" && (
                                                        <span className="text-green-600 bg-green-50 p-1.5 rounded-full border border-green-100" title="Approved">
                                                            <CheckCircle size={20} />
                                                        </span>
                                                    )}
                                                    {ret?.status === "rejected" && (
                                                        <span className="text-red-600 bg-red-50 p-1.5 rounded-full border border-red-100" title="Rejected">
                                                            <XCircle size={20} />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showReturn && (
                <ReturnOrderDetails showReturn={setShowReturn} returnOrderDetails={returnOrderDetails as ReturnType} />
            )}
        </>
    )
}