import passport from 'passport';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import { VerifyCallback } from 'passport-oauth2';
import dotenv from 'dotenv';
import { generateRefreshToken } from '../middlewares/jwt';

dotenv.config();
export interface GoogleUserProfile extends GoogleProfile {
    _id: string
    tokenLogin: string;
    role: string;
    email: string;
    avatar: string;
    username: string;
    firstname: string;
    lastname: string;
    typeLogin: string;

}

// Define a custom interface that extends FacebookProfile and includes additional properties
export interface FacebookUserProfile extends FacebookProfile {
    _id: string
    tokenLogin: string;
    role: string;
    email: string;
    avatar: string;
    username: string;
    firstname: string;
    lastname: string;
    typeLogin: string;
}
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/api/auth/google/callback',
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: GoogleProfile,
            cb: VerifyCallback
        ) => {
            const tokenLogin = uuidv4();
            const newRefreshToken = generateRefreshToken(profile.id);
            try {
                if (profile.id) {
                    const user = await User.findOne({ id: profile.id });
                    if (!user) {
                        await User.create({
                            id: profile.id,
                            email: profile.emails?.[0]?.value,
                            typeLogin: profile.provider,
                            avatar: profile.photos?.[0]?.value,
                            username: profile.displayName,
                            firstname: profile.name?.givenName,
                            lastname: profile.name?.familyName,
                            tokenLogin,
                            role: 'student',  // Set role or handle it as necessary
                            refreshToken: newRefreshToken,
                        });
                    } else {
                        await User.updateOne({ id: profile.id }, { $set: { tokenLogin, refreshToken: newRefreshToken } });
                    }
                }

                // Creating a custom user object with tokenLogin
                const profileWithToken: GoogleUserProfile = {
                    ...profile,
                    tokenLogin,
                    id: profile.id,
                    _id: profile.id,
                    role: 'student', // Define role or other properties
                    email: profile.emails?.[0]?.value || '',
                    avatar: profile.photos?.[0]?.value || '',
                    username: profile.displayName || '',
                    firstname: profile.name?.givenName || '',
                    lastname: profile.name?.familyName || '',
                    typeLogin: profile.provider,
                };

                return cb(null, profileWithToken);  // Pass the custom profile
            } catch (error) {
                console.error(error);
                return cb(error);
            }
        }
    )
);

// Facebook OAuth Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
            callbackURL: '/api/auth/facebook/callback',
            profileFields: ['email', 'photos', 'id', 'displayName'],
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: FacebookProfile,
            cb: VerifyCallback
        ) => {
            const tokenLogin = uuidv4();
            const newRefreshToken = generateRefreshToken(profile.id);
            try {
                if (profile.id) {
                    const user = await User.findOne({ id: profile.id });
                    if (!user) {
                        await User.create({
                            id: profile.id,

                            email: profile.emails?.[0]?.value,
                            typeLogin: profile.provider,
                            avatar: profile.photos?.[0]?.value,
                            username: profile.displayName,
                            firstname: profile.name?.givenName,
                            lastname: profile.name?.familyName,
                            tokenLogin,
                            role: 'student',  // Set role or handle it as necessary
                            refreshToken: newRefreshToken,
                        });
                    } else {
                        await User.updateOne({ id: profile.id }, { $set: { tokenLogin, refreshToken: newRefreshToken } });
                    }
                }

                // Creating a custom user object with tokenLogin
                const profileWithToken: FacebookUserProfile = {
                    ...profile,
                    tokenLogin,
                    id: profile.id,
                    _id: profile?.id,
                    role: 'student', // Define role or other properties
                    email: profile.emails?.[0]?.value || '',
                    avatar: profile.photos?.[0]?.value || '',
                    username: profile.displayName || ',',
                    firstname: profile.name?.givenName || '',
                    lastname: profile.name?.familyName || '',
                    typeLogin: profile.provider,
                };

                return cb(null, profileWithToken);  // Pass the custom profile
            } catch (error) {
                console.error(error);
                return cb(error);
            }
        }
    )
);
