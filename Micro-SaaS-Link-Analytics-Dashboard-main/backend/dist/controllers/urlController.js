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
exports.getLinksForUser = exports.searchShortenedUrls = exports.getAnalyticsForAllLinks = exports.redirectToOriginalUrl = exports.createShortUrl = void 0;
const nanoid_1 = require("nanoid");
const urlModel_1 = __importDefault(require("../models/urlModel"));
const analyticsModel_1 = __importDefault(require("../models/analyticsModel"));
const ua_parser_js_1 = require("ua-parser-js");
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const createShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { originalUrl, customAlias, expirationDate } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!originalUrl || !userId) {
            res.status(400).json({ message: 'Missing originalUrl or userId' });
            return;
        }
        const shortCode = customAlias || (0, nanoid_1.nanoid)(6);
        const existing = yield urlModel_1.default.findOne({ shortCode });
        if (existing) {
            res.status(409).json({ message: 'Custom alias already in use' });
            return;
        }
        const shortLink = yield urlModel_1.default.create({
            userId,
            originalUrl,
            shortCode,
            customAlias,
            expirationDate: expirationDate ? new Date(expirationDate) : undefined,
        });
        res.status(201).json({
            shortUrl: `${BASE_URL}/${shortLink.shortCode}`,
            shortCode: shortLink.shortCode,
        });
    }
    catch (err) {
        console.error('Error creating short link:', err);
        res.status(500).json({ message: 'Server error', err });
    }
});
exports.createShortUrl = createShortUrl;
// export const redirectToOriginalUrl = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { shortCode } = req.params;
//     const shortLink = await UrlShort.findOne({ shortCode });
//     if (!shortLink) {
//       res.status(404).send('Short link not found');
//       return;
//     }
//     if (shortLink.expirationDate && shortLink.expirationDate < new Date()) {
//       res.status(410).send('This short link has expired');
//       return;
//     }
//     shortLink.totalClicks += 1;
//     await shortLink.save();
//     res.redirect(shortLink.originalUrl);
//   } catch (err) {
//     console.error('Redirect error:', err);
//     res.status(500).send('Server error');
//   }
// };
const redirectToOriginalUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortCode } = req.params;
        const shortLink = yield urlModel_1.default.findOne({ shortCode });
        if (!shortLink) {
            res.status(404).send('Short link not found');
            return;
        }
        if (shortLink.expirationDate && shortLink.expirationDate < new Date()) {
            res.status(410).send('This short link has expired');
            return;
        }
        // Increment click count
        shortLink.totalClicks += 1;
        yield shortLink.save();
        // Parse device and browser info from user-agent
        const parser = new ua_parser_js_1.UAParser(req.headers['user-agent'] || '');
        const ua = parser.getResult();
        yield analyticsModel_1.default.create({
            shortLinkId: shortLink._id,
            timestamp: new Date(),
            ip: req.ip,
            device: ua.device.type || 'desktop',
            browser: ua.browser.name,
            location: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        });
        res.redirect(shortLink.originalUrl);
    }
    catch (err) {
        console.error('Redirect error:', err);
        res.status(500).send('Server error');
    }
});
exports.redirectToOriginalUrl = redirectToOriginalUrl;
const getAnalyticsForAllLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Step 1: Get all short links for the user
        const shortLinks = yield urlModel_1.default.find({ userId });
        if (!shortLinks.length) {
            res.status(404).json({ message: 'No short links found for the user' });
            return;
        }
        // Step 2: Get all analytics for these links
        const shortLinkIds = shortLinks.map(link => link._id);
        const analytics = yield analyticsModel_1.default.find({ shortLinkId: { $in: shortLinkIds } }).sort({ timestamp: -1 });
        res.json({ analytics });
    }
    catch (err) {
        console.error('Analytics fetch error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAnalyticsForAllLinks = getAnalyticsForAllLinks;
const searchShortenedUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { originalUrl } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!originalUrl || !userId) {
            res.status(400).json({ message: 'Missing originalUrl or unauthorized' });
            return;
        }
        // Case-insensitive partial match
        const results = yield urlModel_1.default.find({
            userId,
            originalUrl: { $regex: originalUrl, $options: 'i' },
        });
        res.status(200).json({ results });
    }
    catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchShortenedUrls = searchShortenedUrls;
const getLinksForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const links = yield urlModel_1.default.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(links);
    }
    catch (err) {
        console.error('Error fetching user links:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getLinksForUser = getLinksForUser;
//# sourceMappingURL=urlController.js.map