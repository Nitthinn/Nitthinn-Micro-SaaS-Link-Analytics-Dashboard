"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlController_1 = require("../controllers/urlController");
const router = express_1.default.Router();
router.get('/:shortCode', urlController_1.redirectToOriginalUrl);
exports.default = router;
//# sourceMappingURL=redirectRoute.js.map