import whatsappService from "./whatsapp";
import { notificationModel } from "../models";
import { createOne } from "../helpers";

class NotificationService {

    async sendOrderPlaced(user: any, order: any) {
        const message = `
🎉 *Order Confirmed!* 🎉

Hi *${user.name}*,
Thank you for shopping with *Vastra Verse*! 

🛍️ *Order #:* ${order.orderNumber}
💰 *Total Amount:* ₹${order.totalAmount}

We've received your order and are getting it ready. We'll send you another update as soon as it ships!

Thank you! 🙏
        `.trim();

        return whatsappService.sendMessage({
            mobileNumber: user.mobileNumber,
            message
        });
    }

    async sendOrderShipped(user: any, order: any) {
        const message = `
🚚 *Great news, ${user.name}! Your order has shipped!*

Your *Vastra Verse* order is on its way.

🛍️ *Order #:* ${order.orderNumber}
📍 *Tracking ID:* ${order.trackingId || 'N/A'}

You can track your package on our website.

Thank you! 🙏
        `.trim();

        return whatsappService.sendMessage({
            mobileNumber: user.mobileNumber,
            message
        });
    }

    async sendOrderDelivered(user: any, order: any) {
        const message = `
✅ *Order Delivered!*

Hi *${user.name}*, your *Vastra Verse* order has been successfully delivered.

🛍️ *Order #:* ${order.orderNumber}

We hope you love your new items! Please let us know if you need any assistance.

Thank you for shopping with us! 🙏
        `.trim();

        return whatsappService.sendMessage({
            mobileNumber: user.mobileNumber,
            message
        });
    }
}

export default new NotificationService();