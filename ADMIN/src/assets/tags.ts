export const fabricTags = [
    "cotton",
    "organic-cotton",
    "linen",
    "polyester",
    "fleece",
    "denim",
];

export const productTags = [
    "casual",
    "streetwear",
    "minimal",
    "vintage",
    "sporty",
    "formal",
    "trendy",
    "summer",
    "winter",
    "all-season",
    "daily-wear",
    "office",
    "college",
    "party",
    "travel",
    "gym",
    "round-neck",
    "crew-neck",
    "v-neck",
    "polo-neck",
    "hooded",
    "half-sleeve",
    "full-sleeve",
    "sleeveless",
    "breathable",
    "lightweight",
    "stretchable",
    "quick-dry",
    "wrinkle-free",
    "new-arrival",
    "best-seller",
    "featured",
    "trending",
    "premium",
    "limited-edition",
];

export const getButtonConfig = (type: string) => {
    switch (type) {
        case "order":
            return {
                text: "View Order",
                className: "bg-green-100 border border-green-700 text-green-800 hover:bg-green-200",
                icon: "📦",
            };

        case "payment":
            return {
                text: "View Payment",
                className: "bg-blue-100 border border-blue-700 text-blue-800 hover:bg-blue-200",
                icon: "💳",
            };

        case "return":
            return {
                text: "View Return",
                className: "bg-orange-100 border border-orange-700 text-orange-800 hover:bg-orange-200",
                icon: "↩️",
            };

        case "blog":
            return {
                text: "View Blog",
                className: "bg-purple-100 border border-purple-700 text-purple-800 hover:bg-purple-200",
                icon: "📝",
            };

        case "user":
            return {
                text: "View User",
                className: "bg-cyan-100 border border-cyan-700 text-cyan-800 hover:bg-cyan-200",
                icon: "👤",
            };

        default:
            return {
                text: "View Details",
                className: "bg-gray-100 border border-gray-700 text-gray-800 hover:bg-gray-200",
                icon: "🔍",
            };
    }
};