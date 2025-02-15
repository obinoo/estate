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
exports.login = exports.signUp = void 0;
const authvalidator_1 = require("../validator/authvalidator");
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = authvalidator_1.signUpValidate.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { name, email, password, phone, house_no } = req.body;
        const exisitingUser = yield db_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        if (exisitingUser)
            return res.status(400).json({ error: "User already exists" });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                house_no,
            }
        });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred during login' });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = authvalidator_1.loginValidate.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const exisitingUser = yield db_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!exisitingUser)
            return res.status(400).json({ error: 'User does not exist' });
        const validPassword = yield bcrypt_1.default.compare(password, exisitingUser.password);
        if (!validPassword)
            return res.status(401).json({ error: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ email: exisitingUser.email, id: exisitingUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', user: exisitingUser, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error occurred during login' });
    }
});
exports.login = login;
