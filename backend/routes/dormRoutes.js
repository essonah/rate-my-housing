import express from 'express';
import Dorm from '../models/dormModel.js';
import Review from '../models/reviewModel.js';

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
router.post('/dorms', async (req, res) => {
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

// Review a dorm
router.post('/reviews/submit', async (req, res) => {
  console.log('Received review submission:', req.body); // Log the request body
  try {
    const { dorm, rating, review } = req.body;
    const dormExists = await Dorm.findById(dorm);
    if (!dormExists) {
      console.error('Dorm does not exist'); // Log error
      return res.status(400).json({ error: 'Dorm does not exist' });
    }
    const newReview = new Review({ dorm, rating, review });
    await newReview.save();
    console.log('Review saved:', newReview); // Log the saved review
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error saving review:', error); // Log error
    res.status(400).json({ error: 'Failed to submit review' });
  }
});
  // Get reviews for a specific dorm
  // Get reviews for a specific dorm
router.get('/reviews/dorm/:dormId', async (req, res) => {
  try {
    const { dormId } = req.params;
    const reviews = await Review.find({ dorm: dormId }).populate('dorm', 'name');
    res.json(reviews);
  } catch (error) {
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