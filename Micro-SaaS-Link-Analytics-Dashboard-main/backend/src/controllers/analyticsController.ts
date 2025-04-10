import { Request, Response } from 'express';
import ClickAnalytics from '../models/analyticsModel';
import ShortLink from '../models/urlModel';
import mongoose from 'mongoose';

export const getAnalytics = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    // 1. Get all URLs created by user
    const urls = await ShortLink.find({ userId });

    // 2. Prepare click analytics data
    const urlIds = urls.map(url => url._id);

    const clicksOverTime = await ClickAnalytics.aggregate([
      { $match: { shortLinkId: { $in: urlIds } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" },
          },
          clicks: { $sum: 1 }
        }
      },
      {
        $project: {
          date: {
            $concat: [
              { $toString: '$_id.year' },
              "-",
              { $toString: '$_id.month' },
              "-",
              { $toString: '$_id.day' }
            ]
          },
          clicks: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 3. Get device/browser stats
    const deviceStats = await ClickAnalytics.aggregate([
      { $match: { shortLinkId: { $in: urlIds } } },
      {
        $group: {
          _id: { device: "$device", browser: "$browser" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: {
            $concat: ["$_id.device", " - ", "$_id.browser"]
          },
          count: 1,
          _id: 0
        }
      }
    ]);

    // 4. Format URLs with useful data
    const formattedUrls = urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.FRONTEND_URL}/${url.shortCode}`,
      clicks: url.totalClicks,
      createdAt: url.createdAt,
      expired: url.expirationDate ? url.expirationDate < new Date() : false,
    }));

    res.status(200).json({
      urls: formattedUrls,
      clicksOverTime,
      deviceStats
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
