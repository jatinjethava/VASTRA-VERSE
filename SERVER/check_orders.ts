import mongoose from "mongoose";
import { orderModel } from "./src/models/order";
import { env } from "./src/config";

async function run() {
    await mongoose.connect(env.MONGODB_URL);
    console.log("Connected to MongoDB");
    const lastOrder = await orderModel.findOne({ orderStatus: "delivered" }).sort({ createdAt: -1 });
    if (lastOrder) {
        console.log("Last Delivered Order Items:");
        console.log(JSON.stringify(lastOrder.items, null, 2));
    } else {
        console.log("No delivered orders found");
    }
    process.exit(0);
}
run();
