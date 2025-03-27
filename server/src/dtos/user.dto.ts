import { Request } from "express";
export interface UserRequestDTO extends Request {
    user?: { _id: string; role: string };
}
