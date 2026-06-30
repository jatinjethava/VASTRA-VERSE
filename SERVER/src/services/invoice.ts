import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export const generateInvoicePdf = async (
    html: string
) => {
    const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;

    const options: any = {
        headless: true,
        args: isProduction
            ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            : ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    };

    if (isProduction) {
        options.executablePath = await chromium.executablePath();
    }

    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: "load"
    });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return pdf;
};