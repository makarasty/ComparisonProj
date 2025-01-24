import { Schema, model, Document } from "mongoose";
import { IDevice } from "../interfaces/Device";

interface DeviceDocument extends IDevice, Document {}

const deviceSchema = new Schema<DeviceDocument>(
	{
		name: { type: String, required: true },
		category: { type: String, required: true, index: true },
		brand: { type: String, default: "" },
		specifications: {
			type: Object,
			default: {},
		},
		rating: { type: Number, default: 0, index: true },
	},
	{
		timestamps: true,
	},
);

deviceSchema.index({ "specifications.price": 1 });

export default model<DeviceDocument>("Device", deviceSchema);
