import { Request, Response } from "express";
import cloudinary from '../configs/cloudinary';
import User, { IUser } from "../models/User";
import crypto from "crypto";
import dotenv from 'dotenv';
import sendMail from "../utils/sendMail";
import sharp from "sharp";
dotenv.config();
interface FileUploadResult {
    url: string;
    id: string;
}
export const getCurrent = async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id
    const user = await User.findById(userId).select('-refreshToken -password -role')
    res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
}
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await User.find()
    res.status(200).json({
        success: users ? true : false,
        rs: users ? users : 'Users not found'
    })
}
export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
}
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { email, role, firstname, lastname, level, password } = req.body
    console.log(email, role, firstname, lastname, level);
    if (!id) throw new Error('Missing exercise id')
    if (!email || !role || !firstname || !lastname || !level || !password) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
}
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing exercise id')
    const user = await User.findByIdAndDelete(id)
    res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'Exercise not found'
    })
}
export const logout = async (req: Request, res: Response): Promise<void> => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) {
        res.status(400).json({ success: false, msg: 'No refresh token in cookies' });
        return
    }
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // chỉ secure trên production
        sameSite: 'strict',
        path: '/',   // phải khớp với path khi set cookie
    })
    res.status(200).json({
        success: true,
        mes: 'Logout successful'
    })
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    console.log(email);
    if (!email) throw new Error('Missing email')

    const user = await User.findOne({ email }) as IUser | null;
    console.log(user);
    if (!user) {
        throw new Error('User not found');
    }

    const resetToken = user.createPasswordChangedToken(); // raw token
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
        <p>Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.</p>
        <p>Link này sẽ hết hạn sau 15 phút kể từ bây giờ.</p>
        <a href="${resetUrl}">Click here</a>
    `;

    const data = {
        email,
        html
    };

    const rs = await sendMail(data);

    res.status(200).json({
        success: true,
        rs
    });
};
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { password, token } = req.body;

    if (!password || !token) {
        throw new Error('Missing inputs');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }) as IUser | null;

    if (!user) {
        throw new Error('Invalid or expired reset token');
    }

    user.password = password; // sẽ được hash lại trong pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date().toISOString();

    await user.save();

    res.status(200).json({
        success: true,
        mes: 'Updated password'
    });
};


export const updateProfileOrPassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id;
    if (!userId) {
        res.status(400).json({ success: false, rs: "User ID is missing" });
        return;
    }

    const { firstname, lastname, address, gender, password, phoneNumber, currentPassword } = req.body;
    const files = req?.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    try {
        let user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, rs: "User not found" });
            return;
        }

        // Kiểm tra mật khẩu cũ nếu muốn đổi mật khẩu
        if (password) {
            if (!currentPassword) {
                res.status(400).json({ success: false, rs: "Current password is required to change password" });
                return;
            }

            const isValid = await user.isCorrectPassword(currentPassword);
            if (!isValid) {
                res.status(401).json({ success: false, rs: "Current password is incorrect" });
                return;
            }

            user.password = password;
            user.passwordChangedAt = new Date().toISOString();
        }

        // Cập nhật các trường khác
        user.firstname = firstname ?? user.firstname;
        user.lastname = lastname ?? user.lastname;
        user.address = address ?? user.address;
        user.gender = gender ?? user.gender;
        user.phoneNumber = phoneNumber ?? user.phoneNumber;

        // Xử lý avatar nếu có
        if (files && files["avatar"]?.length > 0) {
            const imageFile = files["avatar"][0];
            const resizedBuffer = await sharp(imageFile.buffer).resize({ width: 300 }).toBuffer();

            const uploadResult = await new Promise<FileUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image", upload_preset: "speak-up" },
                    (error, result) => {
                        if (error || !result?.secure_url) return reject(error || new Error("Upload failed"));
                        resolve({ url: result.secure_url, id: result.public_id });
                    }
                ).end(resizedBuffer);
            });

            user.avatar = uploadResult.url;
        }

        // Lưu lại user
        await user.save();

        const updatedUser = await User.findById(userId)
            .select("-password -refreshToken -role")
            .lean();

        res.status(200).json({
            success: true,
            rs: updatedUser,
        });

    } catch (error) {
        console.error("Error updating profile or password:", error);
        res.status(500).json({ success: false, rs: `Error updating profile or password: ${error}` });
    }
};
