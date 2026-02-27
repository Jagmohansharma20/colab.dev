import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL ? `${process.env.SERVER_URL}/auth/google/callback` : "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {

      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
      };
      console.log("Hello");
      console.log(user);
      console.log("FULL GOOGLE PROFILE:", profile);
      console.log("PROFILE PHOTOS:", profile.photos);
      return done(null, user);
    }
  )
);

export default passport;