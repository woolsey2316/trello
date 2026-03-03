import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = Router();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value ?? "";
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                email,
                username: profile.displayName,
                hashedPassword: "",
              });
            }
          }
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
};

// Redirect to Google consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"], session: false })
);

// Google redirects here after consent
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user as { _id: string };
    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

export default router;
