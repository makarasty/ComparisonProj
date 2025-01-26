import { Schema, model, Document } from "mongoose";
import { IProduct } from "../interfaces/Product";

interface DeviceDocument extends IProduct, Document {}

const deviceSchema = new Schema<DeviceDocument>(
	{
		title: {
			type: String,
			default: "Unknown",
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			index: true,
			min: 0,
		},
		brand: {
			type: String,
			default: "Unknown",
		},
		category: {
			type: String,
			default: "other",
		},
		image: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
		},
		stock: {
			type: Number,
			min: 0,
			default: 0,
		},
		dimensions: {
			width: {
				type: Number,
				min: 0,
			},
			height: {
				type: Number,
				min: 0,
			},
			depth: {
				type: Number,
				min: 0,
			},
		},
		specifications: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

deviceSchema.index({ price: 1 });
deviceSchema.index({ brand: 1 });
deviceSchema.index({ category: 1 });

export default model<DeviceDocument>("Device", deviceSchema);
