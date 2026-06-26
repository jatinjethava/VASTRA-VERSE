import mongoose, { Document } from "mongoose";
import { ADDRESS_LABEL } from "../common";

export interface AddressDocument extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    label: typeof ADDRESS_LABEL[keyof typeof ADDRESS_LABEL],
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: Boolean,
    isDeleted: Boolean,
}

const addressSchema = new mongoose.Schema<AddressDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, enum: [ADDRESS_LABEL.HOME, ADDRESS_LABEL.OFFICE, ADDRESS_LABEL.OTHER], default: ADDRESS_LABEL.HOME },
    addressLine1: { type: String, required: true, minLength: 5, maxLength: 100 },
    addressLine2: { type: String, required: false, minLength: 5, maxLength: 100 },
    city: { type: String, required: true, minLength: 2, maxLength: 25 },
    state: { type: String, required: true, minLength: 2, maxLength: 25 },
    pincode: { type: String, required: true, minLength: 6, maxLength: 6 },
    country: { type: String, required: true, minLength: 3, maxLength: 25 },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const addressModel = mongoose.model<AddressDocument>("Address", addressSchema);