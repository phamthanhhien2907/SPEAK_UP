import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { login, loginSuccess, register } from "../controllers/auth.controller";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);
router.get(
    "/google/callback",
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "google",
            (
                err: Error | null,
                user: Express.User | false | null,
                info: object | undefined
            ) => {
                if (err) return next(err);
                if (!user) return res.redirect(`${process.env.CLIENT_URL}/login-failure`);
                req.user = user as Express.User;
                next();
            }
        )(req, res, next);
    },
    (req: Request, res: Response) => {
        const { id, tokenLogin } = req.user || {};
        res.redirect(`${process.env.CLIENT_URL}/login-success/${id}/${tokenLogin}`);
    }
);

router.get(
    "/facebook",
    passport.authenticate("facebook", {
        session: false,
        scope: ["email"],
    })
);
router.get(
    "/facebook/callback",
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "facebook",
            (
                err: Error | null,
                user: Express.User | false | null,
                info: object | undefined
            ) => {
                if (err) return next(err);
                if (!user) return res.redirect(`${process.env.CLIENT_URL}/login-failure`);
                req.user = user as Express.User;
                next();
            }
        )(req, res, next);
    },
    (req: Request, res: Response) => {
        const { id, tokenLogin } = req.user || {};
        res.redirect(`${process.env.CLIENT_URL}/login-success/${id}/${tokenLogin}`);
    }
);
router.post("/login-success", loginSuccess);

export default router;
