
export class apiResponse {
    status: number;
    message: string;
    data: any;
    error: any;
    success: boolean;

    constructor(status: number, message: string, data: any, error: any) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
        this.success = status >= 200 && status < 300;
    }
}

export const responseMessage = {
    loginSuccess: "Login successful!",
    signupSuccess: "Account created successful!",
    internalServerError: "Internal Server Error!",
    alreadyEmail: "Email is already registered please login!",
    accountBlock: "Your account has been blocked!",
    invalidUserEmail: "You have entered an invalid username!",
    invalidUserPassword: "You have entered an invalid password!",
    invalidOTP: "Invalid OTP!",
    otpResendSuccess: "OTP has been resent successfully!",
    expireOTP: "OTP has been expired!",
    OTPVerified: "OTP has been verified successfully!",
    invalidEmail: "You have entered an invalid email!",
    verifyAccount: "your account verification Done!",
    resetPasswordSuccess: "Your password has been successfully reset!",
    resetPasswordError: "Error in reset password!",
    passwordNotMatch: "Your New Password and Confirm Password are not matching!",
    passwordChangeSuccess: "Password has been changed!",
    accessDenied: "Access denied",
    invalidToken: "Invalid token",
    differentToken: "Do not try a different token!",
    tokenNotFound: "We can't find tokens in header!",
    tokenExpire: "Token has been expired!",

    invalidCredentials: (message: string): string => { return `${message} Email or Password are incorrect!` },
    paymentOrderCreated: "Payment order created successfully!",
    paymentOrderFailed: "Payment order failed!",
    paymentOrderVerified: "Payment order verified successfully!",
    paymentOrderNotFound: "Payment order not found!",
    addDataSuccess: (message: string): string => { return `${message} added successfully!` },
    addDataError: (message: string): string => { return `Error while adding ${message}!` },
    getDataSuccess: (message: string): string => { return `${message} fetched successfully!` },
    getDataNotFound: (message: string): string => { return `${message} not found!` },
    getDataError: (message: string): string => { return `Error while fetching ${message}!` },
    updateDataSuccess: (message: string): string => { return `${message} updated successfully!` },
    updateDataError: (message: string): string => { return `Error while updating ${message}!` },
    deleteDataSuccess: (message: string): string => { return `${message} deleted successfully!` },
    deleteDataError: (message: string): string => { return `Error while deleting ${message}!` },
    dataAlreadyExist: (message: string): string => { return `${message} already exist!` },
    LoginSuccess: (message: string): string => { return `${message} logged out successfully!` },
    isNotVerified: (message: string): string => { return `Your ${message} is not verified!` },
    requiredField: (message: string): string => { return `${message} must be required!` },
};