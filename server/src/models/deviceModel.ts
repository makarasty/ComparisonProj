import { Schema, model, Document } from "mongoose";
import { IProduct } from "../interfaces/Product";

interface ProductDocument extends IProduct, Document {}

const dimensionsSchema = new Schema(
	{
		width: { type: Number, required: true },
		height: { type: Number, required: true },
		depth: { type: Number, required: true },
		weight: { type: Number },
		unit: { type: String },
	},
	{ _id: false },
);

const warrantySchema = new Schema(
	{
		period: { type: Number, required: true },
		unit: {
			type: String,
			required: true,
			enum: ["days", "months", "years"],
		},
		description: { type: String },
	},
	{ _id: false },
);

const metadataSchema = new Schema(
	{
		isNewProduct: { type: Boolean, default: false },
		isFeatured: { type: Boolean, default: false },
		isPopular: { type: Boolean, default: false },
	},
	{ _id: false },
);

const productSchema = new Schema(
	{
		uuid: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		brand: {
			type: String,
			required: false,
			trim: true,
			index: true,
		},
		category: {
			type: String,
			required: false,
			trim: true,
			index: true,
		},
		image: {
			type: String,
			required: false,
			trim: true,
		},
		images: [
			{
				type: String,
				trim: true,
			},
		],
		rating: {
			type: Number,
			required: false,
			min: 0,
			max: 5,
			default: 0,
		},
		stock: {
			type: Number,
			required: false,
			min: 0,
			default: 0,
		},
		discount: {
			type: Number,
			min: 0,
			max: 100,
		},
		available: {
			type: Boolean,
			default: true,
		},
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		dimensions: {
			type: dimensionsSchema,
			required: false,
		},
		specifications: {
			type: Map,
			of: Schema.Types.Mixed,
			required: false,
		},
		warranty: {
			type: warrantySchema,
			required: false,
		},
		metadata: {
			type: metadataSchema,
			required: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ "metadata.isNewProduct": 1 });
productSchema.index({ "metadata.isFeatured": 1 });
productSchema.index({ "metadata.isPopular": 1 });

productSchema.virtual("priceWithDiscount").get(function () {
	if (!this.discount) return this.price;
	return this.price * (1 - this.discount / 100);
});

productSchema.pre("save", function (next) {
	this.available = Boolean(this.stock && this.stock > 0);
	next();
});

export const Product = model<ProductDocument>("Product", productSchema);
export default Product;
