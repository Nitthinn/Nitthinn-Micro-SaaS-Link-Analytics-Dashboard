"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const urlRoute_1 = __importDefault(require("./routes/urlRoute"));
const redirectRoute_1 = __importDefault(require("./routes/redirectRoute"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || '3001';
const mongoUri = process.env.MONGO_URI;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoute_1.default);
app.use('/api/auth', urlRoute_1.default);
app.use('/', redirectRoute_1.default);
app.get('/', (req, res) => {
    res.send('<h1>This is backend</h1>');
});
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log('Connected to mongodb');
})
    .catch((error) => {
    console.error('Failed to connect : ', error);
});
app.listen({ port }, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map