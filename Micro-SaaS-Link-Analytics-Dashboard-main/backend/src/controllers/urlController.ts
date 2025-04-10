import { Request, Response } from 'express';
import {nanoid}  from 'nanoid';
import UrlShort from '../models/urlModel';

import Analysis from '../models/analyticsModel';
import {UAParser} from 'ua-parser-js'; 


// Extend Request to include authenticated user info
interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
  };
}

// Define expected body shape
interface ShortenUrlBody {
  originalUrl: string;
  customAlias?: string;
  expirationDate?: string; 
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const createShortUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { originalUrl, customAlias, expirationDate } = req.body as ShortenUrlBody;
    const userId = req.user?._id;

    if (!originalUrl || !userId) {
      res.status(400).json({ message: 'Missing originalUrl or userId' });
      return;
    }

    const shortCode = customAlias || nanoid(6);

    const existing = await UrlShort.findOne({ shortCode });
    if (existing) {
      res.status(409).json({ message: 'Custom alias already in use' });
      return;
    }

    const shortLink = await UrlShort.create({
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
  } catch (err) {
    console.error('Error creating short link:', err);
    res.status(500).json({ message: 'Server error', err });
  }
};

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




export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const shortLink = await UrlShort.findOne({ shortCode });

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
    await shortLink.save();

    // Parse device and browser info from user-agent
    const parser = new UAParser(req.headers['user-agent'] || '');
    const ua = parser.getResult();


    await Analysis.create({
      shortLinkId: shortLink._id,
      timestamp: new Date(),
      ip: req.ip,
      device: ua.device.type || 'desktop',
      browser: ua.browser.name,
      location: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    res.redirect(shortLink.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
};

export const getAnalyticsForAllLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Step 1: Get all short links for the user
    const shortLinks = await UrlShort.find({ userId });

    if (!shortLinks.length) {
      res.status(404).json({ message: 'No short links found for the user' });
      return;
    }

    // Step 2: Get all analytics for these links
    const shortLinkIds = shortLinks.map(link => link._id);

    const analytics = await Analysis.find({ shortLinkId: { $in: shortLinkIds } }).sort({ timestamp: -1 });

    res.json({ analytics });
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const searchShortenedUrls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user?._id;

    if (!originalUrl || !userId) {
      res.status(400).json({ message: 'Missing originalUrl or unauthorized' });
      return;
    }

    // Case-insensitive partial match
    const results = await UrlShort.find({
      userId,
      originalUrl: { $regex: originalUrl, $options: 'i' },
    });

    res.status(200).json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLinksForUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const links = await UrlShort.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(links);
  } catch (err) {
    console.error('Error fetching user links:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
