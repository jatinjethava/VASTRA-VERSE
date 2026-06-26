export const USER_ROLE = {
    ADMIN: "admin",
    USER: "user",
    DELIVERY_BOY: "delivery_boy"
} as const;

export const PRODUCT_SIZE = {
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL",
    XXL: "XXL"
} as const;

export const PRODUCT_FIT = {
    REGULAR: "regular",
    OVERSIZED: "oversized",
    SLIM: "slim"
} as const;

export const PRODUCT_GENDER = {
    MEN: "men",
    WOMEN: "women",
    UNISEX: "unisex",
    KIDS: "kids"
} as const;

export const SAVE_FOR = {
    CART: "cart",
    SAVE: "save"
} as const;

export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled"
} as const;

export const PAYMENT_STATUS = {
    UNPAID: "unpaid",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded"
} as const;

export const PAYMENT_METHOD = {
    COD: "cod",
    RAZORPAY: "razorpay"
} as const;

export const PRODUCT_CATEGORY = {
    TSHIRT: "tshirt",
    SHIRT: "shirt",
    PANT: "pant",
    SHORT: "short",
    JEANS: "jeans",
    JACKET: "jacket",
    HOODIE: "hoodie",
    SWEATER: "sweater",
    TRAINING_PANT: "training_pant",
    SHOE: "shoe",
    ACCESSORY: "accessory"
} as const;

export const PRODUCT_TYPE = {
    ROUND_NECK: "round_neck",
    V_NECK: "v_neck",
    POLO: "polo",
    COLLARED: "collared",
    HOODED: "hooded",
    COLLARED_PULLOVER: "collared_pullover",
    CREW_NECK: "crew_neck",
    HIGH_NECK: "high_neck",
    ROUND_NECK_PULLOVER: "round_neck_pullover",
    OTHER: "other"
} as const;

export const PRODUCT_SLEEVE_LENGTH = {
    FULL: "full",
    HALF: "half",
    THREE_QUARTER: "three_quarter",
    SHORT: "short"
} as const;

export const PRODUCT_MATERIAL = {
    COTTON: "cotton",
    POLYESTER: "polyester",
    WOOL: "wool",
    SILK: "silk",
    LEATHER: "leather",
    DENIM: "denim",
    LINEN: "linen",
    RAYON: "rayon",
    NYLON: "nylon",
    SPANDEX: "spandex",
    OTHER: "other"
} as const;

export const AUTHOR_TYPE = {
    ADMIN: "admin",
    USER: "user"
} as const;

export const BLOG_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    REJECTED: "rejected"
} as const;

export const BLOG_CATEGORY = {
    FASHION_TRENDS: "FASHION_TRENDS",
    STYLING_GUIDES: "STYLING_GUIDES",
    BUYING_GUIDES: "BUYING_GUIDES",
    MEN_FASHION: "MEN_FASHION",
    WOMEN_FASHION: "WOMEN_FASHION",
    KIDS_FASHION: "KIDS_FASHION",
    SEASONAL_COLLECTIONS: "SEASONAL_COLLECTIONS",
    STREETWEAR: "STREETWEAR",
    FABRIC_GUIDES: "FABRIC_GUIDES",
    CLOTHING_CARE: "CLOTHING_CARE",
    NEW_ARRIVALS: "NEW_ARRIVALS",
    BRAND_STORIES: "BRAND_STORIES",
} as const;

export const NOTIFICATION_TYPE = {
    ORDER: "order",
    PAYMENT: "payment",
    SHIPPING: "shipping",
    BLOG: "blog",
    PROMOTION: "promotion",
    ACCOUNT: "account",
    RETURN: "return",
    SYSTEM: "system",
    OTHER: "other"
} as const;

export const FOR = {
    USER: "user",
    ADMIN: "admin",
    DELIVERY_BOY: "delivery_boy"
} as const;

export const RETURN_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
} as const;

export const ADDRESS_LABEL = {
    HOME: "Home",
    OFFICE: "Office",
    OTHER: "Other"
} as const;

export const FAQ_CATEGORY = {
    ORDER: "order",
    DELIVERY: "delivery",
    PAYMENT: "payment",
    RETURN: "return",
    ACCOUNT: "account",
    PRODUCT: "product",
    OTHER: "other"
} as const;

export const DISCOUNTTYPE = {
    PERCENTAGE: "percentage",
    FIXED: "fixed"
} as const;