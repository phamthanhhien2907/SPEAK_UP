import { Request, Response } from "express";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstname, lastname } = req.body
        if (!email || !password || !lastname || !firstname) {
            res.status(400).json({
                sucess: false,
                mes: 'Missing inputs'
            })
            return
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) throw new Error('User has existed')
        const newUser = await User.create(req.body)
        await newUser.save()
        res.status(200).json({
            sucess: newUser ? true : false,
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
            sucess: false,
            mes: 'Missing inputs'
        })
        return
    }


    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
}
export const loginSuccess = async (req: Request, res: Response): Promise<void> => {
    const { id, tokenLogin } = req?.body;
    console.log(id, tokenLogin);
    try {
        if (!id || !tokenLogin) {
            res.status(400).json({
                err: 1,
                msg: "missing input",
            });
        }
        const newTokenLogin = uuidv4();
        let response = await User.findOne({
            id,
            tokenLogin,
        })
        console.log(response);
        const token =
            response &&
            jwt.sign(
                {
                    id: response.id,
                    email: response.email,
                    _id: response._id,
                    role: response.role,
                },
                process.env.JWT_SECRET as string,
                { expiresIn: "5d" }
            );
        if (response) {
            await User.updateOne(
                {
                    id: response?.id,
                },
                {
                    $set: {
                        tokenLogin: newTokenLogin,
                    },
                }
            );
        }
        res.status(200).json({
            err: token ? 0 : 3,
            msg: token ? "OK" : "User not found",
            token,
            role: response?.role,
        });
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: "Failed at auth controller" + error,
        });
    }
}