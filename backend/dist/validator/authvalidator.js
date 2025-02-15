"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidate = exports.signUpValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signUpValidate = joi_1.default.object({
    name: joi_1.default.string().min(4).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    phone: joi_1.default.string().min(11).max(11).required(),
    house_no: joi_1.default.string().required()
});
exports.loginValidate = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
