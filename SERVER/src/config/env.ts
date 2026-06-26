import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.DB_URL,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,

    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_HOST_USER: process.env.EMAIL_HOST_USER,
    EMAIL_HOST_PASSWORD: process.env.EMAIL_HOST_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,

    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    CUPON_CODE: process.env.CUPON_CODE,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    RAZORPAY_KEY_ID: process.env.RAZORPAY_TEST_APIKEY,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_TEST_SECRET,
    MSG91_API_KEY: process.env.MSG91_API_KEY,
    ENVIRONMENT: process.env.ENVIRONMENT,
}