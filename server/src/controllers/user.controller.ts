import { Request, Response } from "express";
import cloudinary from '../configs/cloudinary';
import User from "../models/User";


// Nếu bạn đã định nghĩa kiểu UserRequestDTO thì import vào nhé
// import { UserRequestDTO } from "../types"; // <-- Thay đường dẫn nếu khác

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstname, lastname } = req.body
        if (!email || !password || !lastname || !firstname) {
            res.status(400).json({
                success: false,
                mes: 'Missing inputs'
            })
            return
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) throw new Error('User has existed')
        const newUser = await User.create(req.body)
        await newUser.save()
        res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
        })
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
        return
    }

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
}

export const getCurrent = async (req: UserRequestDTO, res: Response): Promise<void> => {
    const userId = req?.user?._id
    console.log(userId);
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

export const logout = async (req: Request, res: Response): Promise<void> => {
    const cookie = req.cookies
    console.log(cookie);
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

interface FileUploadResult {
    url: string;
    id: string;
}

export const createUser = async (req: UserRequestDTO, res: Response): Promise<void> => {
    const userId = req?.user?._id
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return
    }

    if (!req.files) {
        res.status(400).json({ message: 'No files uploaded' })
        return
    }

    const files = req?.files as { [fieldname: string]: Express.Multer.File[] }
    const imageFile = files['image'][0]

    try {
        const imageResult: FileUploadResult = await new Promise(
            (resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error)
                        if (!result || !result.secure_url || !result.public_id) {
                            return reject(new Error('Cloudinary upload failed'));
                        }
                        resolve({
                            url: result.secure_url,
                            id: result.public_id,
                        })
                    }
                )
                stream.end(imageFile.buffer)
            }
        )

        const updatedUser = await User.findByIdAndUpdate(userId, { avatar: imageResult.url }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Uploaded avatar successfully',
            imageUrl: updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error uploading files' })
    }
}
