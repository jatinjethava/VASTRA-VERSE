import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, ORDER_STATUS, RETURN_STATUS } from '../../common';
import { orderModel, ReturnOrderModel } from '../../models';
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
const parser = new Parser();

export const getRevenueOverview = async (req: Request, res: Response) => {
    try {
        const orders = await orderModel.find({ isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED });

        let grossRevenue = 0;
        let totalDiscounts = 0;
        let shippingRevenue = 0;
        let taxCollected = 0;
        let totalCOGS = 0;

        orders.forEach(order => {
            grossRevenue += (order.totalAmount || 0);
            totalDiscounts += (order.discount || 0);
            shippingRevenue += (order.shippingFee || 0);
            taxCollected += (order.gstAmount || 0);
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach((item: any) => {
                    totalCOGS += (item.costPrice || 0) * (item.quantity || 0);
                });
            }
        });

        const approvedReturns = await ReturnOrderModel.find({ isDeleted: false, status: RETURN_STATUS.APPROVED });
        const approvedOrderIds = approvedReturns.map((r: any) => r.orderId.toString());

        let refunds = 0;
        let refundedCOGS = 0;
        orders.forEach(order => {
            if (approvedOrderIds.includes(order._id.toString())) {
                refunds += (order.totalAmount || 0);
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach((item: any) => {
                        refundedCOGS += (item.costPrice || 0) * (item.quantity || 0);
                    });
                }
            }
        });

        const netRevenue = grossRevenue - refunds;
        const netCOGS = totalCOGS - refundedCOGS;
        const profit = netRevenue - netCOGS;
        const profitMargin = netRevenue > 0 ? Number(((profit / netRevenue) * 100).toFixed(2)) : 0;

        const data = {
            grossRevenue,
            netRevenue,
            totalDiscounts,
            shippingRevenue,
            taxCollected,
            refunds,
            profit,
            profitMargin
        };

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Revenue Overview"), { data }, {}));
    } catch (error) {
        console.log("Error in getRevenueOverview:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getRevenueCharts = async (req: Request, res: Response) => {
    try {

        const monthlyData = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            {
                $addFields: {
                    totalCost: {
                        $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: { $add: ["$$value", { $multiply: [{ $ifNull: ["$$this.costPrice", 0] }, { $ifNull: ["$$this.quantity", 0] }] }] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "Asia/Kolkata" } },
                    revenue: { $sum: "$totalAmount" },
                    expenses: { $sum: "$costPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log("Data from monthlyData:", monthlyData);

        const chartData = monthlyData.map(item => {
            const revenue = item.revenue;
            const expenses = item.expenses;
            const profit = revenue - expenses;
            return {
                month: item._id,
                revenue: revenue,
                expenses: expenses,
                profit: profit
            };
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Revenue Charts"), { data: chartData }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getRevenueByRegion = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            {
                $group: {
                    _id: "$shippingAddress.state",
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Revenue By Region"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getRevenueByPaymentMethod = async (req: Request, res: Response) => {
    try {
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            {
                $group: {
                    _id: "$paymentMethod",
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Revenue By Payment Method"), { data }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const exportRevenue = async (req: Request, res: Response) => {
    try {
        const format = req.query.format as string || 'csv';
        const data = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            {
                $addFields: {
                    totalCost: {
                        $reduce: {
                            input: "$items",
                            initialValue: 0,
                            in: { $add: ["$$value", { $multiply: [{ $ifNull: ["$$this.costPrice", 0] }, { $ifNull: ["$$this.quantity", 0] }] }] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
                    totalOrders: { $sum: 1 },
                    grossRevenue: { $sum: "$totalAmount" },
                    totalDiscounts: { $sum: "$discount" },
                    shippingRevenue: { $sum: "$shippingFee" },
                    taxCollected: { $sum: "$gstAmount" },
                    totalCOGS: { $sum: "$totalCost" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    totalOrders: 1,
                    grossRevenue: 1,
                    totalDiscounts: 1,
                    shippingRevenue: 1,
                    taxCollected: 1,
                    profit: { $subtract: ["$grossRevenue", "$totalCOGS"] }
                }
            },
            { $sort: { date: -1 } }
        ]);

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Revenue Report');

            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Total Orders', key: 'totalOrders', width: 15 },
                { header: 'Gross Revenue', key: 'grossRevenue', width: 20 },
                { header: 'Total Discounts', key: 'totalDiscounts', width: 20 },
                { header: 'Shipping Revenue', key: 'shippingRevenue', width: 20 },
                { header: 'Tax Collected', key: 'taxCollected', width: 20 },
                { header: 'Profit', key: 'profit', width: 20 },
            ];

            worksheet.addRows(data);

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('revenue-report.xlsx');
            return workbook.xlsx.write(res).then(() => {
                res.status(200).end();
            });
        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 30 });
            res.header('Content-Type', 'application/pdf');
            res.attachment('revenue-report.pdf');
            doc.pipe(res);

            doc.fontSize(20).text('Daily Revenue Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12);
            data.forEach((item, index) => {
                doc.text(`${index + 1}. Date: ${item.date} | Orders: ${item.totalOrders}`);
                doc.text(`   Gross Revenue: Rs. ${item.grossRevenue} | Profit: Rs. ${item.profit}`);
                doc.text(`   Tax Collected: Rs. ${item.taxCollected} | Shipping: Rs. ${item.shippingRevenue} | Discounts: Rs. ${item.totalDiscounts}`);
                doc.moveDown();
            });

            doc.end();
            return;
        } else {
            const csv = parser.parse(data);
            res.header("Content-Type", "text/csv");
            res.attachment(`revenue-report-${Date.now()}.csv`);
            return res.send(csv);
        }
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}