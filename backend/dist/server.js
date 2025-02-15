"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./route/authRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        console.log('Response being sent:', body);
        return originalJson.call(this, body);
    };
    next();
});
const allowedOrigins = ['http://localhost:3000', 'http://example.com'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Initialize passport and session support
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/google/callback",
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    try {
        // Here you would typically find or create the user in the database
        // For this example, we'll just return the profile provided by Google
        return done(null, { profile, accessToken, refreshToken });
    }
    catch (error) {
        return done(error);
    }
}));
// Serialize user into session
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
// Deserialize user from session
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
app.use('/auth', authRoute_1.default);
app.listen(8080, (() => {
    console.log('Server is running on port 8080');
}));
