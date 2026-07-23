import express from 'express';
import Dorm from '../models/dormModel.js';
import Review from '../models/reviewModel.js';
import { upload } from '../config/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get all dorms
router.get('/dorms', async (req, res) => {
    try {
        const dorms = await Dorm.find();
        res.json(dorms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new dorm
router.post('/dorms', requireAuth, writeLimiter, async (req, res) => {
    const dorm = new Dorm({
        name: req.body.name,
        description: req.body.description,
        amenities: req.body.amenities,
        location: req.body.location,
        imageUrl: req.body.imageUrl,
    });

    try {
        const newDorm = await dorm.save();
        res.status(201).json(newDorm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Search dorms
router.get('/dorms/search', async (req, res) => {
    const query = req.query.q;
    try {
        const dorms = await Dorm.find({ name: new RegExp(query, 'i') });
        res.json(dorms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single dorm by ID
router.get('/dorms/:id', async (req, res) => {
    try {
        const dorm = await Dorm.findById(req.params.id);
        if (!dorm) {
            return res.status(404).json({ message: 'Dorm not found' });
        }
        res.json(dorm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload photos for a dorm
router.post('/dorms/:id/photos', requireAuth, writeLimiter, upload.array('photos', 5), async (req, res) => {
    try {
        const dorm = await Dorm.findById(req.params.id);
        if (!dorm) {
            return res.status(404).json({ message: 'Dorm not found' });
        }

        const uploadedUrls = (req.files || []).map((file) => file.secure_url);
        if (uploadedUrls.length === 0) {
            return res.status(400).json({ message: 'No photos were uploaded' });
        }

        dorm.images = [...(dorm.images || []), ...uploadedUrls];
        if (!dorm.imageUrl) {
            dorm.imageUrl = uploadedUrls[0];
        }

        await dorm.save();
        res.status(201).json(dorm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Review a dorm
router.post('/reviews/submit', requireAuth, writeLimiter, async (req, res) => {
  console.log('Received review submission:', req.body); // Log the request body
  try {
    const { dorm, rating, review, attributes } = req.body;
    const dormExists = await Dorm.findById(dorm);
    if (!dormExists) {
      console.error('Dorm does not exist'); // Log error
      return res.status(400).json({ error: 'Dorm does not exist' });
    }

    const existingReview = await Review.findOne({ dorm, userId: req.user.uid });
    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this dorm' });
    }

    const newReview = new Review({
      dorm,
      rating,
      review,
      attributes,
      userId: req.user.uid,
      userEmail: req.user.email,
    });
    await newReview.save();
    console.log('Review saved:', newReview); // Log the saved review
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'You have already reviewed this dorm' });
    }
    console.error('Error saving review:', error); // Log error
    res.status(400).json({ error: 'Failed to submit review' });
  }
});
  // Get reviews for a specific dorm
  router.get('/reviews/dorm/:dormId', async (req, res) => {
    try {
      const { dormId } = req.params;
      const reviews = await Review.find({ dorm: dormId }).populate('dorm', 'name');
      console.log('Fetched reviews:', reviews); // Log fetched reviews
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error); // Log error
      res.status(500).json({ message: error.message });
    }
  });
  
// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('dorm', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;