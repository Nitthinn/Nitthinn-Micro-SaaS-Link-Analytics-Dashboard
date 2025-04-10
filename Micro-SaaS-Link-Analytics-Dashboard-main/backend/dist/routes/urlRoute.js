"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlController_1 = require("../controllers/urlController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/shorten', authMiddleware_1.authenticate, urlController_1.createShortUrl);
router.get('/analytics', authMiddleware_1.authenticate, urlController_1.getAnalyticsForAllLinks);
router.post('/search', authMiddleware_1.authenticate, urlController_1.searchShortenedUrls);
router.get('/links', authMiddleware_1.authenticate, urlController_1.getLinksForUser);
exports.default = router;
//# sourceMappingURL=urlRoute.js.map