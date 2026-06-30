import { X } from "lucide-react";
import type { Return } from "../Api/returnApi";
import '../index.css'

export const ReturnOrderDetails = ({ showReturn, returnOrderDetails }: { showReturn: (showReturn: boolean) => void, returnOrderDetails: Return }) => {
    console.log(returnOrderDetails)
    return (
        <>
            <div className={`animate-fade-in-up-delay-1 fixed flex inset-0 z-50 items-center justify-center h-full w-full bg-black/20 backdrop-blur-sm`}>
                <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-[95%] sm:w-[80%] max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col justify-start items-start gap-1">
                            <h2 className="font-bold text-2xl">Return Order Details</h2>
                            <p className="text-sm text-gray-600">ID : {returnOrderDetails?._id}</p>
                        </div>
                        <button onClick={() => showReturn(false)} className="cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:shadow-sm p-2 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">Order ID</span>
                                <span className="text-gray-500">{returnOrderDetails?.orderId?._id}</span>
                            </div>
                            <div className="flex flex-col mb-4">
                                <span className="font-semibold text-gray-600 mb-2">Product Details</span>
                                <div className="space-y-3">
                                    {(returnOrderDetails?.orderId?.items || returnOrderDetails?.orderId?.orderItems || []).map((item: any, index: number) => (
                                        <div key={index} className="flex justify-start items-center gap-4 border border-gray-100 p-2 rounded-lg bg-gray-50">
                                            <span className="text-gray-500">
                                                <img
                                                    src={item?.images[0]}
                                                    alt="product"
                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                                />
                                            </span>
                                            <div className="flex justify-between items-center gap-4 w-full">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 font-medium">{item?.title}</span>
                                                    <span className="text-gray-500 text-sm">Price : {item?.discountPrice}</span>
                                                    {(item?.size || item?.color) && (
                                                        <span className="text-gray-400 text-xs">
                                                            {item?.size && `Size: ${item.size}`} {item?.color && `Color: ${item.color}`}
                                                        </span>
                                                    )}
                                                    {item?.quantity && <span className="text-gray-400 text-xs">Qty: {item?.quantity}</span>}
                                                </div>
                                                <div className="flex flex-col justify-center items-center">
                                                    <span className="text-gray-700 font-medium text-lg">
                                                        ₹ {item?.discountPrice * item?.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">Return Reason</span>
                                <span className="text-gray-500">{returnOrderDetails?.reason}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">Reason Description</span>
                                <span className="text-gray-500">{returnOrderDetails?.description}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">Return Date</span>
                                <span className="text-gray-500">{new Date(returnOrderDetails?.createdAt || "").toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">Return Status</span>
                                <span className={`text-gray-500 ${returnOrderDetails?.status === "approved" ? "text-green-700 bg-green-100 px-2 py-0.5 rounded-full" : returnOrderDetails?.status === "rejected" ? "text-red-700 bg-red-100 px-2 py-0.5 rounded-full" : "text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full"}`}>{returnOrderDetails?.status}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-600">
                                    {returnOrderDetails?.status === "approved" && (
                                        "Approved Date"
                                    )}
                                    {returnOrderDetails?.status === "rejected" && (
                                        "Rejected Date"
                                    )}
                                </span>
                                <span className={`text-gray-500`}>
                                    {returnOrderDetails?.status === "approved" && new Date(returnOrderDetails?.approvedAt).toLocaleDateString()}
                                    {returnOrderDetails?.status === "rejected" && new Date(returnOrderDetails?.rejectedAt).toLocaleDateString()}
                                </span>
                            </div>
                            {returnOrderDetails?.images.length > 0 && (
                                <div className="flex flex-col mb-2">
                                    <span className="font-semibold text-gray-600 mb-2">Extra Images</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {returnOrderDetails?.images?.map((image: string, index: number) => (
                                            <div key={index} className="flex flex-col justify-center items-start">
                                                <div className="flex justify-center flex-col items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <a
                                                        key={index}
                                                        href={image}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={image}
                                                            alt="product"
                                                            className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}