import 'dotenv/config';
import whatsappService from './services/whatsapp';

async function test() {
    console.log("Testing WhatsApp Service...");
    try {
        const response = await whatsappService.sendMessage({
            mobileNumber: 9999999999,
            message: "Hello! This is a test message from Vastra Verse."
        });
        console.log("Success! API Response:", response);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
