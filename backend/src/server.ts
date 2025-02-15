import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './route/authRoute';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(body) {
        console.log('Response being sent:', body);
        return originalJson.call(this, body);
    };
    next();
});

const allowedOrigins = ['http://localhost:3000', 'http://example.com'];
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'], 
        credentials: true, 
    })
);



// Initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID:      process.env.GOOGLE_CLIENT_ID as string,
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:   "http://localhost:8080/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    try {
        // Here you would typically find or create the user in the database
        // For this example, we'll just return the profile provided by Google
        return done(null, { profile, accessToken, refreshToken });
      } catch (error) {
        return done(error);
      }
    }) 
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });


  app.use('/auth', authRoute);


app.listen(8080, (()=>{
    console.log('Server is running on port 8080');
}));



