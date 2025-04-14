import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
export interface IUser extends Document {
    typeLogin: String;
    id: string;
    tokenLogin: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    refreshToken: string;
    avatar?: string;
    role: "student" | "teacher" | "admin";
    level: number;
    total_score: number;
    isCorrectPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    id: { type: String, unique: true },
    typeLogin: { type: String },
    tokenLogin: { type: String },
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    password: { type: String },
    refreshToken: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    level: { type: Number, default: 0 },
    total_score: { type: Number, default: 0 },
},
    {
        timestamps: true
    });
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
UserSchema.methods = {
    isCorrectPassword: async function (password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}
export default mongoose.model<IUser>("User", UserSchema);
