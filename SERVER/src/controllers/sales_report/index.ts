import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, isValidObjectId, ORDER_STATUS, RETURN_STATUS, applySales, getDateForSalesQuery } from '../../common';
import { getData, getFirstMatch } from '../../helpers';
import { orderModel, TShirtModel, IVariant, IOrder, ReturnOrderModel, CampaignModel, FlashSalesModel, ReturnOrderDocument } from '../../models'
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const getSales = async (req: Request, res: Response) => {
    try {
        const orders = await getData(orderModel, { isDeleted: false }) || [];
        const products = await getData(TShirtModel, { isDeleted: false }) || [];
        const returnData = await getData(ReturnOrderModel, { isDeleted: false }) || [];

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        const stockWithProduct = finalProducts.map((item: any) => ({
            stock: item.variants ? item.variants.reduce((acc: number, variant: IVariant) => variant.stock > 0 ? acc + variant.stock : acc, 0) : 0,
            name: item.title,
            soldCount: item.soldCount
        }));

        const totalAmount = orders.reduce((acc: number, item: IOrder) => item.totalAmount > 0 ? acc + item.totalAmount : acc, 0);
        const totalOrders = orders.length;
        const totalPending = orders.reduce((acc: number, item: IOrder) => item.orderStatus === ORDER_STATUS.PENDING ? acc + 1 : acc, 0);
        const totalShipped = orders.reduce((acc: number, item: IOrder) => item.orderStatus === ORDER_STATUS.SHIPPED ? acc + 1 : acc, 0);
        const totalDelivered = orders.reduce((acc: number, item: IOrder) => item.orderStatus === ORDER_STATUS.DELIVERED ? acc + 1 : acc, 0);
        const totalCancelled = orders.reduce((acc: number, item: IOrder) => item.orderStatus === ORDER_STATUS.CANCELLED ? acc + 1 : acc, 0);
        const approvedReturns = returnData.filter((item: ReturnOrderDocument) => item.status === RETURN_STATUS.APPROVED);
        const totalReturn = approvedReturns.length;
        const returnRejected = returnData.filter((item: ReturnOrderDocument) => item.status === RETURN_STATUS.REJECTED).length;

        const approvedOrderIds = approvedReturns.map((r: any) => r.orderId.toString());
        const totalReturnAmount = orders.reduce((acc: number, item: any) => {
            if (approvedOrderIds.includes(item._id.toString())) {
                return acc + item.totalAmount;
            }
            return acc;
        }, 0);

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

        const salesTodayAgg = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED, createdAt: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
        ]);
        const salesToday = salesTodayAgg[0] || { totalSales: 0, totalOrders: 0 };

        const salesThisMonthAgg = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED, createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
        ]);
        const salesThisMonth = salesThisMonthAgg[0] || { totalSales: 0, totalOrders: 0 };

        const salesThisYearAgg = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
        ]);
        const salesThisYear = salesThisYearAgg[0] || { totalSales: 0, totalOrders: 0 };

        const reportData = {
            stockWithProduct,
            totalAmount,
            totalOrders,
            totalPending,
            totalShipped,
            totalDelivered,
            totalCancelled,
            totalReturn,
            returnRejected,
            totalReturnAmount,
            salesToday,
            salesThisMonth,
            salesThisYear,
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Report"), { reportData }, {}));

    } catch (error) {
        console.log("Error in getSales:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByDay = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } }, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Day"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByMonth = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "Asia/Kolkata" } }, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Month"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByYear = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $group: { _id: { $dateToString: { format: "%Y", date: "$createdAt", timezone: "Asia/Kolkata" } }, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Year"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByCategory = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: "tshirts",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ["$category.name", "Others"] },
                    totalSales: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$items.discountPrice", 0] },
                                { $ifNull: ["$items.quantity", 1] }
                            ]
                        }
                    },
                    uniqueOrders: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalSales: 1,
                    totalOrders: { $size: "$uniqueOrders" }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Category"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByProduct = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },
            {
                $group: {
                    _id: { $ifNull: ["$items.title", "Unknown Product"] },
                    productId: { $first: "$items.productId" },
                    quantitySold: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    sales: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$items.discountPrice", 0] },
                                { $ifNull: ["$items.quantity", 0] }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    productId: 1,
                    quantitySold: 1,
                    sales: 1
                }
            },
            { $sort: { sales: -1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Product"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const salesByCustomer = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            {
                $group: {
                    _id: "$userId",
                    quantitySold: { $sum: "$totalItems" },
                    sales: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    customerId: "$_id",
                    name: { $ifNull: ["$userDetails.name", "Unknown Customer"] },
                    quantitySold: 1,
                    sales: 1
                }
            },
            { $sort: { sales: -1 } }
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Sales By Customer"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

const parser = new Parser();

export const Export = async (req: Request, res: Response) => {
    try {
        const format = req.query.format as string || 'csv';
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },
            {
                $addFields: {
                    "items.productIdObj": {
                        $convert: {
                            input: "$items.productId",
                            to: "objectId",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "tshirts",
                    localField: "items.productIdObj",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
                        product: { $ifNull: ["$product.name", "$items.title", "Unknown Product"] },
                        category: { $ifNull: ["$category.name", "Unknown Category"] },
                        price: { $ifNull: ["$items.basePrice", "$items.price", 0] },
                        quantity: { $ifNull: ["$items.quantity", 0] },
                        discountPrice: { $ifNull: ["$items.discountPrice", 0] },
                        totalAmount: { $ifNull: ["$items.total", "$items.totalAmount", 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    product: "$_id.product",
                    category: "$_id.category",
                    price: "$_id.price",
                    quantity: "$_id.quantity",
                    discountPrice: "$_id.discountPrice",
                    totalAmount: "$_id.totalAmount"
                }
            },
            { $sort: { date: -1 } }
        ]);

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Report');

            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Product', key: 'product', width: 30 },
                { header: 'Category', key: 'category', width: 20 },
                { header: 'Price', key: 'price', width: 15 },
                { header: 'Quantity', key: 'quantity', width: 15 },
                { header: 'Discount Price', key: 'discountPrice', width: 15 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
            ];

            worksheet.addRows(data);

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('sales-report.xlsx');
            return workbook.xlsx.write(res).then(() => {
                res.status(200).end();
            });
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('sales-report.pdf');
            doc.pipe(res);

            doc.fontSize(20).text('Sales Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12);
            data.forEach((item, index) => {
                doc.text(`${index + 1}. Date: ${item.date || 'N/A'} | Product: ${item.product || 'N/A'} | Category: ${item.category || 'N/A'}`);
                doc.text(`   Price: ${item.price} | Qty: ${item.quantity} | Discount: ${item.discountPrice} | Total: ${item.totalAmount}`);
                doc.moveDown();
            });

            doc.end();
            return;
        } else {
            const csv = parser.parse(data);
            res.header("Content-Type", "text/csv");
            res.attachment("sales-report.csv");
            return res.send(csv);
        }
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}