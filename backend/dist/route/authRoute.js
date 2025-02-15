"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controller/auth");
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post('/signUp', auth_1.signUp);
router.get('/login', auth_1.login);
// Route for initiating Google login
router.get('/google/login', (req, res, next) => {
    req.query.action = 'login'; // Set action to 'login' for this route
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        state: 'login',
    })(req, res, next);
});
// Route for initiating Google login
router.get('/google/signup', (req, res, next) => {
    req.query.action = 'signup'; // Set action to 'login' for this route
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        state: 'signup',
    })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
    passport_1.default.authenticate('google', (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(err);
        const action = req.query.action || 'login'; // Default to 'login'
        if (!user)
            return res.redirect(`http://localhost:3000/${action}?error=google_login_failed`);
        let exisitingUser = yield db_1.default.user.findUnique({
            where: {
                googleID: user.profile.id
            }
        });
        if (!exisitingUser && action === 'signup') {
            const { name, email, email_verified, picture } = user.profile._json;
            exisitingUser = yield db_1.default.user.create({
                data: {
                    name,
                    email,
                    googleID: user.profile.id,
                    profileImage: picture,
                    role: 'RESIDENT', // Default role
                    referralSource: "Google OAuth",
                    isVerified: email_verified,
                    phone: ""
                }
            });
        }
        if (!exisitingUser) {
            return res.redirect('/login?error=Account not found. Please sign up.');
        }
        const token = jsonwebtoken_1.default.sign({
            email: exisitingUser.email,
            id: exisitingUser.id,
            isverified: exisitingUser.isVerified
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect('/dashboard'); // Redirect after successful login
    }));
    // 4 Logout
    router.get('/logout', (req, res) => {
        req.logout((err) => {
            if (err)
                return res.status(500).json({ error: 'Logout failed' });
            res.json({ message: 'Logged out successfully' });
        });
    });
});
exports.default = router;
