import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useStatus } from "../../Hooks/order";
import { useGetCurrentUser } from "../../Hooks/user";
import { getProductsForUser, type Product } from "../../Api/productApi";
import { getUserOrder, cancelOrder, getAllcoupons } from "../../Api/orderApi";
import { getWishlistShowProducts } from "../../Api/wishlistApi";
import { getCart } from "../../Api/cartApi";
import { askQuestion, getQuestionByProduct } from "../../Api/qaApi";
import { io, Socket } from "socket.io-client";
import { getMyRoomAPI, getChatMessagesAPI } from "../../Api/chatApi";
import { toast } from "sonner";

const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

interface MessageButton {
    label: string;
    action: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
    buttons?: MessageButton[];
    products?: Product[];
}

const quickReplies = [
    "Live Chat 💬",
    "Track my order",
    "Return policy",
    "Size guide",
    "Payment options",
    "Delivery time",
    "Add new address",
    "Search products",
];

const SEARCH_TRIGGERS = ["show", "search", "find", "looking for", "want", "need", "get me", "display", "any", "suggest", "recommend"];
const PRICE_PATTERNS = [
    /under\s*₹?\s*(\d+)/i,
    /below\s*₹?\s*(\d+)/i,
    /less\s*than\s*₹?\s*(\d+)/i,
    /within\s*₹?\s*(\d+)/i,
    /budget\s*₹?\s*(\d+)/i,
    /max\s*₹?\s*(\d+)/i,
    /₹\s*(\d+)/i,
    /rs\.?\s*(\d+)/i,
];

const botResponses: Record<string, string> = {
    "return policy": "We offer a 7-day easy return policy on all products. Items must be unused and in original packaging. Visit Help Center → Returns for more details.",
    "size guide": "Our size guide is available on every product page. Tap the 'Size Chart' button below the size selector for accurate measurements. 📏",
    "payment options": "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. All payments are secured with 256-bit encryption. 🔒",
    "delivery time": "Standard delivery takes 3-5 business days. Express delivery (available in select cities) takes 1-2 days. Free shipping on orders above ₹999! 🚚",
    "hello": "Hey there! 👋 Welcome to Vastra Verse. How can I help you today?",
    "hi": "Hi! 👋 How can I assist you today?",
    "hey": "Hey! 👋 What can I help you with?",
    "thanks": "You're welcome! 😊 Is there anything else I can help you with?",
    "thank you": "Happy to help! 😊 Feel free to ask if you need anything else.",
    "bye": "Goodbye! 👋 Have a great day. We're always here if you need us!",
    "saved address": "You can manage all your saved addresses from your Profile page. Would you like to add a new one? Just type 'Add new address' 📍",
};

const getBotResponse = (message: string): string | null => {
    const lowerMsg = message.toLowerCase().trim();

    for (const [key, response] of Object.entries(botResponses)) {
        if (lowerMsg.includes(key)) {
            return response;
        }
    }

    return null;
};

export const Bots = () => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [awaitingOrderNumber, setAwaitingOrderNumber] = useState(false);
    const [awaitingProductNameForStock, setAwaitingProductNameForStock] = useState(false);
    const [awaitingProductNameForQa, setAwaitingProductNameForQa] = useState(false);
    const [awaitingQuestionForQa, setAwaitingQuestionForQa] = useState<string | null>(null);
    const [qaProductName, setQaProductName] = useState("");
    const [orderNumberToTrack, setOrderNumberToTrack] = useState("");

    const { data: orderStatus, isError: isOrderError, isSuccess: isOrderSuccess, isFetching: isOrderFetching } = useStatus(orderNumberToTrack);
    const { data: user } = useGetCurrentUser();
    const userData = (user as any)?.data?.user;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: userData?.name ? `Hey, ${userData.name}! 👋 Welcome to Vastra Verse. I'm here to help you with orders, returns, sizing, and more. How can I assist you today?` : "Hey! 👋 Welcome to Vastra Verse. I'm here to help you with orders, returns, sizing, and more. How can I assist you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [isLiveChat, setIsLiveChat] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [liveChatRoomId, setLiveChatRoomId] = useState<string | null>(null);

    useEffect(() => {
        const checkActiveRoom = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await getMyRoomAPI();
                const room = res?.data?.room || res?.room || (res?._id ? res : null);
                if (room && room.status !== "closed") {
                    setIsLiveChat(true);
                }
            } catch (error) {
                console.log("No active chat room.");
            }
        };
        checkActiveRoom();
    }, []);

    useEffect(() => {
        if (!isLiveChat) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const tokenStr = localStorage.getItem("token");
        if (!tokenStr) {
            toast.error("Please login to use live chat");
            setIsLiveChat(false);
            return;
        }

        const token = JSON.parse(tokenStr);
        const newSocket = io("http://localhost:8200", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            newSocket.emit("chat:join");
        });

        newSocket.on("chat:joined", async (data) => {
            setLiveChatRoomId(data.roomId);
            try {
                const res = await getChatMessagesAPI(data.roomId, 1, 100);
                const pastMessages = res.data.messages || [];

                const formattedMessages: Message[] = pastMessages.map((msg: any) => ({
                    id: msg._id,
                    text: msg.message,
                    sender: msg.senderType === "customer" ? "user" : "bot",
                    timestamp: new Date(msg.createdAt),
                }));

                setMessages(formattedMessages);

                if (formattedMessages.length === 0) {
                    addBotMessage("You are now connected to a human agent. How can we help you today? 💬");
                }
            } catch (error) {
                console.error("Failed to fetch past messages", error);
            }
        });

        newSocket.on("chat:message", (data) => {
            if (data.senderType === "admin") {
                const botMsg: Message = {
                    id: data._id || Date.now(),
                    text: data.message,
                    sender: "bot",
                    timestamp: new Date(data.createdAt || Date.now()),
                };
                setMessages((prev) => [...prev, botMsg]);
                newSocket.emit("chat:read", { roomId: data.roomId });
            }
        });

        newSocket.on("chat:error", (data) => {
            toast.error(data.message || "Chat error");
            if (data.message === "This chat room is closed") {
                setIsLiveChat(false);
                addBotMessage("This chat room has been closed. Please start a new chat if you need further assistance.");
            }
        });

        newSocket.on("chat:closed", () => {
            setIsLiveChat(false);
            addBotMessage("This live chat session has been closed. Let me know if you need any other help! 😊");
        });

        newSocket.on("chat:opened", () => {
            setIsLiveChat(true);
            addBotMessage("An admin has reopened this chat session! How can we assist you further? 😊");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isLiveChat]);

    useEffect(() => {
        if (!inputValue.trim()) {
            setSuggestions([]);
            return;
        }

        const lowerInput = inputValue.toLowerCase();
        const allSuggestions = Array.from(new Set([
            "Track my order",
            "Return policy",
            "Size guide",
            "Payment options",
            "Delivery time",
            "Add new address",
            "Search products",
            "Payment failed",
            "Return my order",
            "Cancel my order",
            "Show t-shirts under ₹1000",
            "Find printed t-shirts",
            "Suggest cotton t-shirts below ₹1500",
            "Looking for oversized t-shirts max ₹800",
            "I want graphic t-shirts less than ₹2000",
            "Show my wishlist",
            "What's in my cart?",
            "Check stock availability",
            "Change password",
            "Update mobile number",
            "Manage addresses",
            "I need a gift under ₹2000",
            "Ask a product question",
            ...Object.keys(botResponses).map(k => k.charAt(0).toUpperCase() + k.slice(1))
        ]));

        const matches = allSuggestions.filter(s =>
            s.toLowerCase().includes(lowerInput) && s.toLowerCase() !== lowerInput
        );

        setSuggestions(matches.slice(0, 5));
    }, [inputValue]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!orderNumberToTrack || isOrderFetching) return;

        if (isOrderSuccess && orderStatus) {
            setTimeout(() => {
                addBotMessage(`Your order **${orderNumberToTrack}** is currently: **${orderStatus}** ✅\n\nYou can view full details in Profile → My Orders.`);
                setOrderNumberToTrack("");
            }, 800);
        } else if (isOrderError) {
            setTimeout(() => {
                addBotMessage(`Sorry, I couldn't find an order with number "${orderNumberToTrack}". Please double-check and try again. 🔍`);
                setOrderNumberToTrack("");
            }, 800);
        }
    }, [orderStatus, isOrderError, isOrderSuccess, isOrderFetching, orderNumberToTrack]);

    const addBotMessage = (text: string, buttons?: MessageButton[], products?: Product[]) => {
        const botMsg: Message = {
            id: Date.now() + 1,
            text,
            sender: "bot",
            timestamp: new Date(),
            buttons,
            products,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
    };

    const parseSearchQuery = (text: string): { keywords: string[]; maxPrice: number | null } => {
        const lower = text.toLowerCase();
        let maxPrice: number | null = null;

        for (const pattern of PRICE_PATTERNS) {
            const match = lower.match(pattern);
            if (match) {
                maxPrice = parseInt(match[1], 10);
                break;
            }
        }

        const cleanedText = lower
            .replace(/under\s*₹?\s*\d+/gi, "")
            .replace(/below\s*₹?\s*\d+/gi, "")
            .replace(/less\s*than\s*₹?\s*\d+/gi, "")
            .replace(/within\s*₹?\s*\d+/gi, "")
            .replace(/budget\s*₹?\s*\d+/gi, "")
            .replace(/max\s*₹?\s*\d+/gi, "")
            .replace(/₹\s*\d+/gi, "")
            .replace(/rs\.?\s*\d+/gi, "");

        const stopWords = ["show", "search", "find", "looking", "for", "want", "need", "get", "me", "display", "any", "suggest", "recommend", "products", "product", "items", "item", "the", "a", "an", "in", "of", "i", "can", "you", "please", "some", "with", "gift", "parents", "father", "mother", "dad", "mom", "brother", "sister", "friend", "best", "top", "popular", "trending", "new"];
        const keywords = cleanedText
            .split(/\s+/)
            .map(w => w.replace(/[^a-z0-9-]/g, ""))
            .filter(w => w.length > 1 && !stopWords.includes(w) && w !== "-");

        return { keywords, maxPrice };
    };

    const searchProducts = async (text: string) => {
        try {
            const allProducts = await getProductsForUser();
            const { keywords, maxPrice } = parseSearchQuery(text);
            const lowerText = text.toLowerCase();

            let results = allProducts;

            if (keywords.length > 0) {
                let filtered = results.filter(product => {
                    const searchable = `${product.title} ${product.description} ${product.category} ${product.tags?.join(" ") || ""} ${product.gender} ${product.material} ${product.fit}`.toLowerCase();
                    return keywords.every(kw => {
                        const singular = kw.endsWith('es') ? kw.slice(0, -2) : (kw.endsWith('s') && !kw.endsWith('ss') ? kw.slice(0, -1) : kw);
                        const strippedKw = kw.replace(/-/g, "");
                        return searchable.includes(kw) || searchable.includes(singular) || searchable.includes(strippedKw);
                    });
                });

                if (filtered.length === 0 && (lowerText.includes("gift") || lowerText.includes("best") || lowerText.includes("top") || lowerText.includes("popular") || lowerText.includes("recommend"))) {
                    results = filtered;
                }
            }

            if (maxPrice !== null) {
                results = results.filter(product => {
                    const price = product.discountPrice || product.basePrice;
                    return price <= maxPrice!;
                });
            }

            if (lowerText.includes("gift") || lowerText.includes("best") || lowerText.includes("top") || lowerText.includes("popular") || lowerText.includes("recommend")) {
                results.sort((a, b) => {
                    if (a.isBestSeller && !b.isBestSeller) return -1;
                    if (!a.isBestSeller && b.isBestSeller) return 1;
                    return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
                });
            }

            return results.slice(0, 6);
        } catch {
            return [];
        }
    };

    const isProductSearch = (text: string): boolean => {
        const lower = text.toLowerCase().trim();
        if (lower === "search products") return true;
        return SEARCH_TRIGGERS.some(trigger => lower.includes(trigger)) &&
            !lower.includes("track") && !lower.includes("order") && !lower.includes("address") && !lower.includes("wishlist") && !lower.includes("stock") && !lower.includes("available");
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: text.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");

        if (text === "Live Chat 💬") {
            setIsLiveChat(true);
            return;
        }

        if (isLiveChat) {
            if (socket && liveChatRoomId) {
                socket.emit("chat:message", { roomId: liveChatRoomId, message: text.trim() });
            }
            return;
        }

        setIsTyping(true);

        const lowerText = text.toLowerCase().trim();

        if (lowerText.includes("add new address") || lowerText.includes("new address")) {
            setTimeout(() => {
                const addressButtons: MessageButton[] = [
                    {
                        label: "🏠 Home",
                        action: () => navigate("/profile", { state: { openAddressForm: true, addressLabel: "Home" } }),
                    },
                    {
                        label: "🏢 Office",
                        action: () => navigate("/profile", { state: { openAddressForm: true, addressLabel: "Office" } }),
                    },
                    {
                        label: "📍 Other",
                        action: () => navigate("/profile", { state: { openAddressForm: true, addressLabel: "Other" } }),
                    },
                ];
                addBotMessage(
                    "Great! What type of address would you like to add? Please select one:",
                    addressButtons
                );
            }, 800);
            return;
        }

        if (isProductSearch(lowerText)) {
            if (lowerText === "search products") {
                setTimeout(() => {
                    addBotMessage(
                        "Sure! Tell me what you're looking for. Or select an option below:",
                        [
                            {
                                label: "🔍 Show t-shirts under ₹1000",
                                action: () => sendMessage("Show t-shirts under ₹1000")
                            },
                            {
                                label: "🔍 Find printed t-shirts",
                                action: () => sendMessage("Find printed t-shirts")
                            },
                            {
                                label: "🔍 Suggest cotton t-shirts below ₹1500",
                                action: () => sendMessage("Suggest cotton t-shirts below ₹1500")
                            }
                        ]
                    );
                }, 800);
                return;
            }

            searchProducts(text).then(results => {
                if (results.length > 0) {
                    const { keywords, maxPrice } = parseSearchQuery(text);
                    const summary = keywords.length > 0 ? `"${keywords.join(", ")}"` : "your search";
                    const priceInfo = maxPrice ? ` under ₹${maxPrice}` : "";
                    addBotMessage(
                        `Found ${results.length} product${results.length > 1 ? "s" : ""} matching ${summary}${priceInfo} 🛍️`,
                        undefined,
                        results
                    );
                } else {
                    addBotMessage(
                        "Sorry, I couldn't find any products matching your search. Try different keywords or a higher budget. 😕",
                        [
                            { label: "🔍 Search again", action: () => sendMessage("Search products") },
                            { label: "🏠 Browse all", action: () => navigate("/") },
                        ]
                    );
                }
            });
            return;
        }

        if (lowerText.includes("payment failed") || lowerText.includes("payment issue")) {
            setTimeout(() => {
                const deductionButtons: MessageButton[] = [
                    {
                        label: "✅ Yes",
                        action: () => sendMessage("Yes, money was deducted"),
                    },
                    {
                        label: "❌ No",
                        action: () => sendMessage("No, money was not deducted"),
                    },
                ];
                addBotMessage(
                    "Oh no, I'm sorry to hear that! Was the money deducted from your account? 💳",
                    deductionButtons
                );
            }, 800);
            return;
        }

        if (lowerText === "yes, money was deducted" || lowerText.includes("money was deducted") && !lowerText.includes("not")) {
            setTimeout(() => {
                addBotMessage("Don't worry, your money is safe. 🏦 Sometimes payments take a little longer to sync. If your order isn't confirmed within 15 minutes, the deducted amount will be automatically refunded to your original payment method within 3-5 business days.");
            }, 800);
            return;
        }

        if (lowerText === "no, money was not deducted" || lowerText.includes("money was not deducted") || (lowerText.includes("not deducted"))) {
            setTimeout(() => {
                addBotMessage("Got it. Your payment was not successful, so no money was lost. Please try placing your order again using a different payment method or try again later. 🛒");
            }, 800);
            return;
        }

        if (lowerText.includes("return my order") || lowerText.includes("return request") || lowerText.includes("want to return")) {
            setTimeout(async () => {
                try {
                    const allOrders = await getUserOrder();
                    if (allOrders.length === 0) {
                        addBotMessage("You don't have any orders yet. 🛍️");
                        return;
                    }

                    const orderButtons: MessageButton[] = allOrders.slice(0, 5).map(o => ({
                        label: `📦 Order #${o.orderNumber}`,
                        action: () => { sendMessage(`Check return eligibility for #${o.orderNumber}`) }
                    }));

                    orderButtons.push({
                        label: "View all orders",
                        action: () => navigate("/order-list")
                    });

                    addBotMessage("Please select the order you want to return to check eligibility:", orderButtons);
                } catch (error) {
                    addBotMessage("Sorry, I couldn't fetch your orders right now. Please check your Profile -> My Orders page. 📦", [
                        { label: "Go to My Orders", action: () => navigate("/order-list") }
                    ]);
                }
            }, 800);
            return;
        }

        if (lowerText.includes("cancel my order") || lowerText.includes("cancel order")) {
            setTimeout(async () => {
                try {
                    const allOrders = await getUserOrder();
                    const pendingOrders = allOrders.filter(o => o.orderStatus.toLowerCase() === "pending");

                    if (pendingOrders.length === 0) {
                        addBotMessage("You don't have any pending orders that can be cancelled right now. 🛍️");
                        return;
                    }

                    const orderButtons: MessageButton[] = pendingOrders.slice(0, 5).map(o => ({
                        label: `🚫 Cancel #${o.orderNumber}`,
                        action: () => { sendMessage(`Confirm cancellation for #${o.orderNumber} - ID:${o._id}`) }
                    }));

                    addBotMessage("Please select the pending order you want to cancel:", orderButtons);
                } catch (error) {
                    addBotMessage("Sorry, I couldn't fetch your orders right now. Please check your Profile -> My Orders page. 📦", [
                        { label: "Go to My Orders", action: () => navigate("/order-list") }
                    ]);
                }
            }, 800);
            return;
        }

        if (lowerText.startsWith("confirm cancellation for #")) {
            const parts = text.split("- ID:");
            const orderId = parts[1]?.trim();
            const orderNum = parts[0].split("#")[1]?.trim();

            setTimeout(async () => {
                try {
                    await cancelOrder({ orderId, reason: "Cancelled via Bot" });
                    addBotMessage(`Order #${orderNum} has been successfully cancelled. ✅`);
                } catch (error) {
                    addBotMessage(`Sorry, there was an error cancelling Order #${orderNum}. Please try from your Profile page.`);
                }
            }, 800);
            return;
        }

        if (lowerText.startsWith("check return eligibility for #")) {
            const orderNum = text.split("#")[1]?.trim();
            setTimeout(async () => {
                try {
                    const allOrders = await getUserOrder();
                    const order = allOrders.find(o => o.orderNumber === orderNum);

                    if (!order) {
                        addBotMessage("Sorry, I couldn't find that order.");
                        return;
                    }

                    if (order.returnRequest) {
                        addBotMessage("A return request has already been raised for this order. Please wait 5-7 business days for processing. ⏳");
                        return;
                    }

                    const deliveryDate = new Date(order.updatedAt);
                    const returnWindow = new Date(deliveryDate);
                    returnWindow.setDate(returnWindow.getDate() + 7);
                    const currentDate = new Date();

                    if (currentDate <= returnWindow) {
                        addBotMessage(`Good news! Order #${order.orderNumber} is eligible for return. ✅`, [
                            {
                                label: "🔄 Create Return Request",
                                action: () => navigate(`/order-list/order-details/${order.orderNumber}`)
                            }
                        ]);
                    } else {
                        addBotMessage(`Order #${order.orderNumber} has already passed the return window. 🚫`);
                    }
                } catch (error) {
                    addBotMessage("An error occurred while checking eligibility.");
                }
            }, 800);
            return;
        }

        if (lowerText.includes("track my order")) {
            setTimeout(() => {
                addBotMessage("Sure! Please enter your order number (e.g. ORD-123) and I'll check the status for you. 📦");
                setAwaitingOrderNumber(true);
            }, 800);
            return;
        }

        if (awaitingOrderNumber) {
            setAwaitingOrderNumber(false);
            setOrderNumberToTrack(text.trim());
            return;
        }

        if (awaitingProductNameForStock) {
            setAwaitingProductNameForStock(false);
            setTimeout(async () => {
                try {
                    const products = await getProductsForUser();
                    let matchedProducts = products.filter((p: Product) => p.title.toLowerCase().includes(text.toLowerCase().trim()));

                    if (matchedProducts.length > 1) {
                        const exactMatch = matchedProducts.find((p: Product) => p.title.toLowerCase() === text.toLowerCase().trim());
                        if (exactMatch) {
                            matchedProducts = [exactMatch];
                        }
                    }

                    if (matchedProducts.length === 1) {
                        const matchedProduct = matchedProducts[0];
                        const totalStock = matchedProduct.variants.reduce((acc: number, v: any) => acc + v.stock, 0);
                        if (totalStock > 0) {
                            addBotMessage(`Yes, **${matchedProduct.title}** is currently in stock! We have ${totalStock} available. ✅`, [
                                { label: "🛒 View Product", action: () => navigate(`/more-details`, { state: { product: matchedProduct } }) }
                            ]);
                        } else {
                            addBotMessage(`Sorry, **${matchedProduct.title}** is currently out of stock. 🚫`);
                        }
                    } else if (matchedProducts.length > 1) {
                        const buttons = matchedProducts.slice(0, 5).map(p => ({
                            label: p.title,
                            action: () => { sendMessage(p.title) }
                        }));
                        addBotMessage(`I found multiple products matching "${text}". Which one did you mean?`, buttons);
                        setAwaitingProductNameForStock(true);
                    } else {
                        addBotMessage(`I couldn't find any product matching "${text}". Please check the spelling and try again. 😕`);
                    }
                } catch {
                    addBotMessage("Sorry, I couldn't check the inventory right now. Please try again later.");
                }
            }, 800);
            return;
        }

        if (awaitingProductNameForQa) {
            setAwaitingProductNameForQa(false);
            setTimeout(async () => {
                try {
                    const products = await getProductsForUser();
                    let matchedProducts = products.filter((p: Product) => p.title.toLowerCase().includes(text.toLowerCase().trim()));

                    if (matchedProducts.length > 1) {
                        const exactMatch = matchedProducts.find((p: Product) => p.title.toLowerCase() === text.toLowerCase().trim());
                        if (exactMatch) {
                            matchedProducts = [exactMatch];
                        }
                    }

                    if (matchedProducts.length === 1) {
                        const matchedProduct = matchedProducts[0];
                        try {
                            const qaResponse = await getQuestionByProduct(matchedProduct._id!, 1);
                            const questions = qaResponse.data || [];
                            const answeredQs = questions.filter((q: any) => q.answer);

                            if (answeredQs.length > 0) {
                                let msg = `Here are the questions and answers for **${matchedProduct.title}**:\n\n`;
                                answeredQs.forEach((q: any) => {
                                    msg += `**Q:** ${q.question}\n**A:** ${q.answer}\n\n`;
                                });
                                addBotMessage(msg.trim(), [
                                    {
                                        label: "❓ Ask a new question",
                                        action: () => {
                                            setAwaitingQuestionForQa(matchedProduct._id!);
                                            setQaProductName(matchedProduct.title);
                                            addBotMessage(`What is your question about **${matchedProduct.title}**? ❓`);
                                        }
                                    }
                                ]);
                            } else {
                                setAwaitingQuestionForQa(matchedProduct._id!);
                                setQaProductName(matchedProduct.title);
                                addBotMessage(`I couldn't find any answered questions for **${matchedProduct.title}**. What would you like to ask? ❓`);
                            }
                        } catch {
                            setAwaitingQuestionForQa(matchedProduct._id!);
                            setQaProductName(matchedProduct.title);
                            addBotMessage(`Got it! What is your question about **${matchedProduct.title}**? ❓`);
                        }
                    } else if (matchedProducts.length > 1) {
                        const buttons = matchedProducts.slice(0, 5).map(p => ({
                            label: p.title,
                            action: () => { sendMessage(p.title) }
                        }));
                        addBotMessage(`I found multiple products matching "${text}". Which one did you mean?`, buttons);
                        setAwaitingProductNameForQa(true);
                    } else {
                        addBotMessage(`I couldn't find any product matching "${text}". Please check the spelling and try again. 😕`);
                    }
                } catch {
                    addBotMessage("Sorry, I couldn't fetch the products right now. Please try again later.");
                }
            }, 800);
            return;
        }

        if (awaitingQuestionForQa) {
            const productId = awaitingQuestionForQa;
            setAwaitingQuestionForQa(null);
            setTimeout(async () => {
                try {
                    const qaResponse = await getQuestionByProduct(productId, 1);
                    const questions = qaResponse.data || [];

                    const userKeywords = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                    const matchedQa = questions.find(q => {
                        if (!q.answer) return false;
                        const qLower = q.question.toLowerCase();
                        return userKeywords.some(kw => qLower.includes(kw));
                    });

                    if (matchedQa) {
                        addBotMessage(`I found an answer for your question about **${qaProductName}**!\n\n**Q:** ${matchedQa.question}\n**A:** ${matchedQa.answer} ✅`);
                    } else {
                        await askQuestion({ productId, question: text });
                        addBotMessage(`I couldn't find an existing answer, so I've successfully submitted your question about **${qaProductName}**: "${text}" to our team! We will reply soon. 📩`);
                    }
                } catch {
                    addBotMessage("Sorry, I encountered an error while processing your question. Please try again later. 😕");
                }
            }, 800);
            return;
        }

        if (lowerText.includes("password") || lowerText.includes("mobile") || lowerText.includes("number") || lowerText.includes("manage address") || lowerText.includes("change address")) {
            setTimeout(() => {
                addBotMessage("You can easily manage your account details, including your password, mobile number, and saved addresses, right from your Profile section. ⚙️", [
                    { label: "👤 Go to Profile", action: () => navigate("/security") },
                    { label: "📍 Manage Addresses", action: () => navigate("/profile") }
                ]);
            }, 800);
            return;
        }

        if (lowerText.includes("ask a product question") || lowerText.includes("product question")) {
            setTimeout(() => {
                addBotMessage("Sure! Please enter the name of the product you have a question about. 📦");
                setAwaitingProductNameForQa(true);
            }, 800);
            return;
        }

        if (lowerText.includes("stock") || lowerText.includes("available") || lowerText.includes("availability")) {
            setTimeout(() => {
                addBotMessage("Sure! Please enter the name of the product you want to check availability for. 📦");
                setAwaitingProductNameForStock(true);
            }, 800);
            return;
        }

        if (lowerText === "show my wishlist" || lowerText.includes("wishlist")) {
            setTimeout(async () => {
                try {
                    const response = await getWishlistShowProducts();
                    const products = response.data?.finalProduct || [];

                    if (products.length === 0) {
                        addBotMessage("Your wishlist is currently empty! ❤️", [
                            { label: "🏠 Browse all", action: () => navigate("/") }
                        ]);
                    } else {
                        addBotMessage(`You have ${products.length} item${products.length > 1 ? "s" : ""} in your wishlist! ❤️`, undefined, products.slice(0, 6));
                    }
                } catch (error) {
                    addBotMessage("Sorry, I couldn't fetch your wishlist right now. Please try again later. 😕");
                }
            }, 800);
            return;
        }

        if (lowerText === "what's in my cart?" || lowerText.includes("cart") || lowerText.includes("my cart")) {
            setTimeout(async () => {
                try {
                    const cartData = await getCart();

                    if (!cartData || cartData.length === 0) {
                        addBotMessage("Your cart is currently empty! 🛒", [
                            { label: "🏠 Browse products", action: () => navigate("/") }
                        ]);
                    } else {
                        const subtotal = cartData.reduce((acc: number, item: any) => {
                            const itemDetail = item.items?.[0] || {};
                            const price = itemDetail.discountPrice || itemDetail.basePrice || 0;
                            return acc + (price * item.quantity);
                        }, 0);

                        addBotMessage(`🛒 **${cartData.length} Item${cartData.length > 1 ? "s" : ""}**\n💰 **Total: ₹${subtotal}**`, [
                            { label: "🛍️ View Cart", action: () => navigate("/cart") },
                            { label: "💳 Checkout", action: () => navigate("/checkout") }
                        ]);
                    }
                } catch (error) {
                    addBotMessage("Sorry, I couldn't fetch your cart right now. Please try again later. 😕");
                }
            }, 800);
            return;
        }

        const staticResponse = getBotResponse(text);
        if (staticResponse) {
            setTimeout(() => {
                addBotMessage(staticResponse);
            }, 800 + Math.random() * 700);
            return;
        }

        if (lowerText === "coupons" || lowerText.includes("coupon")) {
            setTimeout(async () => {
                try {
                    const allCoupons = await getAllcoupons();
                    if (!allCoupons || allCoupons.length === 0) {
                        addBotMessage("Currently, there are no active coupons available. Please check back later! 🎟️");
                    } else {
                        let msg = "Here are the available coupons you can use: 🎟️\n\n";
                        allCoupons.forEach((c: any) => {
                            msg += `**Code:** ${c.code}\n**Discount:** ${c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}\n**Description:** ${c.description || "Special offer!"}\n\n`;
                        });
                        addBotMessage(msg.trim(), [
                            { label: "🛍️ Shop Now", action: () => navigate("/") }
                        ]);
                    }
                } catch (error) {
                    addBotMessage("Sorry, I couldn't fetch the coupons right now. Please try again later. 😕");
                }
            }, 800);
            return;
        }

        setTimeout(() => {
            const fallbackButtons: MessageButton[] = [
                {
                    label: "📦 Track my order",
                    action: () => sendMessage("Track my order"),
                },
                {
                    label: "🔄 Return policy",
                    action: () => sendMessage("Return policy"),
                },
                {
                    label: "📏 Size guide",
                    action: () => sendMessage("Size guide"),
                },
                {
                    label: "💳 Payment options",
                    action: () => sendMessage("Payment options"),
                },
                {
                    label: "🚚 Delivery time",
                    action: () => sendMessage("Delivery time"),
                },
                {
                    label: "📍 Add new address",
                    action: () => sendMessage("Add new address"),
                },
                {
                    label: "🔍 Search products",
                    action: () => sendMessage("Search products"),
                },
                {
                    label: "🧐 Coupons",
                    action: () => sendMessage("coupons"),
                },
                {
                    label: "📞 Contact Support",
                    action: () => navigate("/help-center"),
                },
            ];
            addBotMessage(
                "I'm not sure I understand that. Please select from the options below to get help: 💬",
                fallbackButtons
            );
        }, 800 + Math.random() * 700);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <>
            <div
                className={`fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-110 bg-white rounded-2xl shadow-2xl border border-gray-200 z-9999 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen
                    ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                    : "opacity-0 scale-95 pointer-events-none translate-y-4"
                    }`}
                style={{ height: "min(75vh, 620px)" }}
            >

                <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">Vastra Verse</h3>
                            <p className="text-slate-400 text-xs">Always online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLiveChat && (
                            <button
                                onClick={() => {
                                    if (socket && liveChatRoomId) {
                                        socket.emit("chat:close", { roomId: liveChatRoomId });
                                    }
                                }}
                                className="text-[11px] font-medium px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer border border-red-500/20"
                            >
                                End Chat
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-slate-400 hover:text-white cursor-pointer"
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50" style={{ scrollbarWidth: "thin" }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                {msg.sender === "bot" && (
                                    <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center shrink-0 mt-1">
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div
                                        className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === "user"
                                            ? "bg-slate-800 text-white rounded-2xl rounded-br-md"
                                            : "bg-white border border-gray-200 text-slate-700 rounded-2xl rounded-bl-md shadow-sm"
                                            }`}
                                    >
                                        {renderMessageText(msg.text)}
                                    </div>
                                    {msg.buttons && msg.buttons.length > 0 && (
                                        <div className="flex flex-col gap-1.5 mt-2.5">
                                            {msg.buttons.map((btn, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={btn.action}
                                                    className="group/btn w-full flex items-center justify-between gap-2 text-[13px] font-medium px-3.5 py-2.5 bg-gray-50 hover:bg-slate-800 text-slate-700 hover:text-white border border-gray-200 hover:border-slate-800 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md"
                                                    style={{ animation: `fadeSlideUp 0.3s ease-out ${idx * 0.06}s both` }}
                                                >
                                                    <span>{btn.label}</span>
                                                    <svg className="w-3.5 h-3.5 text-gray-300 group-hover/btn:text-white/70 transition-all duration-200 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                                            {msg.products.map((product, idx) => (
                                                <div
                                                    key={product._id || idx}
                                                    className="shrink-0 w-28 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group/card"
                                                    style={{ animation: `fadeSlideUp 0.3s ease-out ${idx * 0.08}s both` }}
                                                    onClick={() => navigate("/more-details", { state: { product } })}
                                                >
                                                    <div className="relative h-24 w-full overflow-hidden bg-gray-100">
                                                        <img
                                                            src={product.images?.[0] || ""}
                                                            alt={product.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                        {product.discountPrice < product.basePrice && (
                                                            <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm">
                                                                {Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-[10px] font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[11px] font-bold text-gray-900">₹{product.discountPrice || product.basePrice}</span>
                                                            {product.discountPrice < product.basePrice && (
                                                                <span className="text-[9px] text-gray-400 line-through">₹{product.basePrice}</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate("/more-details", { state: { product } }); }}
                                                            className="w-full mt-1.5 text-[9px] font-semibold py-1 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-2 items-end">
                                <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {!isLiveChat && (
                    <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
                        {quickReplies.map((reply) => (
                            <button
                                key={reply}
                                onClick={() => sendMessage(reply)}
                                className="whitespace-nowrap text-xs font-medium px-3 py-1.5 bg-gray-100 hover:bg-slate-800 hover:text-white text-gray-600 rounded-full transition-colors cursor-pointer shrink-0"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                    {suggestions.length > 0 && (
                        <div className="absolute bottom-full left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden max-h-48 overflow-y-auto z-10 rounded-t-2xl">
                            {suggestions.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                        setInputValue("");
                                        setSuggestions([]);
                                        sendMessage(s);
                                    }}
                                    className="w-full text-left px-5 py-3 text-[13px] font-medium text-gray-700 hover:bg-slate-50 hover:text-slate-900 border-b border-gray-100 last:border-0 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-300 transition placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 bg-slate-800 hover:bg-slate-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-4 md:right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-99999 transition-all duration-300 cursor-pointer ${isOpen
                    ? "bg-gray-200 hover:bg-gray-300 rotate-0"
                    : "bg-slate-800 hover:bg-slate-700 rotate-0"
                    }`}
            >
                {isOpen ? (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        1
                    </span>
                )}
            </button>
        </>
    );
};