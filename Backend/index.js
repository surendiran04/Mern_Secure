const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const {initiateDBConnection } = require('./Database/DBconfig')
const dotenv = require('dotenv');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");
const { googleAuth,currentUser } = require("./Controllers/Authentication.controller");
let PORT= process.env.PORT;
const BACKEND_URL=process.env.BACKEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL=process.env.BACKEND_URL
const {AuthModel} = require("./Models/userModel")

const app=express();
dotenv.config();
app.use(cors());
app.use(body_parser.json());
app.use("/api/auth", require('./Router/routes'));    // app.use(AuthRouter)

 
const router = express.Router();
app.use("/", router);

router.post("/auth/google/callback", googleAuth);
router.get('/current_user',currentUser);

app.use(
    cookieSession({
      name: "session",
      keys: [process.env.COOKIE_SECRET],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  
  // Passport configuration
  app.use(passport.initialize());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            accessToken,
            refreshToken,
          };
  
          const result = await googleAuth(userData);
          done(null, result);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await AuthModel.findById(id);
    done(null, user);
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }), // No session management
    (req, res) => {
      try {
        const { token } = req.user;
        res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}`);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
  

initiateDBConnection();


app.listen(PORT,()=>{
    console.log(`Server connected successfully at ${PORT}`);
})
