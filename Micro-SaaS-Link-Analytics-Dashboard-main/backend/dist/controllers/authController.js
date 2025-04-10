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
exports.signin = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existing = yield userModel_1.default.findOne({ email });
    if (existing) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield userModel_1.default.create({ email, password: hashedPassword });
    const token = (0, generateToken_1.generateToken)(newUser._id.toString());
    res.status(201).json({
        token,
        user: {
            id: newUser._id,
            email: newUser.email,
            message: 'user signed up sucessfully'
        },
    });
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = (0, generateToken_1.generateToken)(user._id.toString());
    res.json({
        token,
        user: {
            id: user._id,
            email: user.email,
            message: "user logged in sucessfully"
        },
    });
});
exports.signin = signin;
//# sourceMappingURL=authController.js.map