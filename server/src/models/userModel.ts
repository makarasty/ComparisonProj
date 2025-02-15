import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import type { CallbackError } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password: string;
	role: "admin" | "user";
}

export interface IUserDocument extends IUser, Document<Types.ObjectId> {
	comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			required: true,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err: unknown) {
		next(err as CallbackError);
	}
});

userSchema.methods.comparePassword = async function (
	password: string,
): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

const UserModel = model<IUserDocument>("User", userSchema);
export default UserModel;
