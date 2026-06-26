import {
    Clock,
    CheckCircle2,
    XCircle,
    Package,
    Truck,
} from "lucide-react";

export const getStatusStyles = (status: string) => {
    switch (status) {
        case "delivered":
            return {
                bg: "var(--color-success-muted)",
                text: "var(--color-success)",
                Icon: CheckCircle2,
            };
        case "shipped":
            return {
                bg: "var(--color-info-muted)",
                text: "var(--color-info)",
                Icon: Truck,
            };
        case "processing":
            return {
                bg: "var(--color-warning-muted)",
                text: "var(--color-warning)",
                Icon: Clock,
            };
        case "cancelled":
            return {
                bg: "var(--color-danger-muted)",
                text: "var(--color-danger)",
                Icon: XCircle,
            };
        default:
            return {
                bg: "var(--color-accent-muted)",
                text: "var(--color-accent)",
                Icon: Package,
            };
    }
}