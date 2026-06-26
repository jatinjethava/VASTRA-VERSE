import axios from "axios";
import { env } from "../config";

class WhatsAppService {
    async sendMessage({ mobileNumber, message }: { mobileNumber: number, message: string }) {
        try {
            const res = await axios.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
                {
                    to: `91${mobileNumber}`,
                    message: {
                        type: "text",
                        text: message
                    }
                },
                {
                    headers: {
                        authkey: env.MSG91_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data;
        } catch (error: any) {
            console.error("WhatsApp Error:", error.response?.data || error.message);
        }
    }
}

export default new WhatsAppService();